<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Http\Resources\MyProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyProductController extends Controller
{
    /** Daftar iklan milik user yang login: GET /iklan-saya?status=active|sold */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $status = ProductStatus::tryFrom((string) $request->query('status'));

        $products = Product::query()
            ->where('seller_id', $user->id)
            ->with(['primaryImage', 'campus.university'])
            ->withCount('wishlistedBy')
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        // Jumlah per status untuk badge di tab (tidak ikut filter).
        $totals = Product::query()
            ->where('seller_id', $user->id)
            ->toBase()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('Products/Mine', [
            'products' => MyProductResource::collection($products),
            'filters' => ['status' => $status?->value ?? ''],
            // Bukan `counts`: nama itu sudah dipakai prop bersama untuk badge navbar.
            'statusCounts' => [
                'all' => (int) $totals->sum(),
                'active' => (int) ($totals[ProductStatus::Active->value] ?? 0),
                'sold' => (int) ($totals[ProductStatus::Sold->value] ?? 0),
            ],
        ]);
    }
}
