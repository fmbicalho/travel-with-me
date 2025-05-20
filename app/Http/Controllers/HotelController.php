<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Hotel;
use App\Models\TravelUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class HotelController extends Controller
{
    public function index()
    {
        return Hotel::all();
    }

    public function show($id)
    {
        return Hotel::findOrFail($id);
    }

    public function store(Request $request, City $city)
    {
        $this->authorize('update', $city->travel);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'price_range' => 'nullable|numeric|min:0',
            'star_rating' => 'nullable|integer|min:1|max:5',
            'picture' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('hotel-images', 'public');
            $validated['picture'] = $path;
        }

        $hotel = $city->hotels()->create($validated);

        // Create travel update
        TravelUpdate::create([
            'travel_id' => $city->travel_id,
            'created_by' => Auth::id(),
            'title' => 'Added new hotel',
            'description' => Auth::user()->name . ' added ' . $hotel->name . ' to ' . $city->name . '.'
        ]);

        return back()->with('success', 'Hotel added successfully');
    }

    public function update(Request $request, Hotel $hotel)
    {
        $this->authorize('update', $hotel->city->travel);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'price_range' => 'nullable|numeric|min:0',
            'star_rating' => 'nullable|integer|min:1|max:5',
            'picture' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('picture')) {
            // Delete old picture if exists
            if ($hotel->picture) {
                Storage::disk('public')->delete($hotel->picture);
            }
            $path = $request->file('picture')->store('hotel-images', 'public');
            $validated['picture'] = $path;
        }

        $hotel->update($validated);

        // Create travel update
        TravelUpdate::create([
            'travel_id' => $hotel->city->travel_id,
            'created_by' => Auth::id(),
            'title' => 'Updated hotel details',
            'description' => Auth::user()->name . ' updated ' . $hotel->name . ' details in ' . $hotel->city->name . '.'
        ]);

        return back()->with('success', 'Hotel updated successfully');
    }

    public function destroy(Hotel $hotel)
    {
        $this->authorize('update', $hotel->city->travel);

        // Delete picture if exists
        if ($hotel->picture) {
            Storage::disk('public')->delete($hotel->picture);
        }

        $hotelName = $hotel->name;
        $cityName = $hotel->city->name;
        $hotel->delete();

        // Create travel update
        TravelUpdate::create([
            'travel_id' => $hotel->city->travel_id,
            'created_by' => Auth::id(),
            'title' => 'Removed hotel',
            'description' => Auth::user()->name . ' removed ' . $hotelName . ' from ' . $cityName . '.'
        ]);

        return back()->with('success', 'Hotel removed successfully');
    }
}