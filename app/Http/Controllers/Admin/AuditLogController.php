<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AdminActionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\AdminAuditLogRequest;
use App\Http\Resources\AdminActionResource;
use App\Models\AdminAction;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

/** Riwayat tindakan admin (hanya baca). */
class AuditLogController extends Controller
{
    /** GET /admin/log */
    public function index(AdminAuditLogRequest $request): Response
    {
        $filters = $request->filters();

        $actions = AdminAction::query()
            ->with('admin:id,name')
            ->when($filters['action'] !== '', fn (Builder $query) => $query->where('action', $filters['action']))
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/AuditLog/Index', [
            'entries' => AdminActionResource::collection($actions),
            'filters' => $filters,
            'actions' => AdminActionType::options(),
        ]);
    }
}
