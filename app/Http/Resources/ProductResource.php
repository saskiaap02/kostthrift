<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Product
 */
class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'price' => $this->price,
            'original_price' => $this->original_price,
            'discount_percent' => $this->discount_percent,
            'condition' => $this->condition->value,
            'condition_label' => $this->condition->label(),
            'location_label' => $this->location_label,
            'image_url' => $this->primaryImage?->url,
            'status' => $this->status->value,
            'is_wishlisted' => (bool) ($this->is_wishlisted ?? false),
            'seller' => [
                'name' => $this->seller->name,
                'ktm_verified' => $this->seller->ktm_verified_at !== null,
            ],
        ];
    }
}
