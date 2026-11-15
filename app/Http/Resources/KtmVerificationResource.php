<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Sengaja TIDAK memuat path file. Foto hanya diakses lewat route /verifikasi-ktm/{id}/dokumen
 * yang dijaga policy.
 *
 * @mixin \App\Models\KtmVerification
 */
class KtmVerificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'rejection_reason' => $this->rejection_reason,
            'submitted_at' => $this->created_at->locale('id')->diffForHumans(),
            'reviewed_at' => $this->reviewed_at?->locale('id')->diffForHumans(),
            'has_document' => $this->document_path !== null,
            'university' => $this->whenLoaded('university', fn () => $this->university->name),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'reviewer' => $this->whenLoaded('reviewer', fn () => $this->reviewer?->name),
        ];
    }
}
