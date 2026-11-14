<?php

namespace App\Http\Controllers;

use App\Http\Requests\HomeIndexRequest;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\CampusResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductResource;
use App\Models\Campus;
use App\Models\Category;
use App\Models\Product;
use App\Services\ProductPublishingService;
use App\Services\ProductQueryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /** JSON untuk tombol "muat lebih banyak" di Beranda. */
    public function index(HomeIndexRequest $request, ProductQueryService $products): AnonymousResourceCollection
    {
        return ProductResource::collection(
            $products->paginate($request->filters(), $request->user()),
        );
    }

    /** Detail produk: GET /produk/{slug} */
    public function show(Request $request, Product $product, ProductQueryService $products): Response
    {
        Gate::authorize('view', $product);

        $user = $request->user();

        $product->load(['images', 'seller:id,name,ktm_verified_at,created_at', 'campus.university', 'category']);

        if ($user) {
            $product->loadExists([
                'wishlistedBy as is_wishlisted' => fn ($query) => $query->whereKey($user->id),
                'cartedBy as in_cart' => fn ($query) => $query->whereKey($user->id),
            ]);
        }

        return Inertia::render('Products/Show', [
            'product' => ProductDetailResource::make($product)->resolve(),
            'related' => ProductResource::collection($products->related($product, $user))->resolve(),
        ]);
    }

    /** Form Jual: GET /jual */
    public function create(Request $request): Response
    {
        return Inertia::render('Products/Create', [
            'categories' => CategoryResource::collection(
                Category::query()->orderBy('sort_order')->get(),
            )->resolve(),
            'campuses' => CampusResource::collection(Campus::selectable())->resolve(),
            // kampus penjual dipakai sebagai pilihan awal lokasi barang
            'default_campus_id' => $request->user()->campus_id,
        ]);
    }

    /** Simpan iklan baru: POST /produk */
    public function store(StoreProductRequest $request, ProductPublishingService $publisher): RedirectResponse
    {
        $product = $publisher->publish(
            $request->user(),
            $request->safe()->except('images'),
            $request->file('images'),
        );

        return redirect()
            ->route('products.show', $product)
            ->with('success', 'Iklanmu sudah tayang.');
    }
}
