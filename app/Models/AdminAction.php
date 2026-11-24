<?php

namespace App\Models;

use App\Enums\AdminActionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** Jejak tindakan admin. Hanya ditambah, tidak pernah diubah (tidak ada updated_at). */
class AdminAction extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = ['admin_id', 'action', 'summary', 'subject_type', 'subject_id', 'meta'];

    protected function casts(): array
    {
        return [
            'action' => AdminActionType::class,
            'meta' => 'array',
        ];
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
