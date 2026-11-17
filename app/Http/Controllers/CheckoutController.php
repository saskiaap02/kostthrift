<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethod;
use App\Enums\ProductStatus;
use App\Http\Requests\PlaceOrderRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /** Ringkasan sebelum memesan, per penjual: GET /checkout/{id-penjual} */
    public function show(Request $request, User $seller, CartService $cart): Response|RedirectResponse
    {
        $buyer = $request->user();

        abort_if($seller->id === $buyer->id, 404);

        $group = $cart->groupedBySeller($buyer)
            ->first(fn (array $group) => $group['seller']->id === $seller->id);

        if (! $group) {
            return redirect()->route('cart.index');
        }

        $available = $group['items']
            ->filter(fn (Product $product) => $product->status === ProductStatus::Active)
            ->values();

        if ($available->isEmpty()) {
            return redirect()->route('cart.index');
        }

        return Inertia::render('Orders/Create', [
            'seller' => [
                'id' => $seller->id,
                'name' => $group['seller']->name,
                'ktm_verified' => $group['seller']->ktm_verified_at !== null,
            ],
            'items' => ProductResource::collection($available)->resolve(),
            'unavailable_count' => $group['items']->count() - $available->count(),
            'total' => (int) $available->sum('price'),
        ]);
    }

    /** Kirim pesanan: POST /pesanan */
    public function store(PlaceOrderRequest $request, OrderService $orders): RedirectResponse
    {
        $order = $orders->place(
            $request->user(),
            (int) $request->validated('seller_id'),
            PaymentMethod::from($request->validated('payment_method')),
            $request->validated('buyer_note'),
        );

        return redirect()
            ->route('orders.show', $order)
            ->with('success', 'Pesanan dikirim. Tunggu persetujuan penjual.');
    }
}
