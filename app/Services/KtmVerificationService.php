<?php

namespace App\Services;

use App\Notifications\AppActivityNotification;
use App\Enums\KtmVerificationStatus;
use App\Models\KtmVerification;
use App\Models\User;
use GdImage;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * Verifikasi KTM. Prinsip keamanan:
 * - foto disimpan di disk PRIVAT dengan nama acak (tidak bisa ditebak dan tidak ada URL publik);
 * - foto dienkode ulang ke JPEG (metadata EXIF/GPS terbuang, isi file dinormalkan) dan dikecilkan;
 * - foto DIHAPUS permanen begitu admin memutuskan (disetujui maupun ditolak).
 */
class KtmVerificationService
{
    public function submit(User $user, UploadedFile $document, int $universityId): KtmVerification
    {
        if ($user->ktm_verified_at !== null) {
            throw ValidationException::withMessages(['document' => 'Akunmu sudah terverifikasi.']);
        }

        $hasPending = KtmVerification::query()
            ->where('user_id', $user->id)
            ->where('status', KtmVerificationStatus::Pending->value)
            ->exists();

        if ($hasPending) {
            throw ValidationException::withMessages([
                'document' => 'Dokumenmu masih diperiksa admin. Tunggu hasilnya dulu.',
            ]);
        }

        $path = trim((string) config('ktm.directory'), '/').'/'.Str::uuid().'.jpg';
        $this->disk()->put($path, $this->sanitize($document), 'private');

        try {
            return KtmVerification::create([
                'user_id' => $user->id,
                'university_id' => $universityId,
                'document_path' => $path,
                'status' => KtmVerificationStatus::Pending,
            ]);
        } catch (Throwable $e) {
            $this->disk()->delete($path);

            throw $e;
        }
    }

    public function approve(KtmVerification $verification, User $admin): void
    {
        $this->assertPending($verification);
        $path = $verification->document_path;

        DB::transaction(function () use ($verification, $admin) {
            $verification->update([
                'status' => KtmVerificationStatus::Approved,
                'reviewed_by' => $admin->id,
                'reviewed_at' => now(),
                'document_path' => null,
                'rejection_reason' => null,
            ]);

            User::query()->whereKey($verification->user_id)->update(['ktm_verified_at' => now()]);
        });

        $this->deleteDocument($path);

        $verification->user?->notify(new AppActivityNotification(
            title: 'Verifikasi KTM disetujui',
            message: 'Selamat! Akun mahasiswamu telah terverifikasi KTM. Sekarang kamu bisa memasang iklan dan melakukan checkout.',
            url: '/verifikasi-ktm',
            icon: 'patch-check-fill',
            category: 'ktm',
        ));
    }

    public function reject(KtmVerification $verification, User $admin, string $reason): void
    {
        $this->assertPending($verification);
        $path = $verification->document_path;

        $verification->update([
            'status' => KtmVerificationStatus::Rejected,
            'reviewed_by' => $admin->id,
            'reviewed_at' => now(),
            'document_path' => null,
            'rejection_reason' => $reason,
        ]);

        $this->deleteDocument($path);

        $verification->user?->notify(new AppActivityNotification(
            title: 'Pengajuan verifikasi KTM ditolak',
            message: "Pengajuan KTM ditolak admin: {$reason}. Silakan unggah ulang foto KTM yang jelas.",
            url: '/verifikasi-ktm',
            icon: 'exclamation-circle',
            category: 'ktm',
        ));
    }

    public function disk(): Filesystem
    {
        return Storage::disk((string) config('ktm.disk'));
    }

    private function assertPending(KtmVerification $verification): void
    {
        if ($verification->status !== KtmVerificationStatus::Pending) {
            throw ValidationException::withMessages(['verification' => 'Pengajuan ini sudah diproses.']);
        }
    }

    private function deleteDocument(?string $path): void
    {
        if ($path) {
            $this->disk()->delete($path);
        }
    }

    /** Enkode ulang ke JPEG: membuang metadata (termasuk lokasi GPS) dan mengecilkan ukuran. */
    private function sanitize(UploadedFile $file): string
    {
        $contents = (string) file_get_contents($file->getRealPath());

        if (! function_exists('imagecreatefromstring')) {
            return $contents; // ekstensi GD tidak ada: tetap tersimpan privat apa adanya
        }

        $image = @imagecreatefromstring($contents);

        if ($image === false) {
            throw ValidationException::withMessages([
                'document' => 'File gambar tidak dapat dibaca. Coba foto ulang.',
            ]);
        }

        $image = $this->applyOrientation($image, $file);

        $maxWidth = (int) config('ktm.max_width', 1600);

        if (imagesx($image) > $maxWidth) {
            $scaled = imagescale($image, $maxWidth);

            if ($scaled !== false) {
                $image = $scaled;
            }
        }

        ob_start();
        imagejpeg($image, null, 85);

        return (string) ob_get_clean();
    }

    /** Foto dari ponsel sering "miring" lewat tag EXIF; putar dulu sebelum tag itu dibuang. */
    private function applyOrientation(GdImage $image, UploadedFile $file): GdImage
    {
        if (! function_exists('exif_read_data') || $file->getMimeType() !== 'image/jpeg') {
            return $image;
        }

        $exif = @exif_read_data($file->getRealPath());

        $angle = match ($exif['Orientation'] ?? 1) {
            3 => 180,
            6 => -90,
            8 => 90,
            default => 0,
        };

        if ($angle === 0) {
            return $image;
        }

        $rotated = imagerotate($image, $angle, 0);

        return $rotated !== false ? $rotated : $image;
    }
}
