<?php

namespace App\Http\Requests;

use App\Enums\ProductCondition;
use App\Enums\SortOption;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validasi query string Beranda (juga dipakai endpoint "muat lebih banyak").
 * Contoh: /?q=kipas&kondisi=second&kategori=elektronik&kampus=unsri-bukit&urut=termurah
 */
class HomeIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:100'],
            'kondisi' => ['nullable', Rule::enum(ProductCondition::class)],
            'kategori' => ['nullable', 'string', 'exists:categories,slug'],
            'kampus' => ['nullable', 'string', 'exists:campuses,slug'],
            'urut' => ['nullable', Rule::enum(SortOption::class)],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Filter yang sudah dinormalisasi: selalu lengkap, nilai kosong = ''.
     * Bentuk yang sama dikirim balik ke React sebagai prop `filters`.
     *
     * @return array{q: string, kondisi: string, kategori: string, kampus: string, urut: string}
     */
    public function filters(): array
    {
        $validated = $this->validated();

        return [
            'q' => $validated['q'] ?? '',
            'kondisi' => $validated['kondisi'] ?? '',
            'kategori' => $validated['kategori'] ?? '',
            'kampus' => $validated['kampus'] ?? '',
            'urut' => $validated['urut'] ?? SortOption::default()->value,
        ];
    }
}
