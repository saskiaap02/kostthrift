<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KtmReviewController;
use App\Http\Controllers\Admin\OrderMonitorController;
use App\Http\Controllers\Admin\ProductModerationController;
use App\Http\Controllers\Admin\ReportReviewController;
use App\Http\Controllers\Admin\UserDirectoryController;
use App\Http\Controllers\Admin\UserSuspensionController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InfoPageController;
use App\Http\Controllers\KtmVerificationController;
use App\Http\Controllers\MyProductController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderTransitionController;
use App\Http\Controllers\PaymentAccountController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductStatusController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\WishlistController;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\EnsureKtmVerified;
use App\Http\Middleware\EnsureNotAdmin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route Halaman Utama, Katalog, & Detail Produk
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/produk', [ProductController::class, 'index'])->name('products.index');
Route::get('/produk/{product}', [ProductController::class, 'show'])->name('products.show');

// Route Halaman Informasi & Bantuan (Publik)
Route::controller(InfoPageController::class)->group(function () {
    Route::get('/syarat-ketentuan', 'terms')->name('info.terms');
    Route::get('/kebijakan-privasi', 'privacy')->name('info.privacy');
    Route::get('/bantuan', 'help')->name('info.help');
    Route::get('/panduan-transaksi', 'guide')->name('info.guide');
    Route::get('/titik-temu-cod', 'meetup')->name('info.meetup');
});

