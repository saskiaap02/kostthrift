<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Akun yang diblokir admin (suspended_at terisi) langsung dikeluarkan pada request berikutnya,
 * termasuk sesi yang masih aktif atau cookie "ingat saya".
 */
class EnsureAccountActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user?->isSuspended()) {
            $reason = $user->suspended_reason;

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'email' => User::suspensionMessage($reason),
            ]);
        }

        return $next($request);
    }
}
