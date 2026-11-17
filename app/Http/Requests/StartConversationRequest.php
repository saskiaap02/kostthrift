<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StartConversationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->role !== UserRole::Admin;
    }

    public function rules(): array
    {
        return [
            'recipient_id' => ['required', 'integer', 'exists:users,id'],
            'product_slug' => ['nullable', 'string', 'exists:products,slug'],
            'initial_message' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'recipient_id.required' => 'Penerima pesan wajib dipilih.',
            'recipient_id.exists' => 'Pengguna tujuan tidak ditemukan.',
            'product_slug.exists' => 'Produk tidak ditemukan.',
            'initial_message.max' => 'Pesan maksimal 1.000 karakter.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $recipientId = (int) $this->input('recipient_id');

            if ($recipientId === $this->user()?->id) {
                $validator->errors()->add('recipient_id', 'Kamu tidak dapat mengirim pesan ke akun sendiri.');
                return;
            }

            $recipient = User::query()->find($recipientId);
            if ($recipient && $recipient->role === UserRole::Admin) {
                $validator->errors()->add('recipient_id', 'Akun admin tidak menerima pesan langsung.');
            }
        });
    }
}