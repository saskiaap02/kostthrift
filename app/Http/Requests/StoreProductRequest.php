<?php

namespace App\Http\Requests;

use App\Enums\ProductCondition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:5', 'max:100'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'condition' => ['required', Rule::enum(ProductCondition::class)],
            'price' => ['required', 'integer', 'min:1000', 'max:100000000'],
            'original_price' => ['nullable', 'integer', 'gt:price', 'max:100000000'],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
            'campus_id' => ['required', 'integer', 'exists:campuses,id'],
            'location_note' => ['nullable', 'string', 'max:80'],
            'images' => ['required', 'array', 'min:1', 'max:5'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul barang wajib diisi.',
            'title.min' => 'Judul minimal 5 karakter.',
            'title.max' => 'Judul maksimal 100 karakter.',
            'category_id.required' => 'Pilih kategori barang.',
            'category_id.exists' => 'Kategori tidak valid.',
            'condition.required' => 'Pilih kondisi barang.',
            'condition.enum' => 'Kondisi barang tidak valid.',
            'price.required' => 'Harga wajib diisi.',
            'price.integer' => 'Harga harus berupa angka.',
            'price.min' => 'Harga minimal Rp 1.000.',
            'price.max' => 'Harga maksimal Rp 100.000.000.',
            'original_price.integer' => 'Harga asli harus berupa angka.',
            'original_price.gt' => 'Harga asli harus lebih besar dari harga jual.',
            'description.required' => 'Deskripsi wajib diisi.',
            'description.min' => 'Deskripsi minimal 10 karakter.',
            'description.max' => 'Deskripsi maksimal 2000 karakter.',
            'campus_id.required' => 'Pilih kampus lokasi barang.',
            'campus_id.exists' => 'Kampus tidak valid.',
            'location_note.max' => 'Detail area maksimal 80 karakter.',
            'images.required' => 'Unggah minimal 1 foto.',
            'images.min' => 'Unggah minimal 1 foto.',
            'images.max' => 'Maksimal 5 foto.',
            'images.*.image' => 'File harus berupa gambar.',
            'images.*.mimes' => 'Foto harus berformat JPG, PNG, atau WEBP.',
            'images.*.max' => 'Ukuran tiap foto maksimal 2 MB.',
            'images.*.uploaded' => 'Foto gagal diunggah. Ukurannya mungkin melebihi batas server.',
        ];
    }
}
