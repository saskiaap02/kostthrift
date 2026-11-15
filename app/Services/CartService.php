<?php

namespace App\Services;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;

/**
 * Isi troli dikelompokkan per penjual (tiap penjual = satu transaksi/titik COD sendiri).
 */
class CartService
{
    /**
     * @return Collection<int, array{seller: User, items: Collection<int, Product>, subtotal: int}>
     */
    public function groupedBySeller(User $user): Collection
    {
        return $user->cartProducts()
            ->with(['primaryImage', 'seller:id,name,ktm_verified_at', 'campus.university'])
            ->orderByPivot('created_at', 'desc')
            ->get()
            ->groupBy('seller_id')
            ->map(fn (Collection $items) => [
                'seller' => $items->first()->seller,
                'items' => $items,
                // Barang yang sudah terjual tidak ikut dihitung.
                'subtotal' => (int) $items
                    ->filter(fn (Product $product) => $product->status === ProductStatus::Active)
                    ->sum('price'),
            ])
            ->values();
    }
}
