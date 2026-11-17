<?php

namespace App\Http\Requests;

use App\Enums\PaymentAccountType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** "1234 5678-90" -> "1234567890" */
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('account_number'))) {
            $this->merge([
                'account_number' => preg_replace('/[\s\-]/', '', $this->input('account_number')),
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(PaymentAccountType::class)],
            'provider' => ['required', 'string', 'max:40'],
            'account_name' => ['required', 'string', 'max:80'],
            'account_number' => ['required', 'string', 'regex:/^[0-9]{5,25}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Pilih jenis akun.',
            'provider.required' => 'Isi nama bank atau e-wallet.',
            'provider.max' => 'Nama maksimal 40 karakter.',
            'account_name.required' => 'Isi nama pemilik akun.',
            'account_name.max' => 'Nama pemilik maksimal 80 karakter.',
            'account_number.required' => 'Isi nomor rekening atau e-wallet.',
            'account_number.regex' => 'Nomor hanya boleh angka (5 sampai 25 digit).',
        ];
    }
}
