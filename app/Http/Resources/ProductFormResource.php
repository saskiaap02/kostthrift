<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Nilai awal form Edit Iklan (butuh relasi images).
 *
 * @mixin \App\Models\Product
 */
class ProductFormResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'category_id' => $this->category_id,
            'condition' => $this->condition->value,
            'price' => $this->price,
            'original_price' => $this->original_price,
            'description' => $this->description,
            'campus_id' => $this->campus_id,
            'location_note' => $this->location_note,
            'images' => $this->images
                ->map(fn ($image) => ['id' => $image->id, 'url' => $image->url])
                ->all(),
        ];
    }
}
