<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Pesanan untuk pemantauan admin. Butuh relasi: buyer, seller, items.
 * Rekening penjual (payment_snapshot) sengaja TIDAK ikut: admin hanya memantau status dan bukti transfer.
 *
 * @mixin \App\Models\Order
 */
class AdminOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'payment_method' => $this->payment_method->value,
            'payment_method_label' => $this->payment_method->label(),
            'total' => $this->total,
            'buyer' => ['name' => $this->buyer->name, 'email' => $this->buyer->email],
            'seller' => ['name' => $this->seller->name, 'email' => $this->seller->email],
            'items' => $this->items->pluck('title')->all(),
            'cancel_reason' => $this->cancel_reason,
            'payment_proof_url' => $this->payment_proof_path ? "/admin/pesanan/{$this->code}/bukti-bayar" : null,
            'created_at' => $this->created_at->locale('id')->diffForHumans(),
            'payment_reported_at' => $this->payment_reported_at?->locale('id')->diffForHumans(),
        ];
    }
}
