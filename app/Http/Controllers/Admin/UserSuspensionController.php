<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AdminActionType;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\SuspendUserRequest;
use App\Models\User;
use App\Services\AdminAuditLog;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/** Blokir / aktifkan kembali akun pengguna (kolom suspended_at). */
class UserSuspensionController extends Controller
{
    /** Blokir akun: POST /admin/pengguna/{id}/blokir */
    public function store(SuspendUserRequest $request, User $user, OrderService $orders, AdminAuditLog $audit): RedirectResponse
    {
        // Akun admin tidak bisa diblokir (termasuk akun admin sendiri).
        abort_if($user->role === UserRole::Admin->value, 404);

        $user->forceFill([
            'suspended_at' => now(),
            'suspended_reason' => $request->validated('reason'),
            // Putuskan juga cookie "ingat saya" yang masih beredar.
            'remember_token' => null,
        ])->save();

        // Pesanan belum dibayar dibatalkan agar barang yang ditahan tayang lagi dan lawan transaksi tidak menunggu.
        $cancelled = $orders->cancelOpenOrdersForUser($user, 'Pesanan dibatalkan karena akun salah satu pihak diblokir admin.');

        $audit->record(
            $request->user(),
            AdminActionType::UserSuspended,
            "Memblokir akun {$user->name} ({$user->email})",
            'user',
            $user->id,
            ['reason' => $request->validated('reason'), 'orders_cancelled' => $cancelled],
        );

        return back()->with('success', "Akun {$user->name} diblokir."
            .($cancelled > 0 ? " {$cancelled} pesanan berjalan dibatalkan." : ''));
    }

    /** Aktifkan kembali: DELETE /admin/pengguna/{id}/blokir */
    public function destroy(Request $request, User $user, AdminAuditLog $audit): RedirectResponse
    {
        abort_if($user->role === UserRole::Admin->value, 404);

        $user->forceFill(['suspended_at' => null, 'suspended_reason' => null])->save();

        $audit->record(
            $request->user(),
            AdminActionType::UserUnsuspended,
            "Mengaktifkan kembali akun {$user->name} ({$user->email})",
            'user',
            $user->id,
        );

        return back()->with('success', "Akun {$user->name} diaktifkan kembali.");
    }
}
