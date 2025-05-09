<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'name', 'address', 'picture', 'cuisine_type', 'phone', 'website',
         'opening_hours', 'closing_hours', 'city_id',
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}