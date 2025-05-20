<?php
namespace App\Http\Controllers;

use App\Models\FriendInvite;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FriendInviteController extends Controller
{
    public function showInviteForm()
    {
        $users = User::where('id', '!=', auth()->id())->get();
        return Inertia::render('Friends/Invite', [
            'users' => $users,
            'user'  => auth()->user()->only(['id', 'name', 'email']),
        ]);

    }

    public function search(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->query('email');

        // Case-insensitive search for MySQL
        $foundUser = User::whereRaw('LOWER(email) = ?', [strtolower($email)])->first();

        return Inertia::render('Friends/Invite', [
            'user'                => auth()->user()->only(['id', 'name', 'email']),
            'foundUser'           => $foundUser ? $foundUser->only(['id', 'name', 'email']) : null,
            'existingFriendships' => auth()->user()->friends()->pluck('id')->toArray(),
        ]);
    }

    // Send a friend invite
    public function sendInvite($receiverId)
    {
        $receiver = User::findOrFail($receiverId);

        // Prevent self-invite
        if (Auth::id() == $receiverId) {
            return redirect()->route('friends.index')->with('error', 'You cannot send a friend invite to yourself.');
        }

        // Check for existing invite or friendship
        if (FriendInvite::where([
            'sender_id'   => Auth::id(),
            'receiver_id' => $receiverId,
        ])->exists() || Auth::user()->isFriendsWith($receiver)) {
            return redirect()->route('friends.index')->with('error', 'Friend invite already exists or you are already friends.');
        }

        // Create invite
        FriendInvite::create([
            'sender_id'   => Auth::id(),
            'receiver_id' => $receiverId,
            'status'      => 'pending',
        ]);

        return redirect()->route('friends.index')->with('success', 'Friend invite sent successfully!');
    }

    // Accept a friend invite
    public function acceptInvite($inviteId)
    {
        $invite = FriendInvite::findOrFail($inviteId);

        // Check if the logged-in user is the receiver of the invite
        if ($invite->receiver_id != Auth::id()) {
            return redirect()->back()->with('error', 'You are not authorized to accept this invite.');
        }

        // Create the friendship
        Friendship::create([
            'user_id'   => Auth::id(),
            'friend_id' => $invite->sender_id,
        ]);
        Friendship::create([
            'user_id'   => $invite->sender_id,
            'friend_id' => Auth::id(),
        ]);

        // Update the invite status
        $invite->update(['status' => 'accepted']);

        // Return success with Inertia
        return redirect()->back()->with('success', 'Friend request accepted.');
    }

    // Reject a friend invite
    public function rejectInvite($inviteId)
    {
        $invite = FriendInvite::findOrFail($inviteId);

        // Check if the logged-in user is the receiver of the invite
        if ($invite->receiver_id != Auth::id()) {
            return redirect()->back()->with('error', 'You are not authorized to reject this invite.');
        }

        // Update the invite status
        $invite->update(['status' => 'rejected']);

        return redirect()->back()->with('success', 'Friend invite rejected.');
    }
}
