<?php

use App\Http\Controllers\CartItemController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MyProductController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductStatusController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route Halaman Utama, Katalog, & Detail Produk
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/produk', [ProductController::class, 'index'])->name('products.index');
Route::get('/produk/{product}', [ProductController::class, 'show'])->name('products.show');

// Route Dashboard bawaan Breeze
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route Fitur User Login (Jual, Iklan Saya, Wishlist, Troli, & Profile)
Route::middleware('auth')->group(function () {
    // Jual
    Route::get('/jual', [ProductController::class, 'create'])->name('products.create');
    Route::post('/produk', [ProductController::class, 'store'])->name('products.store');

    // Iklan Saya: daftar, edit, hapus, tandai terjual
    Route::get('/iklan-saya', [MyProductController::class, 'index'])->name('my-products.index');
    Route::get('/produk/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/produk/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/produk/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::patch('/produk/{product}/status', [ProductStatusController::class, 'update'])->name('products.status.update');

    // Wishlist & Troli
    Route::post('/wishlist/{product}', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
    Route::post('/troli', [CartItemController::class, 'store'])->name('cart.items.store');

    // Profile bawaan Breeze
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';