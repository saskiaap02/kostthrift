<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // `icon` = nama Bootstrap Icons tanpa awalan "bi-" (https://icons.getbootstrap.com)
        $categories = [
            ['slug' => 'elektronik',   'name' => 'Elektronik',     'icon' => 'lightning-charge'],
            ['slug' => 'alat-masak',   'name' => 'Alat Masak',     'icon' => 'cup-hot'],
            ['slug' => 'buku-kuliah',  'name' => 'Buku Kuliah',    'icon' => 'book'],
            ['slug' => 'kasur-lemari', 'name' => 'Kasur & Lemari', 'icon' => 'door-closed'],
            ['slug' => 'lampu-meja',   'name' => 'Lampu & Meja',   'icon' => 'lightbulb'],
        ];

        foreach ($categories as $index => $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category + ['sort_order' => $index + 1],
            );
        }
    }
}
