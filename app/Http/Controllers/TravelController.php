<?php
namespace App\Http\Controllers;

use App\Models\Travel;
use App\Models\TravelInvite;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TravelController extends Controller
{
    use ApiResponse, AuthorizesRequests, ValidatesRequests;

    public function __construct()
    {

    }

    public function index()
    {
        $user = Auth::user();

        $travels = $user->travels()
            ->with('creator')
            ->orderBy('created_at', 'desc')
            ->get();

        $pendingInvites = TravelInvite::where('email', $user->email)
            ->where('status', TravelInvite::STATUS_PENDING)
            ->with(['travel', 'sender'])
            ->get();

        return Inertia::render('Travels/Index', [
            'travels'        => $travels,
            'pendingInvites' => $pendingInvites,
        ]);
    }

    public function create()
    {
        return Inertia::render('Travels/Create');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title'       => 'required|string|max:255',
                'destination' => 'required|string|max:255',
                'start_date'  => 'required|date',
                'end_date'    => 'required|date|after_or_equal:start_date',
                'description' => 'nullable|string',
            ]);

            $travel = Auth::user()->travels()->create([
                 ...$validated,
                'creator_id' => Auth::id(),
            ]);

            $travel->users()->syncWithoutDetaching([Auth::id()]);

            return redirect()
                ->route('travels.index')
                ->with('success', 'Travel created successfully!');
        } catch (\Exception $e) {
            return $this->error('Failed to create travel: ' . $e->getMessage());
        }
    }

    public function show(Travel $travel)
    {
        $travel->load('users');

        $this->authorize('view', $travel);

        $travel->load([
            'users'   => function ($query) {
                $query->select('id', 'name', 'email', 'photo');
            },
            'invites' => function ($query) {
                $query->with(['sender', 'travel']);
            },
            'cities'  => function ($query) {
                $query->orderBy('arrive_date', 'asc');
            },
        ]);

        $friends = Auth::user()->friends()->select('users.id', 'name', 'email', 'photo')->get();

        $travelData = [
            'id'          => $travel->id,
            'title'       => $travel->title,
            'destination' => $travel->destination,
            'start_date'  => $travel->start_date,
            'end_date'    => $travel->end_date,
            'description' => $travel->description,
            'creator_id'  => $travel->creator_id,
            'cover_image' => $travel->cover_image
            ? asset($travel->cover_image)
            : null,
            'users'       => $travel->users->map(function ($user) {
                return [
                    'id'    => $user->id,
                    'name'  => $user->name,
                    'email' => $user->email,
                    'photo' => $user->photo_url,
                ];
            }),
            'invites'     => [
                'sent'     => $travel->invites->where('sender_id', Auth::id())->map(function ($invite) {
                    return [
                        'id'         => $invite->id,
                        'email'      => $invite->email,
                        'status'     => $invite->status,
                        'created_at' => $invite->created_at,
                        'sender'     => [
                            'id'    => $invite->sender->id,
                            'name'  => $invite->sender->name,
                            'email' => $invite->sender->email,
                            'photo' => $invite->sender->photo_url,
                        ],
                    ];
                }),
                'received' => $travel->invites->where('email', Auth::user()->email)->map(function ($invite) {
                    return [
                        'id'         => $invite->id,
                        'email'      => $invite->email,
                        'status'     => $invite->status,
                        'created_at' => $invite->created_at,
                        'sender'     => [
                            'id'    => $invite->sender->id,
                            'name'  => $invite->sender->name,
                            'email' => $invite->sender->email,
                            'photo' => $invite->sender->photo_url,
                        ],
                    ];
                }),
            ],
            'cities'      => $travel->cities->map(function ($city) {
                return [
                    'id'          => $city->id,
                    'name'        => $city->name,
                    'description' => $city->description,
                    'arrive_date' => $city->arrive_date,
                    'depart_date' => $city->depart_date,
                    'image'       => $city->image ? asset($city->image) : null,
                    'hotels'      => $city->hotels,
                    'restaurants' => $city->restaurants,
                    'spots'       => $city->spots,
                ];
            }),
        ];

        return Inertia::render('Travels/Show', [
            'travel'  => $travelData,
            'canEdit' => auth()->user()->can('update', $travel),
            'friends' => $friends->map(function ($friend) {
                return [
                    'id'    => $friend->id,
                    'name'  => $friend->name,
                    'email' => $friend->email,
                    'photo' => $friend->photo_url,
                ];
            }),
        ]);
    }

    public function edit(Travel $travel)
    {
        $this->authorize('update', $travel);

        $travel->load([
            'cities' => function ($query) {
                $query->orderBy('arrive_date', 'asc')
                    ->with(['hotels', 'restaurants', 'spots']);
            },
            'users',
        ]);

        return Inertia::render('Travels/Edit', [
            'travel'    => $travel,
            'isCreator' => $travel->creator_id === Auth::id(),
        ]);
    }

    public function update(Request $request, Travel $travel)
    {
        try {
            $validated = $request->validate([
                'title'       => 'required|string|max:255',
                'destination' => 'required|string|max:255',
                'start_date'  => 'required|date',
                'end_date'    => 'required|date|after_or_equal:start_date',
                'description' => 'nullable|string',
                'cover_image' => 'nullable|image|max:2048',
            ]);

            if ($request->hasFile('cover_image')) {
                $path                     = $request->file('cover_image')->store('travel-covers', 'public');
                $validated['cover_image'] = $path;
            }

            $travel->update($validated);

            return redirect()
                ->route('travels.show', $travel)
                ->with('success', 'Travel updated successfully!');
        } catch (\Exception $e) {
            return $this->error('Failed to update travel: ' . $e->getMessage());
        }
    }

    public function destroy(Travel $travel)
    {
        try {
            $travel->delete();

            return redirect()
                ->route('travels.index')
                ->with('success', 'Travel deleted successfully!');
        } catch (\Exception $e) {
            return $this->error('Failed to delete travel: ' . $e->getMessage());
        }
    }

    public function inviteUser(Request $request, Travel $travel)
    {
        try {
            $this->authorize('manage', $travel);

            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
            ]);

            if ($travel->users()->where('user_id', $validated['user_id'])->exists()) {
                return $this->error('User is already part of this travel', 422);
            }

            $travel->users()->attach($validated['user_id']);

            return $this->success(null, 'User successfully invited to travel');
        } catch (\Exception $e) {
            return $this->error('Failed to invite user: ' . $e->getMessage());
        }
    }

    public function members(Travel $travel)
    {
        try {
            $this->authorize('view', $travel);
            return $this->success(
                $travel->users()->withPivot(['status', 'role'])->get()
            );
        } catch (\Exception $e) {
            return $this->error('Failed to fetch members: ' . $e->getMessage());
        }
    }

    public function removeMember(Travel $travel, User $user)
    {
        try {
            $this->authorize('manage', $travel);

            if ($travel->creator_id === $user->id) {
                return $this->error('Cannot remove the creator', 422);
            }

            $travel->users()->detach($user->id);
            return $this->success(null, 'Member removed successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to remove member: ' . $e->getMessage());
        }
    }

    public function showInviteForm(Travel $travel)
    {
        // Load necessary relationships
        $travel->load(['users']);

        $this->authorize('invite', $travel);

        // Debug current user
        \Log::info('Current user:', [
            'user_id'    => Auth::id(),
            'user_email' => Auth::user()->email,
        ]);

        // Get current travel users for debugging
        $travelUsers = $travel->users;
        \Log::info('Travel users:', [
            'travel_id' => $travel->id,
            'users'     => $travelUsers->map(fn($u) => ['id' => $u->id, 'email' => $u->email])->all(),
        ]);

        // First get ALL friends without any filtering
        $allFriends = Auth::user()->friends()->get();
        \Log::info('All friends before filtering:', [
            'count'   => $allFriends->count(),
            'friends' => $allFriends->map(fn($f) => ['id' => $f->id, 'email' => $f->email])->all(),
        ]);

        // Now get friends not in travel
        $availableFriends = Auth::user()
            ->friends()
            ->whereNotIn('users.id', $travelUsers->pluck('id'))
            ->get();

        \Log::info('Available friends after travel filter:', [
            'count'   => $availableFriends->count(),
            'friends' => $availableFriends->map(fn($f) => ['id' => $f->id, 'email' => $f->email])->all(),
        ]);

        // Also check friendOf relationship
        $friendOf = Auth::user()->friendOf()->get();
        \Log::info('FriendOf relationship:', [
            'count'   => $friendOf->count(),
            'friends' => $friendOf->map(fn($f) => ['id' => $f->id, 'email' => $f->email])->all(),
        ]);

        // For now, let's combine both relationships to see all possible friends
        $allPossibleFriends = $allFriends->merge($friendOf)
            ->unique('id')
            ->values();

        \Log::info('All possible friends:', [
            'count'   => $allPossibleFriends->count(),
            'friends' => $allPossibleFriends->map(fn($f) => ['id' => $f->id, 'email' => $f->email])->all(),
        ]);

        // Format friends for the view
        $formattedFriends = $allPossibleFriends
            ->filter(fn($friend) => ! $travelUsers->contains('id', $friend->id))
            ->map(function ($friend) {
                return [
                    'id'    => $friend->id,
                    'name'  => $friend->name,
                    'email' => $friend->email,
                    'photo' => $friend->photo_url ?? null,
                ];
            });

        return Inertia::render('Travels/InviteFriends', [
            'travel'  => $travel,
            'friends' => $formattedFriends,
        ]);
    }

    public function showPendingInvites(Travel $travel)
    {
        // Load necessary relationships
        $travel->load(['users', 'invites.sender', 'invites.recipient']);

        $this->authorize('viewInvites', $travel);

        $invites = [
            'sent'     => $travel->invites()
                ->with(['sender', 'recipient'])
                ->get(),
            'received' => TravelInvite::where('email', Auth::user()->email)
                ->where('status', TravelInvite::STATUS_PENDING)
                ->with(['travel', 'sender'])
                ->get(),
        ];

        return Inertia::render('Travels/PendingInvites', [
            'travel'  => $travel,
            'invites' => $invites,
        ]);
    }

    public function cities(Travel $travel)
    {
        $this->authorize('view', $travel);

        return $travel->cities()
            ->orderBy('arrive_date', 'asc')
            ->get();
    }
}
