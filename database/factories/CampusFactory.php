<?php

namespace Database\Factories;

use App\Models\Campus;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Campus>
 */
class CampusFactory extends Factory
{
    protected $model = Campus::class;

    public function definition(): array
    {
        $name = 'Universitas '.fake()->unique()->lexify('????');

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'city' => fake()->city(),
            'zone_label' => 'Zona '.Str::upper(fake()->lexify('???')),
        ];
    }
}
