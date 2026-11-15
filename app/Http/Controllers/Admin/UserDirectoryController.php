<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminListRequest;
use App\Http\Resources\AdminUserResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class UserDirectoryController extends Controller
{
    /** Daftar pengguna (tanpa admin), bisa dicari: GET /admin/pengguna */
    public function index(AdminListRequest $request): Response
    {
        $term = $request->filters()['q'];

        $users = User::query()
            ->where('role', UserRole::User->value)
            ->with('campus.university')
            ->when($term !== '', function (Builder $query) use ($term) {
                $like = '%'.addcslashes($term, '%_\\').'%';

                $query->where(fn (Builder $match) => $match
                    ->where('name', 'like', $like)
                    ->orWhere('email', 'like', $like));
            })
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => AdminUserResource::collection($users),
            'filters' => ['q' => $term],
        ]);
    }
}
