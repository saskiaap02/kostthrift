<?php

namespace App\Http\Controllers;

use App\Enums\ReportStatus;
use App\Http\Requests\StoreReportRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class ReportController extends Controller
{
    /** Laporkan iklan: POST /produk/{slug}/laporan */
    public function store(StoreReportRequest $request, Product $product): RedirectResponse
    {
        Gate::authorize('view', $product);

        $user = $request->user();

        if ($product->seller_id === $user->id) {
            return back()->withErrors(['reason' => 'Kamu tidak bisa melaporkan iklanmu sendiri.']);
        }

        // Satu laporan yang masih ditinjau per pengguna per iklan, supaya antrean admin tidak dibanjiri.
        $alreadyReported = $product->reports()
            ->where('reporter_id', $user->id)
            ->where('status', ReportStatus::Pending->value)
            ->exists();

        if ($alreadyReported) {
            return back()->withErrors(['reason' => 'Kamu sudah melaporkan iklan ini. Admin sedang meninjaunya.']);
        }

        $product->reports()->create([
            'reporter_id' => $user->id,
            'reason' => $request->validated('reason'),
            'detail' => $request->validated('detail'),
        ]);

        return back()->with('success', 'Laporan terkirim. Terima kasih, admin akan meninjaunya.');
    }
}
