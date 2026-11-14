<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Baris di halaman Iklan Saya.
 * Butuh relasi primaryImage dan campus.university, plus withCount('wishlistedBy').
 *
 * @mixin \App\Models\Product
 */
class MyProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'price' => $this->price,
            'original_price' => $this->original_price,
            'condition' => $this->condition->value,
            'condition_label' => $this->condition->label(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'location_label' => $this->location_label,
            'image_url' => $this->primaryImage?->url,
            'posted_at' => $this->created_at->locale('id')->diffForHumans(),
            'wishlist_count' => (int) ($this->wishlisted_by_count ?? 0),
        ];
    }
}
