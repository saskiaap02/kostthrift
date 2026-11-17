<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Hanya nomor tersamar (4 digit terakhir). Nomor lengkap hanya muncul di pesanan
 * yang sudah disetujui, lewat salinan di OrderResource.
 *
 * @mixin \App\Models\PaymentAccount
 */
class PaymentAccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type->value,
            'type_label' => $this->type->label(),
            'provider' => $this->provider,
            'account_name' => $this->account_name,
            'masked_number' => $this->masked_number,
        ];
    }
}
