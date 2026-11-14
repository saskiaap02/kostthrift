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
}
