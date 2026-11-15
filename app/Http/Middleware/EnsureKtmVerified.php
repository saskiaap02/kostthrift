<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Hanya mahasiswa yang sudah terverifikasi KTM yang boleh lanjut (mis. memasang iklan). */
class EnsureKtmVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->ktm_verified_at === null) {
            return redirect()->route('ktm.show');
        }

        return $next($request);
    }
}
