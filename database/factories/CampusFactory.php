<?php

namespace Database\Factories;

use App\Models\Campus;
use App\Models\University;
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
        $name = ucfirst(fake()->unique()->lexify('????'));

        return [
            'university_id' => University::factory(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(5)),
            'city' => fake()->city(),
            'province' => fake()->state(),
        ];
    }
}
