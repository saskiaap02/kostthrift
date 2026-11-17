<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Data lengkap satu produk untuk halaman detail.
 * Membutuhkan relasi: images, seller, campus.university, category.
 * `is_wishlisted` dan `in_cart` diisi lewat loadExists() di controller (user login).
 *
 * @mixin \App\Models\Product
 */
class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'original_price' => $this->original_price,
            'discount_percent' => $this->discount_percent,
            'condition' => $this->condition->value,
            'condition_label' => $this->condition->label(),
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'location_label' => $this->location_label,
            'images' => $this->images
                ->map(fn ($image) => ['id' => $image->id, 'url' => $image->url])
                ->all(),
            'category' => [
                'slug' => $this->category->slug,
                'name' => $this->category->name,
            ],
            'campus' => [
                'slug' => $this->campus->slug,
                'label' => $this->campus->label,
                'university' => $this->campus->university->name,
                'city' => $this->campus->city,
                'province' => $this->campus->province,
            ],
            'seller' => [
                'id' => $this->seller->id,
                'name' => $this->seller->name,
                'ktm_verified' => $this->seller->ktm_verified_at !== null,
                'member_since' => $this->seller->created_at->locale('id')->translatedFormat('F Y'),
            ],
            'posted_at' => $this->created_at->locale('id')->diffForHumans(),
            'is_owner' => $request->user()?->id === $this->seller_id,
            'is_wishlisted' => (bool) ($this->is_wishlisted ?? false),
            'in_cart' => (bool) ($this->in_cart ?? false),
        ];
    }
}
