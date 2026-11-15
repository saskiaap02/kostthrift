<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Akun admin.
 * - Environment "local": otomatis admin@kosthrift.test / password (HANYA untuk pengembangan).
 * - Selain local (staging/produksi): TIDAK membuat akun kecuali ADMIN_EMAIL dan ADMIN_PASSWORD
 *   (minimal 12 karakter) diisi di environment. Lebih disarankan: php artisan kosthrift:make-admin
 */
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $local = app()->isLocal();

        $email = config('ktm.admin.email') ?: ($local ? 'admin@kosthrift.test' : null);
        $password = config('ktm.admin.password') ?: ($local ? 'password' : null);

        if (! $email || ! $password) {
            $this->command?->warn('Admin tidak dibuat. Isi ADMIN_EMAIL dan ADMIN_PASSWORD, atau jalankan: php artisan kosthrift:make-admin email@contoh.com');

            return;
        }

        if (! $local && strlen($password) < 12) {
            $this->command?->warn('Admin tidak dibuat: ADMIN_PASSWORD minimal 12 karakter.');

            return;
        }

        $user = User::query()->firstOrNew(['email' => $email]);

        if (! $user->exists) {
            $user->forceFill([
                'name' => 'Admin KosThrift',
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]);
        }

        $user->forceFill(['role' => UserRole::Admin->value])->save();
    }
}
