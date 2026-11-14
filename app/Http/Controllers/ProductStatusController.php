<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Http\Requests\UpdateProductStatusRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;

class ProductStatusController extends Controller
{
    /** Tandai terjual / aktifkan lagi: PATCH /produk/{slug}/status */
    public function update(UpdateProductStatusRequest $request, Product $product): RedirectResponse
    {
        $status = ProductStatus::from($request->validated('status'));

        $product->update(['status' => $status]);

        return back()->with('success', $status === ProductStatus::Sold
            ? 'Iklan ditandai terjual.'
            : 'Iklan aktif kembali.');
    }
}
