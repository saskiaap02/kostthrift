<?php

namespace App\Http\Requests;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PlaceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'seller_id' => ['required', 'integer', 'exists:users,id'],
            'payment_method' => ['required', Rule::enum(PaymentMethod::class)],
            'buyer_note' => ['nullable', 'string', 'max:300'],
        ];
    }

    public function messages(): array
    {
        return [
            'seller_id.required' => 'Penjual tidak valid.',
            'seller_id.exists' => 'Penjual tidak ditemukan.',
            'payment_method.required' => 'Pilih cara pembayaran.',
            'payment_method.enum' => 'Cara pembayaran tidak valid.',
            'buyer_note.max' => 'Catatan maksimal 300 karakter.',
        ];
    }
}
