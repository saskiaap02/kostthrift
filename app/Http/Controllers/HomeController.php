<?php

namespace App\Http\Controllers;

use App\Http\Requests\HomeIndexRequest;
use App\Http\Resources\CampusResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Campus;
use App\Models\Category;
use App\Services\ProductQueryService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private readonly ProductQueryService $products)
    {
    }

    public function index(HomeIndexRequest $request): Response
    {
        $filters = $request->filters();

        return Inertia::render('Home', [
            'products' => ProductResource::collection(
                $this->products->paginate($filters, $request->user()),
            ),
            'filters' => $filters,
            'categories' => CategoryResource::collection(
                Category::query()->orderBy('sort_order')->get(),
            )->resolve(),
            'campuses' => CampusResource::collection(Campus::selectable())->resolve(),
        ]);
    }
}
