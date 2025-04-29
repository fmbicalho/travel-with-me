<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Travel extends Model
{
    protected $fillable = [
        'title', 'destination', 'start_date', 'end_date', 'description', 'cover_image'
    ];

    protected $dates = ['start_date', 'end_date'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user');
    }

    public function cities()
    {
        return $this->hasMany(City::class);
    }

    public function updates()
    {
        return $this->hasMany(TravelUpdate::class);
    }
}