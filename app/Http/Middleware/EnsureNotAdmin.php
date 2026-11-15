<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Akun admin hanya untuk moderasi: tidak berjualan, berbelanja, atau menyimpan wishlist.
 * Admin yang membuka halaman pembeli/penjual dialihkan ke panel admin.
 */
class EnsureNotAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->role === UserRole::Admin->value) {
            return redirect()->route('admin.dashboard');
        }

        return $next($request);
    }
}
