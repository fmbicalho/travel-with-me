<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\Travel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FriendshipController extends Controller
{
    // Display all friends
    public function index()
{
    // Get friends
    $friends = Auth::user()->friends;

    // Get pending invites (sent by others to this user)
    $pendingInvites = Auth::user()->receivedFriendInvites()
        ->where('status', 'pending') // Filter pending invites
        ->with('sender') // Eager load the sender user
        ->get();

    return Inertia::render('Friends/Index', [
        'friends' => $friends,
        'pendingInvites' => $pendingInvites,
    ]);
}


    // Add a friend to a travel
    public function addFriendToTravel($travelId, $friendId)
    {
        $friendship = Friendship::where('user_id', Auth::id())->where('friend_id', $friendId)->first();

        if ($friendship) {
            $travel = Travel::findOrFail($travelId);
            $travel->users()->attach($friendId);

            return redirect()->route('travels.show', $travelId)->with('success', 'Friend added to travel.');
        }

        return redirect()->route('travels.show', $travelId)->with('error', 'You are not friends with this user.');
    }
}
