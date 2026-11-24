<?php

namespace App\Http\Requests;

use App\Enums\AdminActionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminAuditLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // akses dijaga middleware EnsureAdmin
    }

    public function rules(): array
    {
        return [
            'action' => ['nullable', Rule::enum(AdminActionType::class)],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /** @return array{action: string} */
    public function filters(): array
    {
        return ['action' => $this->validated()['action'] ?? ''];
    }
}
