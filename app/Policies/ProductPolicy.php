<?php

namespace App\Policies;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /** Iklan aktif/terjual boleh dilihat siapa saja (termasuk tamu); draft hanya penjualnya. */
    public function view(?User $user, Product $product): bool
    {
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
