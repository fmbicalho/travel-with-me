<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TravelUser extends Pivot
{
    protected $table = 'travel_user';

    protected $fillable = [
        'user_id', 
        'travel_id', 
        'status',
        'invited_at',
    ];

    protected $casts = [
        'invited_at' => 'datetime',
    ];
}