<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Butuh relasi: primaryImage, seller, campus.university.
 *
 * @mixin \App\Models\Product
 */
class AdminProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'price' => $this->price,
            'condition_label' => $this->condition->label(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'image_url' => $this->primaryImage?->url,
            'location_label' => $this->location_label,
            'posted_at' => $this->created_at->locale('id')->diffForHumans(),
            'seller' => [
                'name' => $this->seller->name,
                'ktm_verified' => $this->seller->ktm_verified_at !== null,
            ],
        ];
    }
}
