<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelReservation extends Model{
    protected $fillable = [
        'user_id',
        'travel_id',
        'reservation_number',
        'check_in_date',
        'check_out_date',
        'hotel_name',
        'room_type',
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
        $totalPrice = HotelReservation::where('travel_id', $travelId)->sum('price');
        return response()->json($totalPrice);
    }
}