<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(User $user)
{
    // Get conversation between authenticated user and selected user
    $messages = Message::where(function($query) use ($user) {
        $query->where('sender_id', Auth::id())
              ->where('receiver_id', $user->id);
    })->orWhere(function($query) use ($user) {
        $query->where('sender_id', $user->id)
              ->where('receiver_id', Auth::id());
    })->orderBy('created_at', 'desc')
      ->paginate(20);

    // Get friendships with last message info
    $friendships = Auth::user()->friends()
        ->with(['friend' => function($query) {
            $query->with(['sentMessages', 'receivedMessages']);
        }])
        ->get()
        ->map(function ($friendship) {
            // Get the last message between auth user and this friend
            $lastMessage = Message::where(function($query) use ($friendship) {
                $query->where('sender_id', Auth::id())
                      ->where('receiver_id', $friendship->friend_id);
            })->orWhere(function($query) use ($friendship) {
                $query->where('sender_id', $friendship->friend_id)
                      ->where('receiver_id', Auth::id());
            })->latest()
              ->first();

            // Count unread messages
            $unreadCount = Message::where('sender_id', $friendship->friend_id)
                ->where('receiver_id', Auth::id())
                ->whereNull('read_at')
                ->count();

            return [
                'id' => $friendship->id,
                'friend' => [
                    'id' => $friendship->friend->id,
                    'name' => $friendship->friend->name,
                    'photo' => $friendship->friend->photo,
                    'last_message' => $lastMessage?->content,
                    'last_message_time' => $lastMessage?->created_at,
                    'unread_count' => $unreadCount,
                ]
            ];
        });

    return Inertia::render('Chat/Conversation', [
        'messages' => $messages,
        'friend' => $user->only(['id', 'name', 'photo']),
        'friendships' => $friendships,
    ]);
}

    public function store(Request $request, User $user)
    {
        $request->validate([
            'content' => 'required|string|max:1000'
        ]);

        $message = Auth::user()->sentMessages()->create([
            'receiver_id' => $user->id,
            'content' => $request->content
        ]);

        return response()->json($message, 201);
    }

    public function destroy(Message $message)
    {
        $this->authorize('delete', $message);
        $message->delete();
        return response()->noContent();
    }
}