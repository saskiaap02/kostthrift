<?php

namespace App\Http\Requests;

use App\Enums\ProductStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Pencarian dan filter untuk daftar di panel admin (iklan, pengguna). */
class AdminListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // akses dijaga middleware EnsureAdmin
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::enum(ProductStatus::class)],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /** @return array{q: string, status: string} */
    public function filters(): array
    {
        $validated = $this->validated();

        return [
            'q' => $validated['q'] ?? '',
            'status' => $validated['status'] ?? '',
        ];
    }
}
