<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppUpdate extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'related_id',
        'related_type'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}