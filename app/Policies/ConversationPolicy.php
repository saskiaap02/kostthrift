<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role !== UserRole::Admin;
    }

    public function view(User $user, Conversation $conversation): bool
    {
        return $user->role !== UserRole::Admin && $conversation->hasParticipant($user->id);
    }

    public function sendMessage(User $user, Conversation $conversation): bool
    {
        return $this->view($user, $conversation);
    }
}