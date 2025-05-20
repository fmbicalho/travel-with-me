<?php

namespace App\Policies;

use App\Models\Travel;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TravelPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any travels.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the travel.
     */
    public function view(User $user, Travel $travel): bool
    {
        return $travel->creator_id === $user->id || 
               $travel->users->contains($user->id) || 
               $travel->is_public;
    }

    /**
     * Determine whether the user can create travels.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the travel.
     */
    public function update(User $user, Travel $travel): bool
    {
        return $travel->creator_id === $user->id || $travel->isAdmin($user);
    }

    /**
     * Determine whether the user can delete the travel.
     */
    public function delete(User $user, Travel $travel): bool
    {
        return $travel->creator_id === $user->id;
    }

    /**
     * Determine whether the user can manage travel members.
     */
    public function manage(User $user, Travel $travel): bool
    {
        return $travel->creator_id === $user->id || $travel->isAdmin($user);
    }

    /**
     * Determine whether the user can view invites for the travel.
     */
    public function viewInvites(User $user, Travel $travel): bool
    {
        // Load the users relationship if not already loaded
        if (!$travel->relationLoaded('users')) {
            $travel->load('users');
        }
        return $travel->creator_id === $user->id || 
               $travel->users->contains($user->id) || 
               $travel->isAdmin($user);
    }

    /**
     * Determine whether the user can invite others to the travel.
     */
    public function invite(User $user, Travel $travel): bool
    {
        // Load the users relationship if not already loaded
        if (!$travel->relationLoaded('users')) {
            $travel->load('users');
        }
        return $travel->creator_id === $user->id || $travel->isAdmin($user);
    }
} 