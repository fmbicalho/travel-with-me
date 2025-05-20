<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Spot;
use App\Models\TravelUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class SpotController extends Controller
{
    public function index()
    {
        return Spot::all();
    }

    public function show($id)
    {
        return Spot::findOrFail($id);
    }

    public function store(Request $request, City $city)
    {
        $this->authorize('update', $city->travel);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'description' => 'nullable|string',
            'entrance_fee' => 'nullable|numeric|min:0',
            'opening_hours' => 'nullable|date_format:H:i',
            'closing_hours' => 'nullable|date_format:H:i',
            'type' => 'nullable|string|max:255',
            'picture' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('spot-images', 'public');
            $validated['picture'] = $path;
        }

        $spot = $city->spots()->create($validated);

        // Create travel update
        TravelUpdate::create([
            'travel_id' => $city->travel_id,
            'created_by' => Auth::id(),
            'title' => 'Added new spot',
            'description' => Auth::user()->name . ' added ' . $spot->name . ' to ' . $city->name . '.'
        ]);

        return back()->with('success', 'Spot added successfully');
    }

    public function update(Request $request, Spot $spot)
    {
        $this->authorize('update', $spot->city->travel);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'description' => 'nullable|string',
            'entrance_fee' => 'nullable|numeric|min:0',
            'opening_hours' => 'nullable|date_format:H:i',
            'closing_hours' => 'nullable|date_format:H:i',
            'type' => 'nullable|string|max:255',
            'picture' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('picture')) {
            // Delete old picture if exists
            if ($spot->picture) {
                Storage::disk('public')->delete($spot->picture);
            }
            $path = $request->file('picture')->store('spot-images', 'public');
            $validated['picture'] = $path;
        }

        $spot->update($validated);

        // Create travel update
        TravelUpdate::create([
            'travel_id' => $spot->city->travel_id,
            'created_by' => Auth::id(),
            'title' => 'Updated spot details',
            'description' => Auth::user()->name . ' updated ' . $spot->name . ' details in ' . $spot->city->name . '.'
        ]);

        return back()->with('success', 'Spot updated successfully');
    }

    public function destroy(Spot $spot)
    {
        $this->authorize('update', $spot->city->travel);

        // Delete picture if exists
        if ($spot->picture) {
            Storage::disk('public')->delete($spot->picture);
        }

        $spotName = $spot->name;
        $cityName = $spot->city->name;
        $spot->delete();

        // Create travel update
        TravelUpdate::create([
            'travel_id' => $spot->city->travel_id,
            'created_by' => Auth::id(),
            'title' => 'Removed spot',
            'description' => Auth::user()->name . ' removed ' . $spotName . ' from ' . $cityName . '.'
        ]);

        return back()->with('success', 'Spot removed successfully');
    }
}