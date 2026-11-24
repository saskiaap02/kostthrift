<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            $url = url(route('password.reset', [
                'token' => $token,
                'email' => $notifiable->getEmailForPasswordReset(),
            ], false));

            return (new MailMessage)
                ->subject('Atur Ulang Password Akun KosThrift')
                ->greeting('Halo, ' . $notifiable->name . '!')
                ->line('Kami menerima permintaan untuk mengatur ulang password akun KosThrift kamu.')
                ->action('Atur Ulang Password', $url)
                ->line('Tautan pengaturan ulang password ini akan kedaluwarsa dalam 60 menit.')
                ->line('Jika kamu tidak merasa meminta pengaturan ulang password, abaikan saja email ini.');
        });

        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('Verifikasi Email Akun KosThrift')
                ->greeting('Halo, '.$notifiable->name.'!')
                ->line('Terima kasih sudah mendaftar di KosThrift. Klik tombol di bawah untuk memastikan email ini milikmu.')
                ->line('Email yang terverifikasi dibutuhkan untuk memasang iklan, memesan barang, dan melaporkan iklan.')
                ->action('Verifikasi Email', $url)
                ->line('Tautan ini kedaluwarsa dalam '.Config::get('auth.verification.expire', 60).' menit.')
                ->line('Jika kamu tidak merasa membuat akun, abaikan saja email ini.');
        });
    }
}
