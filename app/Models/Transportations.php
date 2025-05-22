<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transportations extends Model{
    protected $fillable = [
        'user_id',
        'travel_id',
        'transportation_type',
        'departure_date',
        'arrival_date',
        'departure_time',
        'arrival_time',
        'departure_location',
        'arrival_location',
        'comments',
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
        $totalPrice = Transportations::where('travel_id', $travelId)->sum('price');
        return response()->json($totalPrice);
    }

    public function getTotalPriceByType($travelId, $type){
        $totalPrice = Transportations::where('travel_id', $travelId)->where('transportation_type', $type)->sum('price');
        return response()->json($totalPrice);
    }

}