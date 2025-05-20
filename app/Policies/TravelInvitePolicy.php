<?php

namespace App\Policies;

use App\Models\TravelInvite;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TravelInvitePolicy
{
    use HandlesAuthorization;

    public function viewInvites(User $user, $travel)
    {
        return $travel->creator_id === $user->id || $travel->isMember($user) || $travel->isAdmin($user);
    }

    public function invite(User $user, $travel)
    {
        return $travel->creator_id === $user->id || $travel->isAdmin($user);
    }

    public function delete(User $user, TravelInvite $invite)
    {
        return $user->id === $invite->sender_id || $invite->travel->isAdmin($user);
    }
} 