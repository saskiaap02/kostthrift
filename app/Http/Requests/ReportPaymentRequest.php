<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReportPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_proof' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_proof.required' => 'Unggah foto bukti transfer terlebih dahulu.',
            'payment_proof.image' => 'Bukti transfer harus berupa file gambar.',
            'payment_proof.mimes' => 'Format foto harus JPG, JPEG, PNG, atau WebP.',
            'payment_proof.max' => 'Ukuran foto bukti transfer maksimal 5 MB.',
        ];
    }
}