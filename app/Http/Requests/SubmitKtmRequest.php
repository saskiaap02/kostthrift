<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitKtmRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'document' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:4096', 'dimensions:min_width=500,min_height=300'],
            'university_id' => ['required', 'integer', 'exists:universities,id'],
            'consent' => ['accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'document.required' => 'Unggah foto KTM kamu.',
            'document.image' => 'File harus berupa gambar.',
            'document.mimes' => 'Foto harus berformat JPG atau PNG.',
            'document.max' => 'Ukuran foto maksimal 4 MB.',
            'document.uploaded' => 'Foto gagal diunggah. Ukurannya mungkin melebihi batas server.',
            'document.dimensions' => 'Foto terlalu kecil. Pastikan KTM terbaca jelas (minimal 500 x 300 piksel).',
            'university_id.required' => 'Pilih universitasmu.',
            'university_id.exists' => 'Universitas tidak valid.',
            'consent.accepted' => 'Kamu harus menyetujui pemeriksaan KTM untuk melanjutkan.',
        ];
    }
}
