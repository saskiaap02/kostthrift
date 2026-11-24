<?php

namespace App\Http\Requests;

use App\Enums\ReportReason;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null; // aturan lain (bukan iklan sendiri, dll.) dicek di controller
    }

    public function rules(): array
    {
        return [
            'reason' => ['required', Rule::enum(ReportReason::class)],
            // Alasan "Lainnya" wajib dijelaskan agar admin tahu apa yang dilaporkan.
            'detail' => [
                Rule::requiredIf(fn () => $this->input('reason') === ReportReason::Other->value),
                'nullable', 'string', 'min:5', 'max:300',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'Pilih alasan pelaporan.',
            'reason.enum' => 'Alasan pelaporan tidak dikenal.',
            'detail.required' => 'Jelaskan masalahnya untuk alasan "Lainnya".',
            'detail.min' => 'Keterangan minimal 5 karakter.',
            'detail.max' => 'Keterangan maksimal 300 karakter.',
        ];
    }
}
