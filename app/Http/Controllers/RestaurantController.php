<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Restaurant;
use App\Models\TravelUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class RestaurantController extends Controller
{
    public function index()
    {
        return Restaurant::all();
    }

    public function show($id)
    {
        return Restaurant::findOrFail($id);
    }

    public function store(Request $request, City $city)
    {
        $this->authorize('update', $city->travel);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'cuisine_type' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'opening_hours' => 'nullable|date_format:H:i',
            'closing_hours' => 'nullable|date_format:H:i',
            'picture' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('picture')) {
            $path = $request->file('picture')->store('restaurant-images', 'public');
            $validated['picture'] = $path;
        }

        $restaurant = $city->restaurants()->create($validated);

        // Create travel update
        TravelUpdate::create([
            'travel_id' => $city->travel_id,
            'created_by' => Auth::id(),
            'title' => 'Added new restaurant',
            'description' => Auth::user()->name . ' added ' . $restaurant->name . ' to ' . $city->name . '.'
        ]);

        return back()->with('success', 'Restaurant added successfully');
    }

    public function update(Request $request, Restaurant $restaurant)
    {
        $this->authorize('update', $restaurant->city->travel);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'cuisine_type' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'opening_hours' => 'nullable|date_format:H:i',
            'closing_hours' => 'nullable|date_format:H:i',
            'picture' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('picture')) {
            // Delete old picture if exists
            if ($restaurant->picture) {
                Storage::disk('public')->delete($restaurant->picture);
            }
            $path = $request->file('picture')->store('restaurant-images', 'public');
            $validated['picture'] = $path;
        }

        $restaurant->update($validated);

        // Create travel update
        TravelUpdate::create([
            'travel_id' => $restaurant->city->travel_id,
            'created_by' => Auth::id(),
            'title' => 'Updated restaurant details',
            'description' => Auth::user()->name . ' updated ' . $restaurant->name . ' details in ' . $restaurant->city->name . '.'
        ]);

        return back()->with('success', 'Restaurant updated successfully');
    }

    public function destroy(Restaurant $restaurant)
    {
        $this->authorize('update', $restaurant->city->travel);

        // Delete picture if exists
        if ($restaurant->picture) {
            Storage::disk('public')->delete($restaurant->picture);
        }

        $restaurantName = $restaurant->name;
        $cityName = $restaurant->city->name;
        $restaurant->delete();

        // Create travel update
        TravelUpdate::create([
            'travel_id' => $restaurant->city->travel_id,
            'created_by' => Auth::id(),
            'title' => 'Removed restaurant',
            'description' => Auth::user()->name . ' removed ' . $restaurantName . ' from ' . $cityName . '.'
        ]);

        return back()->with('success', 'Restaurant removed successfully');
    }
}