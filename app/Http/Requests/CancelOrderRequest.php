<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CancelOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'min:3', 'max:200'],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Tulis alasan agar pihak lain tahu penyebabnya.',
            'reason.min' => 'Alasan minimal 3 karakter.',
            'reason.max' => 'Alasan maksimal 200 karakter.',
        ];
    }
}
