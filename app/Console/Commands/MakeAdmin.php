<?php

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MakeAdmin extends Command
{
    protected $signature = 'kosthrift:make-admin {email : Email akun admin} {--name=Admin KosThrift : Nama (hanya untuk akun baru)}';

    protected $description = 'Buat akun admin baru, atau jadikan akun yang sudah ada sebagai admin';

    public function handle(): int
    {
        $email = Str::lower(trim((string) $this->argument('email')));

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Format email tidak valid.');

            return self::FAILURE;
        }

        $user = User::query()->where('email', $email)->first();

        if ($user) {
            $user->forceFill(['role' => UserRole::Admin->value])->save();
            $this->info("Akun {$email} sekarang admin.");

            return self::SUCCESS;
        }

        $password = (string) $this->secret('Password admin (minimal 12 karakter)');

        if (strlen($password) < 12) {
            $this->error('Password minimal 12 karakter.');

            return self::FAILURE;
        }

        if ($password !== (string) $this->secret('Ulangi password')) {
            $this->error('Password tidak sama.');

            return self::FAILURE;
        }

        (new User())->forceFill([
            'name' => (string) $this->option('name'),
            'email' => $email,
            'password' => Hash::make($password),
            'role' => UserRole::Admin->value,
            'email_verified_at' => now(),
        ])->save();

        $this->info("Admin {$email} dibuat.");

        return self::SUCCESS;
    }
}
