<?php
namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nickname',
        'photo',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function travels()
    {
        return $this->belongsToMany(Travel::class, 'travel_user', 'user_id', 'travel_id');
    }

    // Friend Invites
    public function sentFriendInvites()
    {
        return $this->hasMany(FriendInvite::class, 'sender_id');
    }

    public function receivedFriendInvites()
    {
        return $this->hasMany(FriendInvite::class, 'receiver_id');
    }

    // Friendships
    public function friends()
    {
        return $this->belongsToMany(User::class, 'friendships', 'user_id', 'friend_id')
            ->withTimestamps()
            ->as('friend');
    }

    public function isFriendsWith(User $user)
    {
        return Friendship::where(function ($query) use ($user) {
            $query->where('user_id', $this->id)
                ->where('friend_id', $user->id);
        })->orWhere(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->where('friend_id', $this->id);
        })->exists();
    }

    public function createdTravels(): HasMany
    {
        return $this->hasMany(Travel::class, 'creator_id');
    }

    public function travelUpdates(): HasManyThrough
    {
        return $this->hasManyThrough(
            TravelUpdate::class,
            Travel::class,
            'creator_id',  // Foreign key on travels table
            'travel_id',   // Foreign key on travel_updates table
            'id',         // Local key on users table
            'id'          // Local key on travels table
        );
    }

    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
}
