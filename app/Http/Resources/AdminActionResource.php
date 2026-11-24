<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\AdminAction */
class AdminActionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'action' => $this->action->value,
            'action_label' => $this->action->label(),
            'summary' => $this->summary,
            'admin' => $this->admin?->name ?? 'Admin terhapus',
            'reason' => $this->meta['reason'] ?? null,
            'at' => $this->created_at->locale('id')->isoFormat('D MMM YYYY, HH:mm'),
            'ago' => $this->created_at->locale('id')->diffForHumans(),
        ];
    }
}
