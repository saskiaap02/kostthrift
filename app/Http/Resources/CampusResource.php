<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Campus
 */
class CampusResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'city' => $this->city,
            'province' => $this->province,
            'label' => $this->label,
            'university' => [
                'slug' => $this->university->slug,
                'name' => $this->university->name,
                'short_name' => $this->university->short_name,
            ],
        ];
    }
}
