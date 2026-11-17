<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

class ProductAiService
{
    /**
     * Analisis foto barang dan kembalikan saran isian form iklan.
     * Hanya menerima foto produk (bukan KTM).
     *
     * @return array{title: string, category_id: int|null, condition: string, description: string, estimated_price: int|null}
     */
    public function suggestFromPhoto(UploadedFile $image): array
    {
        $apiKey = trim((string) config('services.gemini.key'));
        $model = trim((string) config('services.gemini.model', 'gemini-3.8-flash'));

        if ($apiKey === '') {
            throw ValidationException::withMessages([
                'ai' => 'Layanan AI belum dikonfigurasi (GEMINI_API_KEY kosong di .env).',
            ]);
        }

        $categories = Category::query()
            ->orderBy('sort_order')
            ->get(['id', 'name'])
            ->map(fn ($c) => "{$c->id}: {$c->name}")
            ->implode(', ');

        $prompt = <<<PROMPT
Kamu adalah asisten penjual di marketplace barang bekas & perlengkapan kos mahasiswa (KosThrift) di Indonesia.
Analisis foto barang ini dan buat saran draf iklan dalam Bahasa Indonesia yang jujur, natural, dan menarik bagi mahasiswa.

Daftar kategori tersedia (ID: Nama): [{$categories}]

Aturan pengisian:
1. "title": Judul singkat, jelas, maksimal 70 karakter (contoh: "Rice Cooker Mini Miyako 0,6L Mulus"). Tanpa emoji.
2. "category_id": Pilih satu ID angka yang paling sesuai dari daftar kategori di atas.
3. "condition": Pilih "baru" jika terlihat masih tersegel/baru dari toko, atau "second" jika barang bekas pakai.
4. "description": Deskripsi 2-4 kalimat singkat dalam Bahasa Indonesia yang menjelaskan perkiraan jenis/merek barang yang terlihat, kondisi fisik yang tampak di foto, dan ajakan untuk mengecek detail atau menanyakan kelengkapan sebelum COD/transfer. Tanpa emoji.
5. "estimated_price": Perkiraan harga wajar barang bekas mahasiswa dalam Rupiah (angka bulat kelipatan 5000, tanpa titik/Rp), atau null jika sulit diperkirakan.
PROMPT;

        $base64 = base64_encode($image->get());
        $mimeType = $image->getMimeType() ?: 'image/jpeg';

        try {
            $client = Http::connectTimeout(15)
                ->timeout(60)
                ->withOptions([
                    'force_ip_resolve' => 'v4',
                ]);

            if (app()->isLocal()) {
                $client = $client->withoutVerifying();
            }

            $response = $client->post(
                "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}",
                [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                                [
                                    'inline_data' => [
                                        'mime_type' => $mimeType,
                                        'data' => $base64,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'responseMimeType' => 'application/json',
                        'thinkingConfig' => [
                            'thinkingBudget' => 0,
                        ],
                        'responseSchema' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'title' => ['type' => 'STRING'],
                                'category_id' => ['type' => 'INTEGER'],
                                'condition' => ['type' => 'STRING', 'enum' => ['baru', 'second']],
                                'description' => ['type' => 'STRING'],
                                'estimated_price' => ['type' => 'INTEGER', 'nullable' => true],
                            ],
                            'required' => ['title', 'category_id', 'condition', 'description'],
                        ],
                    ],
                ]
            );
        } catch (Throwable $e) {
            Log::warning('Gemini request exception', ['message' => $e->getMessage()]);
            throw ValidationException::withMessages([
                'ai' => 'Koneksi ke layanan AI gagal: ' . $e->getMessage(),
            ]);
        }

        if ($response->failed()) {
            $apiError = $response->json('error.message') ?? 'HTTP ' . $response->status();
            Log::warning('Gemini API failed', ['status' => $response->status(), 'error' => $apiError]);

            throw ValidationException::withMessages([
                'ai' => "Gagal menganalisis foto ({$apiError}).",
            ]);
        }

        $rawText = $response->json('candidates.0.content.parts.0.text');
        $parsed = json_decode((string) $rawText, true);

        if (! is_array($parsed) || empty($parsed['title'])) {
            throw ValidationException::withMessages([
                'ai' => 'AI tidak dapat mengenali barang pada foto ini. Coba foto dengan pencahayaan lebih jelas.',
            ]);
        }

        $validCategoryId = Category::query()->whereKey($parsed['category_id'] ?? 0)->exists()
            ? (int) $parsed['category_id']
            : null;

        return [
            'title' => mb_substr(trim((string) $parsed['title']), 0, 100),
            'category_id' => $validCategoryId,
            'condition' => in_array($parsed['condition'] ?? '', ['baru', 'second'], true) ? $parsed['condition'] : 'second',
            'description' => mb_substr(trim((string) $parsed['description']), 0, 2000),
            'estimated_price' => isset($parsed['estimated_price']) && $parsed['estimated_price'] > 0
                ? (int) $parsed['estimated_price']
                : null,
        ];
    }
}