<?php

namespace App\Http\Requests;

use Illuminate\Validation\Validator;

/**
 * Validasi edit iklan. Aturan isian sama dengan StoreProductRequest, kecuali foto:
 * - `images`      = foto BARU yang diunggah (boleh kosong)
 * - `image_order` = urutan akhir semua foto, token "existing:{id}" atau "new:{indeks di images}".
 *                   Foto pertama = foto utama. Foto lama yang tidak disebut akan dihapus.
 */
class UpdateProductRequest extends StoreProductRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('update', $this->route('product'));
    }

    public function rules(): array
    {
        return [
            ...array_diff_key(parent::rules(), ['images' => 1, 'images.*' => 1]),
            'images' => ['nullable', 'array', 'max:5'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'image_order' => ['required', 'array', 'min:1', 'max:5'],
            'image_order.*' => ['string', 'regex:/^(existing|new):\d+$/'],
        ];
    }

    public function messages(): array
    {
        return [
            ...parent::messages(),
            'image_order.required' => 'Sisakan minimal 1 foto.',
            'image_order.min' => 'Sisakan minimal 1 foto.',
            'image_order.max' => 'Maksimal 5 foto.',
            'image_order.*.regex' => 'Data foto tidak valid.',
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                $order = (array) $this->input('image_order', []);
                $ownIds = $this->route('product')->images()->pluck('id')->all();
                $files = (array) $this->file('images', []);

                if (count($order) !== count(array_unique($order))) {
                    $validator->errors()->add('image_order', 'Data foto tidak valid.');

                    return;
                }

                foreach ($order as $token) {
                    if (! is_string($token) || ! preg_match('/^(existing|new):(\d+)$/', $token, $match)) {
                        continue;
                    }

                    $reference = (int) $match[2];

                    if ($match[1] === 'existing' && ! in_array($reference, $ownIds, true)) {
                        $validator->errors()->add('image_order', 'Foto lama tidak ditemukan.');
                    }

                    if ($match[1] === 'new' && ! isset($files[$reference])) {
                        $validator->errors()->add('image_order', 'Foto baru tidak ditemukan.');
                    }
                }
            },
        ];
    }
}
