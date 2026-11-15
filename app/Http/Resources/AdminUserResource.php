<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * Butuh relasi: campus.university.
 *
 * @mixin \App\Models\User
 */
class AdminUserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'campus' => $this->campus?->label,
            'verified' => $this->ktm_verified_at !== null,
            'verified_at' => $this->ktm_verified_at
                ? Carbon::parse($this->ktm_verified_at)->locale('id')->diffForHumans()
                : null,
            'joined_at' => $this->created_at->locale('id')->diffForHumans(),
        ];
    }
}
