<?php
namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

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

    protected $appends = ['photo_url'];

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
        return $this->belongsToMany(
            User::class,
            'friendships',
            'user_id',
            'friend_id'
        )
            ->withTimestamps()
            ->select('users.id', 'users.name', 'users.email', 'users.photo', 'users.nickname');
    }

    public function friendOf()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'friend_id',
            'user_id'
        )
            ->withTimestamps()
            ->select('users.id', 'users.name', 'users.email', 'users.photo', 'users.nickname');
    }

    public function allFriends()
    {
        return User::query()
            ->select('users.id', 'users.name', 'users.email', 'users.photo', 'users.nickname')
            ->where('users.id', '!=', $this->id)
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('friendships')
                    ->where(function ($q) {
                        $q->where('friendships.user_id', $this->id)
                            ->whereRaw('friendships.friend_id = users.id');
                    })
                    ->orWhere(function ($q) {
                        $q->where('friendships.friend_id', $this->id)
                            ->whereRaw('friendships.user_id = users.id');
                    });
            });
    }

    public function allFriendsWithMessages()
    {
        return $this->allFriends()->load(['sentMessages', 'receivedMessages']);
    }

    public function friendshipsAsUser()
    {
        return $this->hasMany(Friendship::class, 'user_id');
    }

    public function friendshipsAsFriend()
    {
        return $this->hasMany(Friendship::class, 'friend_id');
    }

    public function isFriendsWith(User $user)
    {
        return DB::table('friendships')
            ->where(function ($query) use ($user) {
                $query->where('user_id', $this->id)
                    ->where('friend_id', $user->id);
            })
            ->orWhere(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('friend_id', $this->id);
            })
            ->exists();
    }

    public function scopeExcludeCurrent($query)
    {
        return $query->where('id', '!=', auth()->id());
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
            'creator_id', // Foreign key on travels table
            'travel_id',  // Foreign key on travel_updates table
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

    // In your User model
    public function getPhotoUrlAttribute()
    {
        if (! $this->attributes['photo']) {
            return null;
        }

        // If it's already a full URL
        if (filter_var($this->attributes['photo'], FILTER_VALIDATE_URL)) {
            return $this->attributes['photo'];
        }

        // For locally stored files, ensure we don't duplicate 'storage'
        return asset('storage/' . ltrim($this->attributes['photo'], 'storage/'));
    }

    public function getPhotoAttribute()
    {
        return $this->photo_url;
    }

}
