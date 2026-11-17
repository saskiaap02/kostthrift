<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\ProductStatus;
use App\Models\Order;
use App\Models\PaymentAccount;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Seluruh aturan pesanan ada di sini (siapa boleh melakukan apa pada status apa).
 * Barang bekas hanya 1 unit, jadi saat dipesan barang "ditahan" (status reserved)
 * dan dikembalikan bila pesanan dibatalkan, atau menjadi terjual bila selesai.
 * KosThrift tidak memproses uang: service ini hanya mencatat status.
 */
class OrderService
{
    /** Buat pesanan dari barang troli milik satu penjual. */
    public function place(User $buyer, int $sellerId, PaymentMethod $method, ?string $note): Order
    {
        if ($sellerId === $buyer->id) {
            $this->fail('Kamu tidak bisa memesan barangmu sendiri.', 'seller_id');
        }

        return DB::transaction(function () use ($buyer, $sellerId, $method, $note): Order {
            $cartIds = $buyer->cartProducts()
                ->where('products.seller_id', $sellerId)
                ->pluck('products.id');

            if ($cartIds->isEmpty()) {
                $this->fail('Tidak ada barang dari penjual ini di troli.', 'seller_id');
            }

            // Kunci baris produk agar dua pembeli tidak memesan barang yang sama bersamaan.
            $products = Product::query()
                ->whereIn('id', $cartIds->all())
                ->lockForUpdate()
                ->get()
                ->filter(fn (Product $product) => $product->status === ProductStatus::Active);

            if ($products->isEmpty()) {
                $this->fail('Barang di troli sudah tidak tersedia.', 'seller_id');
            }

            $order = Order::create([
                'code' => $this->uniqueCode(),
                'buyer_id' => $buyer->id,
                'seller_id' => $sellerId,
                'status' => OrderStatus::Pending,
                'payment_method' => $method,
                'total' => (int) $products->sum('price'),
                'buyer_note' => $note,
            ]);

            foreach ($products as $product) {
                $order->items()->create([
                    'product_id' => $product->id,
                    'title' => $product->title,
                    'price' => $product->price,
                ]);
            }

            Product::query()
                ->whereIn('id', $products->modelKeys())
                ->update(['status' => ProductStatus::Reserved->value]);

            $buyer->cartProducts()->detach($cartIds->all());

            return $order;
        });
    }

    /** Penjual menyetujui. Untuk transfer, wajib memilih rekening penerima. */
    public function accept(Order $order, User $seller, ?int $paymentAccountId, ?string $sellerNote): Order
    {
        return DB::transaction(function () use ($order, $seller, $paymentAccountId, $sellerNote): Order {
            $order = $this->lock($order);
            $this->assertSeller($order, $seller);
            $this->assertStatus($order, [OrderStatus::Pending]);

            if ($order->payment_method === PaymentMethod::Cod) {
                $order->update([
                    'status' => OrderStatus::Accepted,
                    'seller_note' => $sellerNote,
                    'accepted_at' => now(),
                ]);

                return $order;
            }

            $account = $paymentAccountId
                ? PaymentAccount::query()->where('user_id', $seller->id)->find($paymentAccountId)
                : null;

            if (! $account) {
                $this->fail('Pilih rekening atau e-wallet untuk menerima pembayaran.', 'payment_account_id');
            }

            $order->update([
                'status' => OrderStatus::AwaitingPayment,
                'seller_note' => $sellerNote,
                'accepted_at' => now(),
                // Salinan saat disetujui: perubahan rekening setelahnya tidak memengaruhi pesanan ini.
                'payment_snapshot' => [
                    'type_label' => $account->type->label(),
                    'provider' => $account->provider,
                    'account_name' => $account->account_name,
                    'account_number' => $account->account_number,
                ],
            ]);

            return $order;
        });
    }

    /** Pembeli atau penjual membatalkan (penjual pada status pending = menolak). */
    public function cancel(Order $order, User $actor, string $reason): Order
    {
        return DB::transaction(function () use ($order, $actor, $reason): Order {
            $order = $this->lock($order);
            $this->assertParticipant($order, $actor);
            $this->assertStatus($order, [OrderStatus::Pending, OrderStatus::Accepted, OrderStatus::AwaitingPayment]);

            $order->update([
                'status' => OrderStatus::Cancelled,
                'cancel_reason' => $reason,
                'cancelled_by' => $actor->id,
                'cancelled_at' => now(),
            ]);

            $this->setProductStatus($order, ProductStatus::Reserved, ProductStatus::Active);

            return $order;
        });
    }

