<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Spot extends Model
{
    protected $fillable = [
        'name', 'address', 'picture', 'description', 'entrance_fee',
        'opening_hours', 'closing_hours', 'type', 'city_id',
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}