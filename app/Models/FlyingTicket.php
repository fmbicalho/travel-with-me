<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlyingTicket extends Model{
    protected $fillable = [
        'user_id',
        'travel_id',
        'ticket_number',
        'departure_date',
        'arrival_date',
        'departure_airport',
        'arrival_airport',
        'price',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function travel()
    {
        return $this->belongsTo(Travel::class);
    }

    public function getTotalPrice($travelId){
        $totalPrice = FlyingTicket::where('travel_id', $travelId)->sum('price');
        return response()->json($totalPrice);
    }
}