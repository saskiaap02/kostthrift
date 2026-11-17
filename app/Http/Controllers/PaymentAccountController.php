<?php

namespace App\Http\Controllers;

use App\Enums\PaymentAccountType;
use App\Http\Requests\StorePaymentAccountRequest;
use App\Http\Resources\PaymentAccountResource;
use App\Models\PaymentAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/** Rekening / e-wallet penjual untuk menerima transfer langsung. */
class PaymentAccountController extends Controller
{
    private const MAX_ACCOUNTS = 5;

    /** GET /pengaturan/pembayaran */
    public function index(Request $request): Response
    {
        $accounts = PaymentAccount::query()
            ->where('user_id', $request->user()->id)
            ->latest('id')
            ->get();

        return Inertia::render('Settings/PaymentAccounts', [
            'accounts' => PaymentAccountResource::collection($accounts)->resolve(),
            'types' => collect(PaymentAccountType::cases())
                ->map(fn (PaymentAccountType $type) => ['value' => $type->value, 'label' => $type->label()])
                ->all(),
            'max' => self::MAX_ACCOUNTS,
        ]);
    }

    /** POST /pengaturan/pembayaran */
    public function store(StorePaymentAccountRequest $request): RedirectResponse
    {
        $user = $request->user();

        if (PaymentAccount::query()->where('user_id', $user->id)->count() >= self::MAX_ACCOUNTS) {
            throw ValidationException::withMessages([
                'provider' => 'Maksimal '.self::MAX_ACCOUNTS.' akun pembayaran. Hapus salah satu dulu.',
            ]);
        }

        PaymentAccount::create([...$request->validated(), 'user_id' => $user->id]);

        return back()->with('success', 'Akun pembayaran ditambahkan.');
    }

    /** DELETE /pengaturan/pembayaran/{id} */
    public function destroy(Request $request, PaymentAccount $paymentAccount): RedirectResponse
    {
        abort_unless($paymentAccount->user_id === $request->user()->id, 403);

        $paymentAccount->delete();

        return back()->with('success', 'Akun pembayaran dihapus.');
    }
}
