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
 * Menayangkan iklan: simpan foto, buat produk + gambar dalam satu transaksi.
 * Kalau database gagal, foto yang sudah terunggah ikut dihapus.
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

    private function uniqueSlug(string $title): string
    {
        $base = Str::slug(Str::limit($title, 60, '')) ?: 'barang';

        do {
            $slug = $base.'-'.Str::lower(Str::random(6));
        } while (Product::withTrashed()->where('slug', $slug)->exists());

        return $slug;
    }
}
