<?php

namespace App\Http\Middleware;

use App\Enums\KtmVerificationStatus;
use App\Enums\UserRole;
use App\Models\KtmVerification;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // 404 (bukan 403) agar keberadaan halaman admin tidak terungkap ke orang lain.
        abort_unless($request->user()?->role === UserRole::Admin->value, 404);

        // Jumlah antrean KTM untuk lencana di menu admin (hanya dihitung bila dipakai).
        Inertia::share('adminPendingKtm', fn () => KtmVerification::query()
            ->where('status', KtmVerificationStatus::Pending->value)
            ->count());

        return $next($request);
    }
}
