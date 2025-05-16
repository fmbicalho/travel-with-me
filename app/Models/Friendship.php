<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'friend_id'];

    public function user()
    {
        return $this->belongsTo(User::class)->withDefault();
    }

    public function friend()
    {
        return $this->belongsTo(User::class, 'friend_id')->withDefault();
    }

    // Evitar amizade duplicada
    public static function isDuplicate($userId, $friendId)
    {
        return self::where(function($query) use ($userId, $friendId) {
            $query->where('user_id', $userId)
                  ->where('friend_id', $friendId);
        })->orWhere(function($query) use ($userId, $friendId) {
            $query->where('user_id', $friendId)
                  ->where('friend_id', $userId);
        })->exists();
    }

    // Evitar amizade consigo mesmo
    public static function isSelf($userId, $friendId)
    {
        return $userId === $friendId;
    }
}