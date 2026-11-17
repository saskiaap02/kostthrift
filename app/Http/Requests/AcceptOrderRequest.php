<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AcceptOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null; // peran penjual diperiksa OrderService
    }

    public function rules(): array
    {
        return [
            // Hanya rekening milik penjual sendiri.
            'payment_account_id' => [
                'nullable',
                'integer',
                Rule::exists('payment_accounts', 'id')->where('user_id', $this->user()->id),
            ],
            'seller_note' => ['nullable', 'string', 'max:300'],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_account_id.exists' => 'Rekening tidak valid.',
            'seller_note.max' => 'Catatan maksimal 300 karakter.',
        ];
    }
}
