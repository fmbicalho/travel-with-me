<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\TravelUser;
use App\Models\User;
use App\Models\City;

class Travel extends Model
{
    const STATUS_DRAFT = 'draft';
    const STATUS_PLANNED = 'planned';
    const STATUS_ONGOING = 'ongoing';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    protected $table = 'travels';
    
    protected $fillable = [
        'title', 'destination', 'start_date', 'end_date', 'description', 'is_public', 'status', 'cover_image', 'creator_id',
    ];

    protected $dates = ['start_date', 'end_date','created_at','updated_at'];

    protected $attributes = [
        'status' => self::STATUS_DRAFT,
        'is_public' => false
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'travel_user')
            ->using(TravelUser::class)
            ->withPivot(['status', 'role', 'invited_at'])
            ->withTimestamps();
    }

    public function cities(): HasMany
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

    public function invites(): HasMany
    {
        return $this->hasMany(TravelInvite::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(TravelUser::class)
            ->withPivot(['status', 'role', 'invited_at'])
            ->wherePivot('status', TravelUser::STATUS_ACCEPTED)
            ->withTimestamps();
    }

    public function admins(): BelongsToMany
    {
        return $this->members()
            ->wherePivot('role', TravelUser::ROLE_ADMIN);
    }

    public function isAdmin(User $user): bool
    {
        return $this->admins()->where('users.id', $user->id)->exists();
    }

    public function isMember(User $user): bool
    {
        return $this->members()->where('users.id', $user->id)->exists();
    }

    public function flying_tickets()
    {
        return $this->hasMany(FlyingTicket::class);
    }

    public function hotel_reservations()
    {
        return $this->hasMany(HotelReservation::class);
    }

    public function transportations()
    {
        return $this->hasMany(Transportations::class);
    }
}
