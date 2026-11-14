<?php

namespace App\Services;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

/**
 * Menayangkan dan mengubah iklan (termasuk foto) dalam satu transaksi.
 * Kalau database gagal, foto baru yang sudah terunggah ikut dihapus.
 */
class ProductPublishingService
{
    /**
     * @param  array<string, mixed>  $data  hasil validasi tanpa `images`
     * @param  array<int, UploadedFile>  $images  foto pertama = foto utama
     */
    public function publish(User $seller, array $data, array $images): Product
    {
        $paths = [];

        try {
            foreach ($images as $image) {
                $paths[] = $image->store('products', 'public');
            }

            return DB::transaction(function () use ($seller, $data, $paths): Product {
                $product = Product::create([
                    ...$data,
                    'seller_id' => $seller->id,
                    'slug' => $this->uniqueSlug($data['title']),
                    'status' => ProductStatus::Active,
                ]);

                foreach ($paths as $index => $path) {
                    $product->images()->create([
                        'path' => $path,
                        'is_primary' => $index === 0,
                        'sort_order' => $index,
                    ]);
                }

                return $product;
            });
        } catch (Throwable $e) {
            Storage::disk('public')->delete($paths);

            throw $e;
        }
    }

    /**
     * Ubah data iklan dan susun ulang foto.
     * Slug tidak diubah agar tautan lama tetap berlaku.
     *
     * @param  array<string, mixed>  $data  isian iklan (tanpa foto)
     * @param  array<int, string>  $imageOrder  token "existing:{id}" / "new:{indeks}", foto pertama = utama
     * @param  array<int, UploadedFile>  $newFiles  foto baru, diacu oleh token "new:{indeks}"
     */
    public function update(Product $product, array $data, array $imageOrder, array $newFiles): Product
    {
        $newPaths = [];
        $removedPaths = [];

        try {
            // Simpan hanya foto baru yang benar-benar dipakai.
            foreach ($imageOrder as $token) {
                [$type, $reference] = explode(':', $token);

                if ($type === 'new' && isset($newFiles[(int) $reference])) {
                    $newPaths[(int) $reference] = $newFiles[(int) $reference]->store('products', 'public');
                }
            }

            DB::transaction(function () use ($product, $data, $imageOrder, $newPaths, &$removedPaths): void {
                $product->update($data);

                $current = $product->images()->get()->keyBy('id');
                $keptIds = [];

                foreach ($imageOrder as $position => $token) {
                    [$type, $reference] = explode(':', $token);

                    if ($type === 'existing') {
                        $image = $current->get((int) $reference);
                        $image->update(['sort_order' => $position, 'is_primary' => $position === 0]);
                        $keptIds[] = $image->id;
                    } else {
                        $product->images()->create([
                            'path' => $newPaths[(int) $reference],
                            'sort_order' => $position,
                            'is_primary' => $position === 0,
                        ]);
                    }
                }

                // Catatan: Collection::except() milik Eloquent membuang kunci id,
                // jadi id diambil lewat modelKeys(), bukan keys().
                $removed = $current->except($keptIds);
                $removedPaths = $removed->pluck('path')->all();
                $product->images()->whereIn('id', $removed->modelKeys())->delete();
            });
        } catch (Throwable $e) {
            Storage::disk('public')->delete(array_values($newPaths));

            throw $e;
        }

        $this->deleteFiles($removedPaths);

        return $product->refresh();
    }

    /** Hapus file foto di disk "public" (URL penuh dari data contoh dilewati). */
    private function deleteFiles(array $paths): void
    {
        $local = array_filter($paths, fn (string $path) => ! Str::startsWith($path, ['http://', 'https://']));

        if ($local !== []) {
            Storage::disk('public')->delete(array_values($local));
        }
    }

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug(Str::limit($title, 60, '')) ?: 'barang';

        do {
            $slug = $base.'-'.Str::lower(Str::random(6));
        } while (Product::withTrashed()->where('slug', $slug)->exists());

        return $slug;
    }
}
