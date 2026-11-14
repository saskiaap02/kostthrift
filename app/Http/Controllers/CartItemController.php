<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCartItemRequest;
use Illuminate\Http\RedirectResponse;

class CartItemController extends Controller
{
    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $request->user()
            ->cartProducts()
            ->syncWithoutDetaching([$request->integer('product_id')]);

        return back()->with('success', 'Barang ditambahkan ke troli.');
    }
}
