<?php

namespace App\Services;

use App\Enums\AdminActionType;
use App\Models\AdminAction;
use App\Models\User;

/**
 * Mencatat tindakan admin yang mengubah data orang lain. Ringkasan ditulis saat kejadian
 * (memuat nama/judul saat itu) sehingga tetap terbaca walau iklan atau akunnya kemudian berubah.
 */
class AdminAuditLog
{
    /** @param  array<string, mixed>  $meta */
    public function record(
        User $admin,
        AdminActionType $action,
        string $summary,
        ?string $subjectType = null,
        ?int $subjectId = null,
        array $meta = [],
    ): AdminAction {
        return AdminAction::create([
            'admin_id' => $admin->id,
            'action' => $action,
            'summary' => mb_substr($summary, 0, 255),
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'meta' => $meta ?: null,
        ]);
    }
}
