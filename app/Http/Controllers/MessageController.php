<?php
namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        // Get all friends with their last message and unread count
        $friends = Auth::user()->allFriends()->get()->map(function ($friend) {
            $lastMessage = Message::where(function ($query) use ($friend) {
                $query->where('sender_id', Auth::id())
                    ->where('receiver_id', $friend->id);
            })->orWhere(function ($query) use ($friend) {
                $query->where('sender_id', $friend->id)
                    ->where('receiver_id', Auth::id());
            })->latest()
                ->first();

            $unreadCount = Message::where('sender_id', $friend->id)
                ->where('receiver_id', Auth::id())
                ->whereNull('read_at')
                ->count();

            return [
                'id'                => $friend->id,
                'name'              => $friend->name,
                'last_message'      => $lastMessage?->content,
                'last_message_time' => $lastMessage?->created_at,
                'unread_count'      => $unreadCount,
                'email'            => $friend->email,
                'photo'             => $friend->photo_url,
                'last_message'      => $lastMessage?->content,
                'last_message_time' => $lastMessage?->created_at,
                'unread_count'      => $unreadCount,
            ];
        });

        return Inertia::render('Messages/Index', [
            'user' => Auth::user(),
            'friends' => $friends,
        ]);
    }

    public function show(User $user)
    {
        // Mark unread messages as read
        Message::where('sender_id', $user->id)
            ->where('receiver_id', Auth::id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        // Get the conversation
        $messages = Message::with(['sender', 'receiver'])
            ->where(function ($query) use ($user) {
                $query->where('sender_id', Auth::id())
                    ->where('receiver_id', $user->id);
            })
            ->orWhere(function ($query) use ($user) {
                $query->where('sender_id', $user->id)
                    ->where('receiver_id', Auth::id());
            })
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        // Get friends list for sidebar
        $friends = Auth::user()->allFriends()->get()->map(function ($friend) {
            $unreadCount = Message::where('sender_id', $friend->id)
                ->where('receiver_id', Auth::id())
                ->whereNull('read_at')
                ->count();

            return [
                'id'           => $friend->id,
                'name'         => $friend->name,
                'photo'        => $friend->photo_url,
                'unread_count' => $unreadCount,
            ];
        });

        return Inertia::render('Messages/Show', [
            'user'     => Auth::user(),
            'friend'   => $user->only(['id', 'name', 'photo_url']),
            'messages' => $messages,
            'friends'  => $friends,
        ]);
    }

    public function store(Request $request, User $user)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $message = Auth::user()->sentMessages()->create([
            'receiver_id' => $user->id,
            'content'     => $request->content,
        ]);

        // Redirect back to the conversation
        return redirect()->route('messages.show', $user->id);
    }

    public function destroy(Message $message)
    {
        $this->authorize('delete', $message);
        $message->delete();
        return response()->noContent();
    }
}
