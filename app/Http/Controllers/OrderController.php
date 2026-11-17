<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Http\Resources\OrderResource;
use App\Http\Resources\PaymentAccountResource;
use App\Models\Order;
use App\Models\PaymentAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    private const RELATIONS = [
        'items.product.primaryImage',
        'buyer.campus.university',
        'seller.campus.university',
    ];

    /** Daftar pesanan: GET /pesanan?peran=beli|jual */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $request->query('peran') === 'jual' ? 'jual' : 'beli';

        $orders = Order::query()
            ->where($role === 'jual' ? 'seller_id' : 'buyer_id', $user->id)
            ->with(self::RELATIONS)
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => OrderResource::collection($orders),
            'role' => $role,
            'tally' => [
                'beli' => Order::query()->where('buyer_id', $user->id)->count(),
                'jual' => Order::query()->where('seller_id', $user->id)->count(),
                'perlu_tindakan' => Order::query()
                    ->where('seller_id', $user->id)
                    ->where('status', OrderStatus::Pending->value)
                    ->count(),
            ],
        ]);
    }

    /** Detail pesanan (pembeli dan penjual): GET /pesanan/{kode} */
    public function show(Request $request, Order $order): Response
    {
        Gate::authorize('view', $order);

        $order->load(self::RELATIONS);
        $user = $request->user();

        // Penjual memilih rekening penerima saat menyetujui pesanan transfer.
        $accounts = $order->seller_id === $user->id
            ? PaymentAccount::query()->where('user_id', $user->id)->latest('id')->get()
            : collect();

        return Inertia::render('Orders/Show', [
            'order' => OrderResource::make($order)->resolve(),
            'payment_accounts' => PaymentAccountResource::collection($accounts)->resolve(),
        ]);
    }
}
