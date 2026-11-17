<?php

namespace App\Http\Controllers;

use App\Http\Requests\StartConversationRequest;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Services\ChatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ConversationController extends Controller
{
    public function __construct(private readonly ChatService $chatService) {}

    public function index(Request $request, ?Conversation $conversation = null): Response
    {
        $user = $request->user();
        Gate::authorize('viewAny', Conversation::class);

        $conversations = $this->chatService->listForUser($user);
        $active = $conversation ?? $conversations->first();

        $messages = [];
        if ($active) {
            Gate::authorize('view', $active);
            $this->chatService->markAsRead($active, $user);

            // Reset unread_count pada item aktif di daftar percakapan
            $conversations->transform(function (Conversation $item) use ($active) {
                if ($item->id === $active->id) {
                    $item->unread_count = 0;
                }
                return $item;
            });

            $messages = MessageResource::collection($active->messages()->get())->resolve();
        }

        return Inertia::render('Chat/Index', [
            'conversations' => ConversationResource::collection($conversations)->resolve(),
            'active_conversation_id' => $active?->id,
            'messages' => $messages,
        ]);
    }

    public function start(StartConversationRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $conversation = $this->chatService->findOrCreateConversation(
            $request->user(),
            (int) $validated['recipient_id'],
            $validated['product_slug'] ?? null,
            $validated['initial_message'] ?? null,
        );

        return redirect("/pesan/{$conversation->id}");
    }

    public function storeMessage(StoreMessageRequest $request, Conversation $conversation): RedirectResponse
    {
        Gate::authorize('sendMessage', $conversation);

        $this->chatService->sendMessage($conversation, $request->user(), $request->validated('body'));

        return back();
    }
}