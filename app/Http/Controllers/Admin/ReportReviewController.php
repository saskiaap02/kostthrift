<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminReportListRequest;
use App\Http\Resources\AdminReportResource;
use App\Models\Report;
use App\Services\ReportReviewService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportReviewController extends Controller
{
    /** Antrean laporan (default: menunggu ditinjau): GET /admin/laporan */
    public function index(AdminReportListRequest $request): Response
    {
        $filters = $request->filters();
        $pending = $filters['status'] === ReportStatus::Pending->value;

        $reports = Report::query()
            ->with([
                'reporter:id,name',
                'handler:id,name',
                'product.primaryImage',
                'product.seller:id,name,email,suspended_at',
            ])
            ->when(
                $filters['status'] !== 'all',
                fn (Builder $query) => $query->where('status', $filters['status']),
            )
            // antrean: terlama dulu; riwayat: terbaru dulu
            ->when($pending, fn (Builder $query) => $query->oldest('id'), fn (Builder $query) => $query->latest('id'))
            ->paginate(15)
            ->withQueryString();

        // Berapa laporan yang masih menunggu untuk iklan yang sama (iklan yang banyak dilaporkan perlu didahulukan).
        $counts = Report::query()
            ->where('status', ReportStatus::Pending->value)
            ->whereIn('product_id', $reports->getCollection()->pluck('product_id')->unique())
            ->selectRaw('product_id, count(*) as total')
            ->groupBy('product_id')
            ->pluck('total', 'product_id');

        $reports->getCollection()->each(
            fn (Report $report) => $report->setAttribute('pending_for_product', $counts[$report->product_id] ?? 0),
        );

        return Inertia::render('Admin/Reports/Index', [
            'reports' => AdminReportResource::collection($reports),
            'filters' => $filters,
        ]);
    }

    /** Laporan terbukti, turunkan iklan: POST /admin/laporan/{id}/turunkan */
    public function takeDown(Request $request, Report $report, ReportReviewService $reviews): RedirectResponse
    {
        $cancelled = $reviews->takeDown($report, $request->user());

        return back()->with('success', 'Iklan diturunkan dan laporan ditutup.'
            .($cancelled > 0 ? " {$cancelled} pesanan berjalan dibatalkan." : ''));
    }

    /** Laporan tidak terbukti: POST /admin/laporan/{id}/tolak */
    public function dismiss(Request $request, Report $report, ReportReviewService $reviews): RedirectResponse
    {
        $reviews->dismiss($report, $request->user());

        return back()->with('success', 'Laporan ditolak.');
    }
}
