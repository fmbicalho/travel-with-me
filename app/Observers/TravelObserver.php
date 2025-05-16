<?php

namespace App\Observers;

use App\Models\Travel;
use App\Models\AppUpdate;

class TravelObserver
{
    /**
     * Handle the Travel "created" event.
     */
    public function created(Travel $travel): void
    {
        // Create an app update when a new travel is created
        AppUpdate::create([
            'title' => 'New Travel Created',
            'description' => "A new travel to {$travel->destination} was created",
            'type' => 'travel_created',
            'related_id' => $travel->id,
            'related_type' => Travel::class
        ]);
    }

    /**
     * Handle the Travel "updated" event.
     */
    public function updated(Travel $travel): void
    {
        // If important fields were updated, create an app update
        if ($travel->wasChanged(['destination', 'start_date', 'end_date'])) {
            AppUpdate::create([
                'title' => 'Travel Updated',
                'description' => "Travel to {$travel->destination} was updated",
                'type' => 'travel_updated',
                'related_id' => $travel->id,
                'related_type' => Travel::class
            ]);
        }
    }

    /**
     * Handle the Travel "deleted" event.
     */
    public function deleted(Travel $travel): void
    {
        // Create an app update when a travel is deleted
        AppUpdate::create([
            'title' => 'Travel Deleted',
            'description' => "Travel to {$travel->destination} was deleted",
            'type' => 'travel_deleted',
            'related_id' => $travel->id,
            'related_type' => Travel::class
        ]);
    }
} 