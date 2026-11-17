<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Message */
class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'is_mine' => $request->user()?->id === $this->sender_id,
            'is_read' => $this->read_at !== null,
            'sent_at' => $this->created_at->locale('id')->format('H:i'),
            'sent_date' => $this->created_at->locale('id')->translatedFormat('d M Y'),
        ];
    }
}