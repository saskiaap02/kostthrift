<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RejectKtmRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null; // akses admin dijaga middleware EnsureAdmin
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'min:5', 'max:200'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Tulis alasan penolakan agar mahasiswa tahu apa yang harus diperbaiki.',
            'reason.min' => 'Alasan minimal 5 karakter.',
            'reason.max' => 'Alasan maksimal 200 karakter.',
        ];
    }
}
