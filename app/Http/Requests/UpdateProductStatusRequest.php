<?php

namespace App\Http\Requests;

use App\Enums\ProductStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('update', $this->route('product'));
    }

    public function rules(): array
    {
        return [
            // Penjual hanya boleh memindahkan iklan antara aktif dan terjual.
            'status' => ['required', Rule::in([ProductStatus::Active->value, ProductStatus::Sold->value])],
        ];
    }
}
