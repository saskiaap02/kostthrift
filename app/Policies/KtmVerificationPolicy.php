<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\KtmVerification;
use App\Models\User;

class KtmVerificationPolicy
{
    /** Foto KTM hanya boleh dibuka pemiliknya dan admin. */
    public function viewDocument(User $user, KtmVerification $verification): bool
    {
        return $user->role === UserRole::Admin->value
            || $user->id === $verification->user_id;
    }
}
