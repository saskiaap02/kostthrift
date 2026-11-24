<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Tampilkan halaman Lupa Password.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Kirim tautan reset password ke email pemilik akun.
     * Jawaban selalu sama, ada atau tidaknya akun, agar daftar email terdaftar tidak bisa ditebak.
     * (Saat MAIL_MAILER=log, tautan muncul di storage/logs/laravel.log.)
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ], [
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
        ]);

        Password::sendResetLink($request->only('email'));

        return back()->with('status', 'Jika email itu terdaftar, tautan untuk mengatur ulang password sudah dikirim. Cek kotak masuk atau folder spam.');
    }
}
