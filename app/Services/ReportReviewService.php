<?php

namespace App\Services;

use App\Enums\AdminActionType;
use App\Enums\ReportStatus;
use App\Models\Product;
use App\Models\Report;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/** Aturan peninjauan laporan oleh admin: turunkan iklan yang terbukti melanggar, atau tolak laporan. */
class ReportReviewService
{
    public function __construct(
        private readonly OrderService $orders,
        private readonly AdminAuditLog $audit,
    ) {}

    /**
     * Laporan terbukti: iklan diturunkan (soft delete) dan SEMUA laporan yang masih menunggu
     * untuk iklan yang sama ikut ditutup, supaya admin tidak meninjau hal yang sama berulang.
     * Pesanan belum dibayar untuk iklan itu ikut dibatalkan.
     *
     * @return int jumlah pesanan berjalan yang dibatalkan
     */
    public function takeDown(Report $report, User $admin): int
    {
        return DB::transaction(function () use ($report, $admin): int {
            $report = Report::query()->lockForUpdate()->findOrFail($report->id);
            $this->assertPending($report);

            $product = Product::withTrashed()->with('seller:id,name')->find($report->product_id);
            $alreadyGone = ! $product || $product->trashed();

            if (! $alreadyGone) {
                $product->delete();
            }

            $resolved = $this->resolvePendingFor($report->product_id, $admin);
            $cancelled = $this->orders->cancelOpenOrdersForProduct($report->product_id, self::TAKEDOWN_REASON);

            $title = $product?->title ?? '(iklan terhapus)';
            $this->audit->record(
                $admin,
                $alreadyGone ? AdminActionType::ReportResolved : AdminActionType::ProductTakenDown,
                $alreadyGone
                    ? "Menandai laporan #{$report->id} terbukti (iklan \"{$title}\" sudah turun)"
                    : "Menurunkan iklan \"{$title}\" milik {$product->seller->name} dari laporan #{$report->id}",
                'product',
                $report->product_id,
                ['report_id' => $report->id, 'reports_resolved' => $resolved, 'orders_cancelled' => $cancelled],
            );

            return $cancelled;
        });
    }

    public const TAKEDOWN_REASON = 'Pesanan dibatalkan karena iklan diturunkan admin.';

    /** Laporan tidak terbukti: hanya laporan ini yang ditutup, iklan tetap tayang. */
    public function dismiss(Report $report, User $admin): void
    {
        DB::transaction(function () use ($report, $admin): void {
            $report = Report::query()->lockForUpdate()->findOrFail($report->id);
            $this->assertPending($report);

            $report->update([
                'status' => ReportStatus::Dismissed,
                'handled_by' => $admin->id,
                'handled_at' => now(),
            ]);

            $title = Product::withTrashed()->whereKey($report->product_id)->value('title') ?? '(iklan terhapus)';
            $this->audit->record(
                $admin,
                AdminActionType::ReportDismissed,
                "Menolak laporan #{$report->id} untuk iklan \"{$title}\"",
                'report',
                $report->id,
                ['product_id' => $report->product_id, 'reason' => $report->reason->value],
            );
        });
    }

    /**
     * Tutup semua laporan yang masih menunggu untuk satu iklan sebagai "terbukti".
     * Juga dipakai saat admin menurunkan iklan langsung dari halaman /admin/iklan.
     */
    public function resolvePendingFor(int $productId, User $admin): int
    {
        return Report::query()
            ->where('product_id', $productId)
            ->where('status', ReportStatus::Pending->value)
            ->update([
                'status' => ReportStatus::Resolved->value,
                'handled_by' => $admin->id,
                'handled_at' => now(),
            ]);
    }

    private function assertPending(Report $report): void
    {
        if ($report->status !== ReportStatus::Pending) {
            throw ValidationException::withMessages([
                'report' => 'Laporan ini sudah ditangani admin lain.',
            ]);
        }
    }
}
