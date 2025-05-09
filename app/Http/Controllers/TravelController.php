<?php
namespace App\Http\Controllers;

use App\Models\Travel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TravelController extends Controller
{
    public function index()
    {
        $travels = Auth::user()
            ->travels()
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Travels/Index', [
            'travels' => $travels,
        ]);
    }

    public function create()
    {
        return Inertia::render('Travels/Create');
    }

    public function store(Request $request)
    {
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
    }

    public function show(Travel $travel)
    {
        if (! $this->userCanAccessTravel($travel)) {
            abort(403);
        }

        return Inertia::render('Travels/Show', [
            'travel'  => $travel->load(['users', 'cities.locations']),
            'canEdit' => $this->userCanEditTravel($travel),
        ]);
    }

    public function edit(Travel $travel)
    {
        if (! $this->userCanAccessTravel($travel)) {
            abort(403);
        }

        return Inertia::render('Travels/Edit', [
            'travel'    => $travel,
            'isCreator' => $this->isCreator($travel),
        ]);
    }

    public function update(Request $request, Travel $travel)
    {
        if (! $this->userCanEditTravel($travel)) {
            abort(403);
        }

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
        ]);

        // Handle file upload if present
        if ($request->hasFile('cover_image')) {
            $path                     = $request->file('cover_image')->store('travel-covers', 'public');
            $validated['cover_image'] = $path;
        }

        $travel->update($validated);

        return redirect()
            ->route('travels.show', $travel)
            ->with('success', 'Travel updated successfully!');
    }

    public function destroy(Travel $travel)
    {
        if (! $this->isCreator($travel)) {
            abort(403);
        }

        $travel->delete();

        return redirect()
            ->route('travels.index')
            ->with('success', 'Travel deleted successfully!');
    }

    public function inviteUser(Request $request, Travel $travel)
    {
        if (! $this->userCanEditTravel($travel)) {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        if ($travel->users()->where('user_id', $validated['user_id'])->exists()) {
            return back()->with('error', 'User is already part of this travel');
        }

        $travel->users()->attach($validated['user_id']);

        return back()->with('success', 'User successfully invited to travel');
    }

    public function members(Travel $travel)
    {
        $this->authorize('view', $travel);
        return $travel->users()->withPivot(['status', 'role'])->get();
    }

    public function removeMember(Travel $travel, User $user)
    {
        $this->authorize('manage', $travel);
        if ($travel->creator_id === $user->id) {
            return response()->json(['message' => 'Cannot remove the creator'], 422);
        }
        $travel->users()->detach($user->id);
        return response()->noContent();
    }

    /**
     * Helper method to check if user can access the travel
     */
    protected function userCanAccessTravel(Travel $travel): bool
    {
        return $travel->users->contains(Auth::id());
    }

    /**
     * Helper method to check if user can edit the travel
     * (creator can edit everything, contributors can only add cities/hotels/etc)
     */
    protected function userCanEditTravel(Travel $travel): bool
    {
        return $this->isCreator($travel);
    }

    /**
     * Check if current user is the creator of the travel
     */
    protected function isCreator(Travel $travel): bool
    {
        return $travel->creator_id === Auth::id();
    }
}
