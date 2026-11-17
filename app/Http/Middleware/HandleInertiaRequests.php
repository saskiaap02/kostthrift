<?php

namespace App\Http\Middleware;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Http\Resources\NotificationResource;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'counts' => fn () => $request->user() ? [
                'wishlist' => $request->user()->wishlistedProducts()->count(),
                'cart' => $request->user()->cartProducts()->count(),
                // jumlah pesanan masuk yang menunggu persetujuan penjual (lencana di menu avatar)
                'orders_incoming' => Order::query()
                    ->where('seller_id', $request->user()->id)
                    ->where('status', OrderStatus::Pending->value)
                    ->count(),
                'unread_chats' => 0,
                'unread_notifications' => $request->user()->unreadNotifications()->count(),
            ] : null,
            'notifications' => fn () => $request->user()
                ? NotificationResource::collection(
                    $request->user()->notifications()->latest()->limit(8)->get()
                )->resolve()
                : [],
            'flash' => fn () => [
                'success' => $request->session()->get('success'),
            ],
        ];
    }
}