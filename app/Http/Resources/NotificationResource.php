<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \Illuminate\Notifications\DatabaseNotification */
class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $data = $this->data ?? [];

        return [
            'id' => $this->id,
            'title' => $data['title'] ?? 'Pemberitahuan',
            'message' => $data['message'] ?? '',
            'url' => $data['url'] ?? '/',
            'icon' => $data['icon'] ?? 'bell',
            'category' => $data['category'] ?? 'info',
            'is_read' => $this->read_at !== null,
            'created_at' => $this->created_at->locale('id')->diffForHumans(),
        ];
    }
}