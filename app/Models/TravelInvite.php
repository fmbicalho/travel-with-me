<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TravelInvite extends Model
{
    const STATUS_PENDING = 'pending';
    const STATUS_ACCEPTED = 'accepted';
    const STATUS_DECLINED = 'declined';

    protected $fillable = [
        'travel_id',
        'sender_id',
        'email',
        'token',
        'status'
    ];

    protected $attributes = [
        'status' => self::STATUS_PENDING
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function travel()
    {
        return $this->belongsTo(Travel::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }
}