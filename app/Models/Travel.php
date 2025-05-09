<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Travel extends Model
{
    protected $table = 'travels';
    
    protected $fillable = [
        'title', 'destination', 'start_date', 'end_date', 'description', 'is_public', 'status', 'cover_image', 'creator_id',
    ];

    protected $dates = ['start_date', 'end_date','created_at','updated_at'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'travel_user');
    }

    public function cities()
    {
        return $this->hasMany(City::class);
    }

    public function updates(): HasMany
    {
        return $this->hasMany(TravelUpdate::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class)
            ->using(TravelUser::class)
            ->withPivot(['status', 'role', 'invited_at'])
            ->withTimestamps();
    }
}
