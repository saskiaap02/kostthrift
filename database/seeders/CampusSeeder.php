<?php

namespace Database\Seeders;

use App\Models\Campus;
use Illuminate\Database\Seeder;

class CampusSeeder extends Seeder
{
    public function run(): void
    {
        $campuses = [
            ['slug' => 'ui',    'name' => 'Universitas Indonesia',            'city' => 'Depok',       'zone_label' => 'Zona UI (Depok)'],
            ['slug' => 'itb',   'name' => 'Institut Teknologi Bandung',       'city' => 'Bandung',     'zone_label' => 'Zona ITB (Bandung)'],
            ['slug' => 'ugm',   'name' => 'Universitas Gadjah Mada',          'city' => 'Yogyakarta',  'zone_label' => 'Zona UGM (Yogyakarta)'],
            ['slug' => 'undip', 'name' => 'Universitas Diponegoro',           'city' => 'Semarang',    'zone_label' => 'Zona UNDIP (Semarang)'],
            ['slug' => 'its',   'name' => 'Institut Teknologi Sepuluh Nopember', 'city' => 'Surabaya',  'zone_label' => 'Zona ITS (Surabaya)'],
            ['slug' => 'unpad', 'name' => 'Universitas Padjadjaran',          'city' => 'Jatinangor',  'zone_label' => 'Zona UNPAD (Jatinangor)'],
        ];

        foreach ($campuses as $campus) {
            Campus::updateOrCreate(['slug' => $campus['slug']], $campus);
        }
    }
}
