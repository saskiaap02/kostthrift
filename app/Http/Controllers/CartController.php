<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /** Halaman troli: GET /troli */
    public function index(Request $request, CartService $cart): Response
    {
        $groups = $cart->groupedBySeller($request->user())
            ->map(fn (array $group) => [
                'seller' => [
                    'id' => $group['seller']->id,
                    'name' => $group['seller']->name,
                    'ktm_verified' => $group['seller']->ktm_verified_at !== null,
                ],
                'items' => ProductResource::collection($group['items'])->resolve(),
                'subtotal' => $group['subtotal'],
                'available_count' => $group['items']
                    ->filter(fn (Product $product) => $product->status === ProductStatus::Active)
                    ->count(),
            ])
            ->all();

        return Inertia::render('Cart/Index', [
            'groups' => $groups,
            'summary' => [
                'items' => collect($groups)->sum(fn (array $group) => count($group['items'])),
                'available' => collect($groups)->sum('available_count'),
                'amount' => collect($groups)->sum('subtotal'),
            ],
        ]);
    }
}
