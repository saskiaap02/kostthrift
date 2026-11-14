<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function toggle(Request $request, Product $product): RedirectResponse
    {
        abort_unless($product->status === ProductStatus::Active, 404);

        $request->user()->wishlistedProducts()->toggle($product->id);

        return back();
    }
}
