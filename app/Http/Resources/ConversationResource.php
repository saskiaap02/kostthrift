<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Conversation */
class ConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $userId = (int) $request->user()->id;
        $counterpart = $this->counterpartFor($userId);

        return [
            'id' => $this->id,
            'unread_count' => (int) ($this->unread_count ?? 0),
            'counterpart' => [
                'id' => $counterpart->id,
                'name' => $counterpart->name,
                'ktm_verified' => $counterpart->ktm_verified_at !== null,
                'campus' => $counterpart->campus?->label,
            ],
            'product' => $this->product ? [
                'slug' => $this->product->slug,
                'title' => $this->product->title,
                'price' => $this->product->price,
                'status' => $this->product->status->value,
                'image_url' => $this->product->images->first()?->url,
            ] : null,
            'last_message' => $this->latestMessage ? [
                'body' => $this->latestMessage->body,
                'is_mine' => $this->latestMessage->sender_id === $userId,
                'sent_at' => $this->latestMessage->created_at->locale('id')->diffForHumans(),
            ] : null,
        ];
    }
}