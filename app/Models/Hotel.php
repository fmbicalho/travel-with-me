<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $fillable = [
        'name', 'address', 'picture', 
        'phone', 'website', 'price_range', 
        'star_rating', 'city_id', 'created_by', 
        'is_confirmed', 'notes'
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}