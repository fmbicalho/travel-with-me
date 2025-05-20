<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserTravelExpenses extends Model{
    protected $fillable = [
        'user_id',
        'travel_id',
        'expense_type',
        'amount',
        'date',
        'description',
        'category',
        'status',
        'payment_method',
        'payment_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function travel()
    {
        return $this->belongsTo(Travel::class);
    }
    
}