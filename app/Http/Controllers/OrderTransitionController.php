<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcceptOrderRequest;
use App\Http\Requests\CancelOrderRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/** Perubahan status pesanan. Aturan siapa-boleh-apa ada di OrderService. */
class OrderTransitionController extends Controller
{
    public function accept(AcceptOrderRequest $request, Order $order, OrderService $orders): RedirectResponse
    {
        Gate::authorize('view', $order);

        $orders->accept(
            $order,
            $request->user(),
            $request->integer('payment_account_id') ?: null,
            $request->validated('seller_note'),
        );

        return back()->with('success', 'Pesanan disetujui.');
    }

    public function cancel(CancelOrderRequest $request, Order $order, OrderService $orders): RedirectResponse
    {
        Gate::authorize('view', $order);

        $orders->cancel($order, $request->user(), $request->validated('reason'));

        return back()->with('success', 'Pesanan dibatalkan.');
    }

    public function reportPayment(Request $request, Order $order, OrderService $orders): RedirectResponse
    {
        Gate::authorize('view', $order);

        $orders->reportPayment($order, $request->user());

        return back()->with('success', 'Pembayaran dilaporkan. Tunggu konfirmasi penjual.');
    }

    public function confirmPayment(Request $request, Order $order, OrderService $orders): RedirectResponse
    {
        Gate::authorize('view', $order);

        $orders->confirmPayment($order, $request->user());

        return back()->with('success', 'Pembayaran dikonfirmasi.');
    }

    public function complete(Request $request, Order $order, OrderService $orders): RedirectResponse
    {
        Gate::authorize('view', $order);

        $orders->complete($order, $request->user());

        return back()->with('success', 'Pesanan selesai.');
    }
}
