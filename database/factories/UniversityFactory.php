<?php

namespace Database\Factories;

use App\Models\University;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<University>
 */
class UniversityFactory extends Factory
{
    protected $model = University::class;

    public function definition(): array
    {
        $name = 'Universitas '.ucfirst(fake()->unique()->lexify('????'));

        return [
            'name' => $name,
            'short_name' => Str::upper(fake()->lexify('???')),
            'slug' => Str::slug($name),
        ];
    }
}
