<?php

namespace App\Http\Controllers\Admin;

use App\Enums\KtmVerificationStatus;
use App\Enums\ProductStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\AdminProductResource;
use App\Http\Resources\KtmVerificationResource;
use App\Models\KtmVerification;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /** Ringkasan platform: GET /admin */
    public function index(): Response
    {
        $since = now()->subDays(7);
        $members = User::query()->where('role', UserRole::User->value);

        $stats = [
            'users' => (clone $members)->count(),
            'verified_users' => (clone $members)->whereNotNull('ktm_verified_at')->count(),
            'new_users' => (clone $members)->where('created_at', '>=', $since)->count(),
            'pending_ktm' => KtmVerification::query()
                ->where('status', KtmVerificationStatus::Pending->value)
                ->count(),
            'active_products' => Product::query()->where('status', ProductStatus::Active->value)->count(),
            'sold_products' => Product::query()->where('status', ProductStatus::Sold->value)->count(),
            'new_products' => Product::query()->where('created_at', '>=', $since)->count(),
        ];

        $pending = KtmVerification::query()
            ->with(['user:id,name,email', 'university:id,name'])
            ->where('status', KtmVerificationStatus::Pending->value)
            ->oldest('id')
            ->limit(5)
            ->get();

        $recentProducts = Product::query()
            ->with(['primaryImage', 'seller:id,name,ktm_verified_at', 'campus.university'])
            ->latest('id')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'pending' => KtmVerificationResource::collection($pending)->resolve(),
            'recent_products' => AdminProductResource::collection($recentProducts)->resolve(),
        ]);
    }
}
