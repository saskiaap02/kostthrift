<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Butuh relasi: reporter, handler, product (withTrashed) beserta primaryImage dan seller.
 * `pending_for_product` (jumlah laporan menunggu untuk iklan yang sama) diisi controller.
 *
 * @mixin \App\Models\Report
 */
class AdminReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $product = $this->product;

        return [
            'id' => $this->id,
            'reason' => $this->reason->value,
            'reason_label' => $this->reason->label(),
            'detail' => $this->detail,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'reported_at' => $this->created_at->locale('id')->diffForHumans(),
            'handled_at' => $this->handled_at?->locale('id')->diffForHumans(),
            'handled_by' => $this->handler?->name,
            'reporter' => ['name' => $this->reporter->name],
            'pending_for_product' => (int) ($this->pending_for_product ?? 0),
            'product' => [
                'slug' => $product->slug,
                'title' => $product->title,
                'price' => $product->price,
                'image_url' => $product->primaryImage?->url,
                'taken_down' => $product->trashed(),
                'seller' => [
                    'name' => $product->seller->name,
                    'email' => $product->seller->email,
                    'suspended' => $product->seller->suspended_at !== null,
                ],
            ],
        ];
    }
}
