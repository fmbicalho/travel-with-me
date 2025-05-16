<?php
namespace App\Http\Controllers;

use App\Models\Travel;
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
        $this->authorizeResource(Travel::class, 'travel');
    }

    public function index()
    {
        try {
            $travels = Auth::user()
                ->travels()
                ->orderBy('created_at', 'desc')
                ->get();

            return Inertia::render('Travels/Index', [
                'travels' => $travels,
            ]);
        } catch (\Exception $e) {
            return $this->error('Failed to fetch travels: ' . $e->getMessage());
        }
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

        $travel->load(['users' => function ($query) {
            $query->select('id', 'name', 'email', 'photo');
        }]);

        \Log::debug('Travel Show Data:', [
            'cover_image' => $travel->cover_image,
            'users' => $travel->users->map(function($user) {
                return [
                    'id' => $user->id,
                    'photo' => $user->photo,
                ];
            })
        ]);

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
        ];

        return Inertia::render('Travels/Show', [
            'travel'  => $travelData,
            'canEdit' => auth()->user()->can('update', $travel),
        ]);
    }

    public function edit(Travel $travel)
    {
        try {
            return Inertia::render('Travels/Edit', [
                'travel'    => $travel,
                'isCreator' => $travel->creator_id === Auth::id(),
            ]);
        } catch (\Exception $e) {
            return $this->error('Failed to load travel for editing: ' . $e->getMessage());
        }
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
}
