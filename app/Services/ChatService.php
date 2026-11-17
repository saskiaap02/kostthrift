<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ChatService
{
    public function listForUser(User $user): Collection
    {
        return Conversation::query()
            ->forUser($user->id)
            ->with([
                'buyer.campus.university',
                'seller.campus.university',
                'product.images',
                'latestMessage',
            ])
            ->withCount([
                'messages as unread_count' => fn ($query) => $query
                    ->where('sender_id', '!=', $user->id)
                    ->whereNull('read_at'),
            ])
            ->orderByDesc('last_message_at')
            ->orderByDesc('updated_at')
            ->get();
    }

    public function findOrCreateConversation(
        User $initiator,
        int $recipientId,
        ?string $productSlug = null,
        ?string $initialMessage = null
    ): Conversation {
        return DB::transaction(function () use ($initiator, $recipientId, $productSlug, $initialMessage) {
            $product = $productSlug
                ? Product::query()->where('slug', $productSlug)->first()
                : null;

            $conversation = Conversation::query()
                ->where(function ($q) use ($initiator, $recipientId) {
                    $q->where('buyer_id', $initiator->id)->where('seller_id', $recipientId);
                })
                ->orWhere(function ($q) use ($initiator, $recipientId) {
                    $q->where('buyer_id', $recipientId)->where('seller_id', $initiator->id);
                })
                ->first();

            if (! $conversation) {
                $buyerId = $product ? ($product->seller_id === $recipientId ? $initiator->id : $recipientId) : $initiator->id;
                $sellerId = $buyerId === $initiator->id ? $recipientId : $initiator->id;

                $conversation = Conversation::query()->create([
                    'buyer_id' => $buyerId,
                    'seller_id' => $sellerId,
                    'product_id' => $product?->id,
                    'last_message_at' => now(),
                ]);
            } elseif ($product && $conversation->product_id !== $product->id) {
                $conversation->update(['product_id' => $product->id]);
            }

            if ($initialMessage && trim($initialMessage) !== '') {
                $this->sendMessage($conversation, $initiator, trim($initialMessage));
            }

            return $conversation;
        });
    }

    public function sendMessage(Conversation $conversation, User $sender, string $body): Message
    {
        return DB::transaction(function () use ($conversation, $sender, $body) {
            $message = $conversation->messages()->create([
                'sender_id' => $sender->id,
                'body' => trim($body),
            ]);

            $conversation->update([
                'last_message_at' => $message->created_at,
            ]);

            return $message;
        });
    }

    public function markAsRead(Conversation $conversation, User $reader): void
    {
        $conversation->messages()
            ->where('sender_id', '!=', $reader->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public static function unreadConversationsCount(User $user): int
    {
        return Conversation::query()
            ->forUser($user->id)
            ->whereHas('messages', fn ($query) => $query
                ->where('sender_id', '!=', $user->id)
                ->whereNull('read_at'))
            ->count();
    }
}