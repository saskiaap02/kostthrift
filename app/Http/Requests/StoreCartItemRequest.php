<?php

namespace App\Http\Requests;

use App\Enums\ProductStatus;
use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'integer',
                Rule::exists('products', 'id')
                    ->where('status', ProductStatus::Active->value)
                    ->whereNull('deleted_at'),
            ],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $product = Product::with('seller:id,suspended_at')->find($this->integer('product_id'));

                if ($product && $product->seller_id === $this->user()->id) {
                    $validator->errors()->add('product_id', 'Kamu tidak bisa membeli barangmu sendiri.');
                }

                if ($product && $product->seller->isSuspended()) {
                    $validator->errors()->add('product_id', 'Barang ini sudah tidak tersedia.');
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.exists' => 'Barang ini sudah tidak tersedia.',
        ];
    }
}
