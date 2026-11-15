<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCartItemRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $request->user()
            ->cartProducts()
            ->syncWithoutDetaching([$request->integer('product_id')]);

        return back()->with('success', 'Barang ditambahkan ke troli.');
    }

    /** Hapus satu barang dari troli: DELETE /troli/{slug} */
    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $request->user()->cartProducts()->detach($product->id);

        return back()->with('success', 'Barang dihapus dari troli.');
    }
}
