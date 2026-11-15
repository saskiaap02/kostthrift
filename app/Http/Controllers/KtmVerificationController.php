<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmitKtmRequest;
use App\Http\Resources\KtmVerificationResource;
use App\Models\KtmVerification;
use App\Models\University;
use App\Services\KtmVerificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KtmVerificationController extends Controller
{
    /** Status verifikasi + form unggah: GET /verifikasi-ktm */
    public function show(Request $request): Response
    {
        $user = $request->user();

        $latest = KtmVerification::query()
            ->with('university:id,name')
            ->where('user_id', $user->id)
            ->latest('id')
            ->first();

        return Inertia::render('Ktm/Show', [
            'verified' => $user->ktm_verified_at !== null,
            'verification' => $latest ? KtmVerificationResource::make($latest)->resolve() : null,
            'universities' => University::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (University $university) => ['id' => $university->id, 'name' => $university->name])
                ->all(),
        ]);
    }

    /** Kirim KTM untuk diperiksa: POST /verifikasi-ktm */
    public function store(SubmitKtmRequest $request, KtmVerificationService $verifications): RedirectResponse
    {
        $verifications->submit(
            $request->user(),
            $request->file('document'),
            (int) $request->validated('university_id'),
        );

        return redirect()
            ->route('ktm.show')
            ->with('success', 'KTM terkirim. Admin akan memeriksanya segera.');
    }

    /** Tampilkan foto KTM (hanya pemilik dan admin): GET /verifikasi-ktm/{id}/dokumen */
    public function document(KtmVerification $verification, KtmVerificationService $verifications): StreamedResponse
    {
        Gate::authorize('viewDocument', $verification);

        $path = $verification->document_path;
        $disk = $verifications->disk();

        abort_unless($path && $disk->exists($path), 404);

        return $disk->response($path, 'ktm.jpg', [
            'Content-Type' => 'image/jpeg',
            'Cache-Control' => 'private, no-store, max-age=0',
            'X-Content-Type-Options' => 'nosniff',
            'X-Robots-Tag' => 'noindex, nofollow',
        ]);
    }
}
