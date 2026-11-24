<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AdminActionType;
use App\Enums\KtmVerificationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\RejectKtmRequest;
use App\Http\Resources\KtmVerificationResource;
use App\Models\KtmVerification;
use App\Services\AdminAuditLog;
use App\Services\KtmVerificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KtmReviewController extends Controller
{
    /** Antrean pemeriksaan + riwayat terbaru: GET /admin/verifikasi-ktm */
    public function index(): Response
    {
        $pending = KtmVerification::query()
            ->with(['user:id,name,email', 'university:id,name'])
            ->where('status', KtmVerificationStatus::Pending->value)
            ->oldest('id')
            ->get();

        $history = KtmVerification::query()
            ->with(['user:id,name,email', 'university:id,name', 'reviewer:id,name'])
            ->whereIn('status', [KtmVerificationStatus::Approved->value, KtmVerificationStatus::Rejected->value])
            ->latest('reviewed_at')
            ->limit(20)
            ->get();

        return Inertia::render('Admin/Ktm/Index', [
            'pending' => KtmVerificationResource::collection($pending)->resolve(),
            'history' => KtmVerificationResource::collection($history)->resolve(),
        ]);
    }

    public function approve(Request $request, KtmVerification $verification, KtmVerificationService $verifications, AdminAuditLog $audit): RedirectResponse
    {
        $verifications->approve($verification, $request->user());

        $audit->record(
            $request->user(),
            AdminActionType::KtmApproved,
            "Menyetujui verifikasi KTM {$verification->user->name}",
            'user',
            $verification->user_id,
        );

        return back()->with('success', 'Mahasiswa berhasil diverifikasi.');
    }

    public function reject(RejectKtmRequest $request, KtmVerification $verification, KtmVerificationService $verifications, AdminAuditLog $audit): RedirectResponse
    {
        $verifications->reject($verification, $request->user(), $request->validated('reason'));

        $audit->record(
            $request->user(),
            AdminActionType::KtmRejected,
            "Menolak verifikasi KTM {$verification->user->name}",
            'user',
            $verification->user_id,
            ['reason' => $request->validated('reason')],
        );

        return back()->with('success', 'Pengajuan ditolak dan foto KTM sudah dihapus.');
    }
}
