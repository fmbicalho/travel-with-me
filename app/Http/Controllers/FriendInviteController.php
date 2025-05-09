<?php
namespace App\Http\Controllers;

use App\Models\FriendInvite;
use App\Models\Friendship;
use App\Models\User;
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
        $email = $request->query('email');

        $user = User::where('email', $email)->first();

        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    // Send a friend invite
    public function sendInvite($receiverId)
    {
        $receiver = User::findOrFail($receiverId);

        // Check if the user is trying to send a request to themselves
        if (Auth::id() == $receiverId) {
            return redirect()->back()->with('error', 'You cannot send a friend invite to yourself.');
        }

        // Check if an invite already exists or if they are already friends
        if (FriendInvite::where('sender_id', Auth::id())->where('receiver_id', $receiverId)->exists() || Auth::user()->isFriendsWith($receiver)) {
            return redirect()->back()->with('error', 'Friend invite already exists or you are already friends.');
        }

        // Create a new invite
        FriendInvite::create([
            'sender_id'   => Auth::id(),
            'receiver_id' => $receiverId,
        ]);

        return redirect()->back()->with('success', 'Friend invite sent.');
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
