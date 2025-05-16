<?php

namespace App\Policies;

use App\Models\City;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CityPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the city.
     */
    public function view(User $user, City $city): bool
    {
        return $user->travels->contains($city->travel_id);
    }

    /**
     * Determine whether the user can create cities.
     */
    public function create(User $user, City $city): bool
    {
        return $user->travels->contains($city->travel_id);
    }

    /**
     * Determine whether the user can update the city.
     */
    public function update(User $user, City $city): bool
    {
        return $city->travel->creator_id === $user->id;
    }

    /**
     * Determine whether the user can delete the city.
     */
    public function delete(User $user, City $city): bool
    {
        return $city->travel->creator_id === $user->id;
    }
} 