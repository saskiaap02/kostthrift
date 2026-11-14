<?php

namespace Database\Seeders;

use App\Models\Campus;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CampusSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
        ]);

        // Akun demo untuk login (password: "password")
        if (! User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'campus_id' => Campus::where('slug', 'ui-depok')->value('id'),
                'ktm_verified_at' => now(),
            ]);
        }
    }
}
