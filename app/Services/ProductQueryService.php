<?php

namespace App\Services;

use App\Enums\ProductCondition;
use App\Enums\SortOption;
use App\Models\Product;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/**
 * Satu-satunya tempat logika katalog (filter, urut, paginasi, barang terkait),
 * dipakai HomeController dan ProductController.
 */
class ProductQueryService
{
    /**
     * @param  array{q?: string, kondisi?: string, kategori?: string, kampus?: string, urut?: string}  $filters
     */
    public function paginate(array $filters, ?User $user = null, int $perPage = 12): LengthAwarePaginator
    {
        $condition = ProductCondition::tryFrom($filters['kondisi'] ?? '');
        $sort = SortOption::tryFrom($filters['urut'] ?? '') ?? SortOption::default();

        return $this->baseQuery($user)
            ->ofCondition($condition)
            ->inCampus($filters['kampus'] ?? null)
            ->inCategory($filters['kategori'] ?? null)
            ->search($filters['q'] ?? null)
            ->sortedBy($sort)
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Barang lain di kampus yang sama atau kategori yang sama (untuk halaman detail).
     *
     * @return Collection<int, Product>
     */
    public function related(Product $product, ?User $user = null, int $limit = 4): Collection
    {
        return $this->baseQuery($user)
            ->whereKeyNot($product->id)
            ->where(fn (Builder $query) => $query
                ->where('campus_id', $product->campus_id)
                ->orWhere('category_id', $product->category_id))
            ->latest('id')
            ->limit($limit)
            ->get();
    }

    private function baseQuery(?User $user): Builder
    {
        return Product::query()
            ->active()
            // iklan milik akun yang diblokir admin tidak tampil di katalog
            ->whereHas('seller', fn (Builder $seller) => $seller->whereNull('suspended_at'))
            ->with([
                'primaryImage',
                'seller:id,name,ktm_verified_at',
                'campus.university',
            ])
            // is_wishlisted hanya relevan untuk user yang login
            ->when($user, fn (Builder $query) => $query->withExists([
                'wishlistedBy as is_wishlisted' => fn (Builder $wishlist) => $wishlist->whereKey($user->id),
            ]));
    }
}
