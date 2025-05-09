<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TravelInvite extends Model
{
    protected $fillable = [
        'travel_id',
        'sender_id',
        'email',
        'token',
        'status'
    ];

    public function travel()
    {
        return $this->belongsTo(Travel::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}