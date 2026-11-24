<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminOrderListRequest;
use App\Http\Resources\AdminOrderResource;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Pemantauan seluruh pesanan (hanya baca; admin tidak mengubah status pesanan). */
class OrderMonitorController extends Controller
{
    /** Daftar pesanan, bisa dicari (kode / nama / email) dan difilter status: GET /admin/pesanan */
    public function index(AdminOrderListRequest $request): Response
    {
        $filters = $request->filters();
        $term = $filters['q'];

        $orders = Order::query()
            ->with(['buyer:id,name,email', 'seller:id,name,email', 'items:id,order_id,title'])
            ->when($filters['status'] !== '', fn (Builder $query) => $query->where('status', $filters['status']))
            ->when($term !== '', function (Builder $query) use ($term) {
                $like = '%'.addcslashes($term, '%_\\').'%';

                $query->where(fn (Builder $match) => $match
                    ->where('code', 'like', $like)
                    ->orWhereHas('buyer', fn (Builder $user) => $user
                        ->where('name', 'like', $like)->orWhere('email', 'like', $like))
                    ->orWhereHas('seller', fn (Builder $user) => $user
                        ->where('name', 'like', $like)->orWhere('email', 'like', $like)));
            })
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => AdminOrderResource::collection($orders),
            'filters' => $filters,
            'statuses' => collect(OrderStatus::cases())
                ->map(fn ($status) => ['value' => $status->value, 'label' => $status->label()])
                ->all(),
        ]);
    }

    /** Foto bukti transfer (disk privat): GET /admin/pesanan/{kode}/bukti-bayar */
    public function paymentProof(Order $order): StreamedResponse
    {
        $disk = Storage::disk('local');

        abort_unless($order->payment_proof_path && $disk->exists($order->payment_proof_path), 404);

        return $disk->response($order->payment_proof_path, null, [
            'Cache-Control' => 'private, no-store, max-age=0',
            'X-Content-Type-Options' => 'nosniff',
            'X-Robots-Tag' => 'noindex, nofollow',
        ]);
    }
}
