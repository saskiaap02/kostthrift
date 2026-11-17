<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcceptOrderRequest;
use App\Http\Requests\CancelOrderRequest;
use App\Http\Requests\ReportPaymentRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

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

    public function reportPayment(ReportPaymentRequest $request, Order $order, OrderService $orders): RedirectResponse
    {
        Gate::authorize('view', $order);

        // Simpan di disk privat (local), bukan public
        $path = $request->file('payment_proof')->store('payment-proofs', 'local');

        try {
            $orders->reportPayment($order, $request->user(), $path);
        } catch (Throwable $e) {
            Storage::disk('local')->delete($path);
            throw $e;
        }

        return back()->with('success', 'Bukti transfer terkirim. Tunggu konfirmasi penjual.');
    }

    public function paymentProof(Order $order): StreamedResponse
    {
        Gate::authorize('view', $order);

        abort_unless(
            $order->payment_proof_path && Storage::disk('local')->exists($order->payment_proof_path),
            404
        );

        return Storage::disk('local')->response($order->payment_proof_path);
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