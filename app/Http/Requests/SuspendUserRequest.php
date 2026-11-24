<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SuspendUserRequest extends FormRequest
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
            'reason.required' => 'Tulis alasan pemblokiran.',
            'reason.min' => 'Alasan minimal 5 karakter.',
            'reason.max' => 'Alasan maksimal 200 karakter.',
        ];
    }
}