// Route Dashboard bawaan Breeze
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route Fitur User Login & Panel Admin
Route::middleware('auth')->group(function () {
    // Foto KTM: pemilik dan admin (dijaga KtmVerificationPolicy)
    Route::get('/verifikasi-ktm/{verification}/dokumen', [KtmVerificationController::class, 'document'])->name('ktm.document');

    // Pesan / Chat antar pengguna
    Route::get('/pesan', [ConversationController::class, 'index'])->name('chat.index');
    Route::post('/pesan/mulai', [ConversationController::class, 'start'])->name('chat.start');
    Route::get('/pesan/{conversation}', [ConversationController::class, 'index'])->name('chat.show');
    Route::post('/pesan/{conversation}/kirim', [ConversationController::class, 'storeMessage'])->name('chat.messages.store');

    // Pembeli dan penjual. Akun admin dialihkan ke panel admin.
    Route::middleware(EnsureNotAdmin::class)->group(function () {
        // Jual & AI Foto Produk: WAJIB mahasiswa terverifikasi KTM
        // Semua aksi sensitif di bawah ini juga mewajibkan email terverifikasi ('verified').
        Route::get('/jual', [ProductController::class, 'create'])
            ->middleware(['verified', EnsureKtmVerified::class])->name('products.create');
        Route::post('/produk', [ProductController::class, 'store'])
            ->middleware(['verified', EnsureKtmVerified::class])->name('products.store');
        Route::post('/produk/analisis-foto', [ProductController::class, 'analyzePhoto'])
            ->middleware(['verified', EnsureKtmVerified::class, 'throttle:10,5'])->name('products.analyze-photo');

        // Iklan Saya: daftar, edit, hapus, tandai terjual
        Route::get('/iklan-saya', [MyProductController::class, 'index'])->name('my-products.index');
        Route::get('/produk/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::put('/produk/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/produk/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        Route::patch('/produk/{product}/status', [ProductStatusController::class, 'update'])->name('products.status.update');

        // Laporkan iklan (penipuan, barang terlarang, spam, dll.)
        Route::post('/produk/{product}/laporan', [ReportController::class, 'store'])
            ->middleware(['verified', 'throttle:10,1'])->name('products.report');

        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
        Route::post('/wishlist/{product}', [WishlistController::class, 'toggle'])
            ->middleware('throttle:60,1')->name('wishlist.toggle');

        // Troli
        Route::get('/troli', [CartController::class, 'index'])->name('cart.index');
        Route::post('/troli', [CartItemController::class, 'store'])
            ->middleware('throttle:60,1')->name('cart.items.store');
        Route::delete('/troli/{product}', [CartItemController::class, 'destroy'])->name('cart.items.destroy');

        // Checkout: WAJIB terverifikasi KTM (pembeli maupun penjual)
        Route::get('/checkout/{seller}', [CheckoutController::class, 'show'])
            ->middleware(['verified', EnsureKtmVerified::class])->name('checkout.show');
        Route::post('/pesanan', [CheckoutController::class, 'store'])
            ->middleware(['verified', EnsureKtmVerified::class, 'throttle:20,1'])->name('orders.store');

        // Pesanan
        Route::get('/pesanan', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/pesanan/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::get('/pesanan/{order}/bukti-bayar', [OrderTransitionController::class, 'paymentProof'])->name('orders.payment-proof');
        Route::post('/pesanan/{order}/setujui', [OrderTransitionController::class, 'accept'])->name('orders.accept');
        Route::post('/pesanan/{order}/batalkan', [OrderTransitionController::class, 'cancel'])->name('orders.cancel');
        Route::post('/pesanan/{order}/lapor-bayar', [OrderTransitionController::class, 'reportPayment'])->name('orders.report-payment');
        Route::post('/pesanan/{order}/konfirmasi-bayar', [OrderTransitionController::class, 'confirmPayment'])->name('orders.confirm-payment');
        Route::post('/pesanan/{order}/selesai', [OrderTransitionController::class, 'complete'])->name('orders.complete');

        // Akun pembayaran penjual (rekening / e-wallet)
        Route::get('/pengaturan/pembayaran', [PaymentAccountController::class, 'index'])->name('payment-accounts.index');
        Route::post('/pengaturan/pembayaran', [PaymentAccountController::class, 'store'])->name('payment-accounts.store');
        Route::delete('/pengaturan/pembayaran/{paymentAccount}', [PaymentAccountController::class, 'destroy'])->name('payment-accounts.destroy');

        // Verifikasi KTM (halaman pengguna)
        Route::get('/verifikasi-ktm', [KtmVerificationController::class, 'show'])->name('ktm.show');
        Route::post('/verifikasi-ktm', [KtmVerificationController::class, 'store'])
            ->middleware(['verified', 'throttle:5,10'])->name('ktm.store');

        // Notifikasi dalam aplikasi
        Route::get('/notifikasi', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifikasi/{id}/baca', [NotificationController::class, 'read'])->name('notifications.read');
        Route::post('/notifikasi/baca-semua', [NotificationController::class, 'readAll'])->name('notifications.read-all');
    });

    // Panel admin
    Route::middleware(EnsureAdmin::class)->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/verifikasi-ktm', [KtmReviewController::class, 'index'])->name('ktm.index');
        Route::post('/verifikasi-ktm/{verification}/setujui', [KtmReviewController::class, 'approve'])->name('ktm.approve');
        Route::post('/verifikasi-ktm/{verification}/tolak', [KtmReviewController::class, 'reject'])->name('ktm.reject');

        Route::get('/iklan', [ProductModerationController::class, 'index'])->name('products.index');
        Route::delete('/iklan/{product}', [ProductModerationController::class, 'destroy'])->name('products.destroy');

        Route::get('/laporan', [ReportReviewController::class, 'index'])->name('reports.index');
        Route::post('/laporan/{report}/turunkan', [ReportReviewController::class, 'takeDown'])->name('reports.take-down');
        Route::post('/laporan/{report}/tolak', [ReportReviewController::class, 'dismiss'])->name('reports.dismiss');

        Route::get('/pesanan', [OrderMonitorController::class, 'index'])->name('orders.index');
        Route::get('/pesanan/{order}/bukti-bayar', [OrderMonitorController::class, 'paymentProof'])->name('orders.payment-proof');

        Route::get('/log', [AuditLogController::class, 'index'])->name('audit-log.index');

        Route::get('/pengguna', [UserDirectoryController::class, 'index'])->name('users.index');
        Route::post('/pengguna/{user}/blokir', [UserSuspensionController::class, 'store'])->name('users.suspend');
        Route::delete('/pengguna/{user}/blokir', [UserSuspensionController::class, 'destroy'])->name('users.unsuspend');
    });

    // Profile bawaan Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';