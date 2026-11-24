<?php

namespace App\Policies;

use App\Enums\ProductStatus;
use App\Enums\UserRole;
use App\Models\Product;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProductPolicy
{
    /** Iklan aktif/terjual boleh dilihat siapa saja (termasuk tamu); draft hanya penjualnya. */
    public function view(?User $user, Product $product): bool|Response
    {
        // Iklan milik akun yang diblokir hanya terlihat oleh admin (tampil sebagai 404 bagi yang lain).
        if ($product->seller->isSuspended() && $user?->role !== UserRole::Admin->value) {
            return Response::denyAsNotFound();
        }

        return $product->status !== ProductStatus::Draft
            || $user?->id === $product->seller_id;
    }

    /** Hanya penjual yang boleh mengubah iklannya (edit, ubah status). */
    public function update(User $user, Product $product): bool
    {
        return $user->id === $product->seller_id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $user->id === $product->seller_id;
    }
}
