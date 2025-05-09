<?php

namespace App\Http\Controllers;

use App\Models\Travel;
use App\Models\TravelInvite;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TravelInviteController extends Controller
{
    public function index(Travel $travel)
    {
        $this->authorize('manage', $travel);
        
        return $travel->invites()->with('sender')->get();
    }

    public function store(Request $request, Travel $travel)
    {
        $this->authorize('manage', $travel);

        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = User::where('email', $request->email)->first();

        if ($travel->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'User is already part of this travel'], 422);
        }

        $invite = $travel->invites()->create([
            'sender_id' => Auth::id(),
            'email' => $request->email,
            'token' => \Str::random(32)
        ]);

        return response()->json($invite, 201);
    }

    public function accept(Request $request, string $token)
    {
        $invite = TravelInvite::where('token', $token)->firstOrFail();

        if ($invite->email !== Auth::user()->email) {
            abort(403);
        }

        $invite->travel->users()->attach(Auth::id());
        $invite->delete();

        return redirect()->route('travels.show', $invite->travel)
            ->with('success', 'You have joined the travel!');
    }

    public function destroy(TravelInvite $invite)
    {
        $this->authorize('delete', $invite);
        $invite->delete();
        return response()->noContent();
    }
}