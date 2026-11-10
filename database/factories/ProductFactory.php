<?php

namespace Database\Factories;

use App\Enums\ProductCondition;
use App\Enums\ProductStatus;
use App\Models\Campus;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $title = ucfirst(fake()->words(3, true));

        return [
            'seller_id' => User::factory(),
            'campus_id' => Campus::factory(),
            'category_id' => Category::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(6)),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(10, 500) * 1000,
            'original_price' => null,
            'condition' => ProductCondition::Baru,
            'status' => ProductStatus::Active,
            'location_note' => fake()->streetName(),
        ];
    }

    public function second(): static
    {
        return $this->state(fn (array $attributes) => [
            'condition' => ProductCondition::Second,
            'original_price' => $attributes['price'] * 2,
        ]);
    }

    public function baru(): static
    {
        return $this->state(fn () => [
            'condition' => ProductCondition::Baru,
            'original_price' => null,
        ]);
    }

    public function sold(): static
    {
        return $this->state(fn () => ['status' => ProductStatus::Sold]);
    }
}
