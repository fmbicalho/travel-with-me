<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TravelUser extends Pivot
{
    protected $table = 'travel_user';

    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_DECLINED = 'declined';

    const ROLE_ADMIN = 'admin';
    const ROLE_MEMBER = 'member';

    protected $fillable = [
        'user_id', 
        'travel_id', 
        'status',
        'role',
        'invited_at',
    ];

    protected $casts = [
        'invited_at' => 'datetime',
    ];

    public function travel()
    {
        return $this->belongsTo(Travel::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}