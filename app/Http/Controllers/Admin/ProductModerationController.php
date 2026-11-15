<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminListRequest;
use App\Http\Resources\AdminProductResource;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductModerationController extends Controller
{
    /** Semua iklan, bisa dicari dan difilter status: GET /admin/iklan */
    public function index(AdminListRequest $request): Response
    {
        $filters = $request->filters();

        $products = Product::query()
            ->with(['primaryImage', 'seller:id,name,ktm_verified_at', 'campus.university'])
            ->when($filters['status'] !== '', fn (Builder $query) => $query->where('status', $filters['status']))
            ->search($filters['q'])
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => AdminProductResource::collection($products),
            'filters' => $filters,
        ]);
    }

    /** Turunkan iklan yang melanggar (disembunyikan, bukan dihapus permanen): DELETE /admin/iklan/{slug} */
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Iklan diturunkan.');
    }
}
