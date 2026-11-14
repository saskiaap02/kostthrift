<?php

namespace Database\Seeders;

use App\Models\Campus;
use App\Models\University;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CampusSeeder extends Seeder
{
    /**
     * Data ada di database/seeders/data/campuses.php.
     * Menambah kampus baru = tambah entri di file itu lalu jalankan:
     *   php artisan db:seed --class=CampusSeeder
     */
    public function run(): void
    {
        $universities = require database_path('seeders/data/campuses.php');

        foreach ($universities as $row) {
            $university = University::updateOrCreate(
                ['slug' => $row['slug']],
                ['name' => $row['name'], 'short_name' => $row['short_name']],
            );

            foreach ($row['campuses'] as $campus) {
                Campus::updateOrCreate(
                    ['slug' => Str::slug($row['slug'].' '.$campus['name'])],
                    [
                        'university_id' => $university->id,
                        'name' => $campus['name'],
                        'city' => $campus['city'],
                        'province' => $campus['province'],
                    ],
                );
            }
        }
    }
}
