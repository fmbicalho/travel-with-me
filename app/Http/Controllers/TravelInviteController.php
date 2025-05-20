<?php
namespace App\Http\Controllers;

use App\Models\Travel;
use App\Models\TravelInvite;
use App\Models\TravelUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TravelInviteController extends Controller
{
    public function index(Travel $travel)
    {
        $this->authorize('viewInvites', $travel);

        return Inertia::render('Travels/PendingInvites', [
            'travel'  => $travel,
            'invites' => [
                'sent'     => $travel->invites()->with(['sender', 'travel'])->get(),
                'received' => TravelInvite::where('email', Auth::user()->email)
                    ->where('status', TravelInvite::STATUS_PENDING)
                    ->with(['travel', 'sender'])
                    ->get(),
            ],
        ]);
    }

    public function create(Travel $travel)
    {
        $this->authorize('invite', $travel);

        // Get pending invites for this travel
        $pendingInvites = $travel->invites()
            ->where('status', TravelInvite::STATUS_PENDING)
            ->with('sender')
            ->get();

        // Get current user's friends excluding those already in the travel and those with pending invites
        $friends = Auth::user()->allFriends()
            ->whereNotIn('users.id', function ($query) use ($travel) {
                $query->select('user_id')
                    ->from('travel_user')
                    ->where('travel_id', $travel->id);
            })
            ->whereNotIn('users.email', function ($query) use ($travel) {
                $query->select('email')
                    ->from('travel_invites')
                    ->where('travel_id', $travel->id)
                    ->where('status', TravelInvite::STATUS_PENDING);
            })
            ->get(['id', 'name', 'email', 'photo']);

        return Inertia::render('Travels/InviteFriends', [
            'travel'         => $travel,
            'friends'        => $friends,
            'pendingInvites' => $pendingInvites,
        ]);
    }

    public function store(Request $request, Travel $travel)
    {
        $this->authorize('invite', $travel);

        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $recipient = User::where('email', $request->email)->first();

        // Check if user is already in the travel
        if ($travel->users()->where('user_id', $recipient->id)->exists()) {
            return back()->with('error', 'User is already part of this travel');
        }

        // Check for existing pending invite
        if ($travel->invites()
            ->where('email', $request->email)
            ->where('status', TravelInvite::STATUS_PENDING)
            ->exists()) {
            return back()->with('error', 'An invite has already been sent to this user');
        }

        $invite = $travel->invites()->create([
            'sender_id' => Auth::id(),
            'email'     => $request->email,
            'token'     => Str::random(32),
            'status'    => TravelInvite::STATUS_PENDING,
        ]);

        return back()->with('success', 'Invitation sent successfully');
    }

    public function accept(Request $request, string $token)
    {
        $invite = TravelInvite::where('token', $token)
            ->where('status', TravelInvite::STATUS_PENDING)
            ->firstOrFail();

        if ($invite->email !== Auth::user()->email) {
            abort(403, 'This invitation is not for you');
        }

        $invite->travel->users()->attach(Auth::id(), [
            'status'     => TravelUser::STATUS_ACCEPTED,
            'invited_at' => now(),
        ]);

        $invite->update(['status' => TravelInvite::STATUS_ACCEPTED]);

        return redirect()->route('travels.show', $invite->travel)
            ->with('success', 'You have successfully joined the travel');
    }

    public function decline(Request $request, string $token)
    {
        $invite = TravelInvite::where('token', $token)
            ->where('status', TravelInvite::STATUS_PENDING)
            ->firstOrFail();

        if ($invite->email !== Auth::user()->email) {
            abort(403, 'This invitation is not for you');
        }

        $invite->update(['status' => TravelInvite::STATUS_DECLINED]);

        return back()->with('success', 'Invitation declined successfully');
    }

    public function destroy(TravelInvite $invite)
    {
        $this->authorize('delete', $invite);

        if (! $invite->isPending()) {
            abort(400, 'Only pending invites can be cancelled');
        }

        $invite->delete();

        return back()->with('success', 'Invitation cancelled successfully');
    }

    public function showAllPendingInvites()
    {
        $user = Auth::user();

        $invites = [
            'sent'     => TravelInvite::where('sender_id', $user->id)
                ->with(['travel', 'sender'])
                ->get(),
            'received' => TravelInvite::where('email', $user->email)
                ->where('status', TravelInvite::STATUS_PENDING)
                ->with(['travel', 'sender'])
                ->get(),
        ];

        return Inertia::render('Travels/PendingInvites', [
            'invites' => $invites,
        ]);
    }
}
