<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminListRequest;
use App\Http\Resources\AdminProductResource;
use App\Models\Product;
use App\Enums\AdminActionType;
use App\Services\AdminAuditLog;
use App\Services\OrderService;
use App\Services\ReportReviewService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
    public function destroy(Request $request, Product $product, ReportReviewService $reports, OrderService $orders, AdminAuditLog $audit): RedirectResponse
    {
        $product->delete();

        // Laporan yang masih menunggu untuk iklan ini ikut ditutup.
        $reports->resolvePendingFor($product->id, $request->user());

        // Pesanan belum dibayar untuk iklan ini dibatalkan agar pembeli tidak menunggu sia-sia.
        $cancelled = $orders->cancelOpenOrdersForProduct($product->id, ReportReviewService::TAKEDOWN_REASON);

        $audit->record(
            $request->user(),
            AdminActionType::ProductTakenDown,
            "Menurunkan iklan \"{$product->title}\" milik {$product->seller->name}",
            'product',
            $product->id,
            ['orders_cancelled' => $cancelled, 'source' => 'admin_ads'],
        );

        return back()->with('success', 'Iklan diturunkan.'
            .($cancelled > 0 ? " {$cancelled} pesanan berjalan dibatalkan." : ''));
    }
}
