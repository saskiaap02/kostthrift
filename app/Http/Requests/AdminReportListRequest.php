<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Filter daftar laporan di panel admin: status (default: menunggu ditinjau). */
class AdminReportListRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // akses dijaga middleware EnsureAdmin
    }

    public function rules(): array
    {
        return [
            'status' => ['nullable', Rule::in(['pending', 'resolved', 'dismissed', 'all'])],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /** @return array{status: string} */
    public function filters(): array
    {
        return ['status' => $this->validated()['status'] ?? 'pending'];
    }
}
