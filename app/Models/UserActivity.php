<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'details',
        'related_id',
        'related_type'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}