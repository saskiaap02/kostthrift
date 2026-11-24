<?php

namespace App\Http\Resources;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Butuh relasi: items.product.primaryImage, buyer.campus.university, seller.campus.university.
 * `role` dan `counterpart` relatif terhadap pengguna yang sedang melihat.
 *
 * @mixin \App\Models\Order
 */
class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $viewer = $request->user();
        $role = $viewer?->id === $this->seller_id ? 'seller' : 'buyer';
        $counterpart = $role === 'seller' ? $this->buyer : $this->seller;

        // Info rekening hanya terbuka setelah penjual menyetujui, dan hanya untuk kedua pihak.
        $showPayment = $this->payment_method === PaymentMethod::Transfer
            && $this->payment_snapshot !== null
            && in_array($this->status, [
                OrderStatus::AwaitingPayment,
                OrderStatus::PaymentReported,
                OrderStatus::Paid,
                OrderStatus::Completed,
            ], true);

        $human = fn ($date) => $date?->locale('id')->diffForHumans();

        return [
            'code' => $this->code,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'payment_method' => $this->payment_method->value,
            'payment_method_label' => $this->payment_method->label(),
            'total' => $this->total,
            'buyer_note' => $this->buyer_note,
            'seller_note' => $this->seller_note,
            'cancel_reason' => $this->cancel_reason,
            'role' => $role,
            'counterpart' => [
                'name' => $counterpart->name,
                'ktm_verified' => $counterpart->ktm_verified_at !== null,
                'campus' => $counterpart->campus?->label,
                'joined' => $counterpart->created_at->locale('id')->translatedFormat('F Y'),
            ],
            'items' => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'price' => $item->price,
                'slug' => $item->product?->slug,
                'image_url' => $item->product?->primaryImage?->url,
            ])->all(),
            'payment_info' => $showPayment ? $this->payment_snapshot : null,
            'payment_proof_url' => $this->payment_proof_path ? "/pesanan/{$this->code}/bukti-bayar" : null,
            'created_at' => $human($this->created_at),
            'timeline' => [
                'accepted_at' => $human($this->accepted_at),
                'payment_reported_at' => $human($this->payment_reported_at),
                'paid_at' => $human($this->paid_at),
                'completed_at' => $human($this->completed_at),
                'cancelled_at' => $human($this->cancelled_at),
            ],
            'actions' => $viewer ? app(OrderService::class)->actionsFor($this->resource, $viewer) : [],
        ];
    }
}
