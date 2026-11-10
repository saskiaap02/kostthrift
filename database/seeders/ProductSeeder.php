<?php

namespace Database\Seeders;

use App\Enums\ProductCondition;
use App\Enums\ProductStatus;
use App\Models\Campus;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $campuses = Campus::pluck('id', 'slug');
        $categories = Category::pluck('id', 'slug');

        $rows = require database_path('seeders/data/products.php');

        foreach ($rows as $row) {
            // Penjual dibuat sekali per email, sudah terverifikasi KTM.
            // Pakai factory agar kolom yang tidak fillable (ktm_verified_at) tetap terisi.
            $seller = User::where('email', $row['seller_email'])->first()
                ?? User::factory()->create([
                    'name' => $row['seller_name'],
                    'email' => $row['seller_email'],
                    'campus_id' => $campuses[$row['campus']],
                    'ktm_verified_at' => now(),
                ]);

            $product = Product::updateOrCreate(
                ['slug' => Str::slug($row['title'])],
                [
                    'seller_id' => $seller->id,
                    'campus_id' => $campuses[$row['campus']],
                    'category_id' => $categories[$row['category']],
                    'title' => $row['title'],
                    'description' => $row['description'],
                    'price' => $row['price'],
                    'original_price' => $row['original_price'],
                    'condition' => ProductCondition::from($row['condition']),
                    'status' => ProductStatus::Active,
                    'location_note' => $row['location_note'],
                ],
            );

            $product->images()->updateOrCreate(
                ['is_primary' => true],
                ['path' => $row['image'], 'sort_order' => 0],
            );
        }
    }
}