    /** Pembeli melapor sudah mentransfer beserta bukti foto. */
    public function reportPayment(Order $order, User $buyer, string $proofPath): Order
    {
        return DB::transaction(function () use ($order, $buyer, $proofPath): Order {
            $order = $this->lock($order);
            $this->assertBuyer($order, $buyer);
            $this->assertStatus($order, [OrderStatus::AwaitingPayment]);

            $order->update([
                'status' => OrderStatus::PaymentReported,
                'payment_proof_path' => $proofPath,
                'payment_reported_at' => now(),
            ]);

            return $order;
        });
    }

    /** Penjual memastikan uang sudah masuk ke rekeningnya. */
    public function confirmPayment(Order $order, User $seller): Order
    {
        return DB::transaction(function () use ($order, $seller): Order {
            $order = $this->lock($order);
            $this->assertSeller($order, $seller);
            $this->assertStatus($order, [OrderStatus::AwaitingPayment, OrderStatus::PaymentReported]);

            $order->update([
                'status' => OrderStatus::Paid,
                'paid_at' => now(),
            ]);

            return $order;
        });
    }

    /** Barang sudah berpindah tangan. COD: dari "disetujui". Transfer: dari "pembayaran dikonfirmasi". */
    public function complete(Order $order, User $actor): Order
    {
        return DB::transaction(function () use ($order, $actor): Order {
            $order = $this->lock($order);
            $this->assertParticipant($order, $actor);

            $this->assertStatus($order, [
                $order->payment_method === PaymentMethod::Cod ? OrderStatus::Accepted : OrderStatus::Paid,
            ]);

            $order->update([
                'status' => OrderStatus::Completed,
                'completed_at' => now(),
            ]);

            $this->setProductStatus($order, ProductStatus::Reserved, ProductStatus::Sold);

            return $order;
        });
    }

    /**
     * Aksi yang boleh dilakukan `$user` pada `$order` saat ini.
     * Dipakai UI agar tombol yang tampil selalu sama dengan aturan di atas.
     *
     * @return list<string>
     */
    public function actionsFor(Order $order, User $user): array
    {
        $buyer = $user->id === $order->buyer_id;
        $seller = $user->id === $order->seller_id;

        return match ($order->status) {
            OrderStatus::Pending => match (true) {
                $seller => ['accept', 'cancel'],
                $buyer => ['cancel'],
                default => [],
            },
            OrderStatus::Accepted => ($buyer || $seller) ? ['complete', 'cancel'] : [],
            OrderStatus::AwaitingPayment => match (true) {
                $buyer => ['report_payment', 'cancel'],
                $seller => ['confirm_payment', 'cancel'],
                default => [],
            },
            OrderStatus::PaymentReported => $seller ? ['confirm_payment'] : [],
            OrderStatus::Paid => ($buyer || $seller) ? ['complete'] : [],
            default => [],
        };
    }

    private function lock(Order $order): Order
    {
        return Order::query()->lockForUpdate()->findOrFail($order->id);
    }

    /** @param  list<OrderStatus>  $allowed */
    private function assertStatus(Order $order, array $allowed): void
    {
        if (! in_array($order->status, $allowed, true)) {
            $this->fail('Pesanan ini tidak bisa diubah dari status "'.$order->status->label().'".');
        }
    }

    private function assertBuyer(Order $order, User $user): void
    {
        abort_unless($user->id === $order->buyer_id, 403);
    }

    private function assertSeller(Order $order, User $user): void
    {
        abort_unless($user->id === $order->seller_id, 403);
    }

    private function assertParticipant(Order $order, User $user): void
    {
        abort_unless($user->id === $order->buyer_id || $user->id === $order->seller_id, 403);
    }

    private function setProductStatus(Order $order, ProductStatus $from, ProductStatus $to): void
    {
        Product::query()
            ->whereIn('id', $order->items()->pluck('product_id'))
            ->where('status', $from->value)
            ->update(['status' => $to->value]);
    }

    private function uniqueCode(): string
    {
        do {
            $code = 'KT-'.Str::upper(Str::random(6));
        } while (Order::query()->where('code', $code)->exists());

        return $code;
    }

    private function fail(string $message, string $key = 'order'): never
    {
        throw ValidationException::withMessages([$key => $message]);
    }
}