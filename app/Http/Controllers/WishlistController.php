<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    /** Halaman wishlist: GET /wishlist (terbaru disimpan di atas) */
    public function index(Request $request): Response
    {
        $products = $request->user()
            ->wishlistedProducts()
            ->with(['primaryImage', 'seller:id,name,ktm_verified_at', 'campus.university'])
            ->orderByPivot('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        // Semua yang tampil di sini pasti sudah di-wishlist.
        $products->getCollection()->each->setAttribute('is_wishlisted', true);

        return Inertia::render('Wishlist/Index', [
            'products' => ProductResource::collection($products),
        ]);
    }

    public function toggle(Request $request, Product $product): RedirectResponse
    {
        abort_unless($product->status === ProductStatus::Active, 404);

        $request->user()->wishlistedProducts()->toggle($product->id);

        return back();
    }
}
