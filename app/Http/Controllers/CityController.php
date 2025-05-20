<?php
namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Travel;
use App\Models\TravelUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CityController extends Controller
{
    public function index(Travel $travel)
    {
        $this->authorize('view', $travel);
        return $travel->cities;
    }

    public function store(Request $request, Travel $travel)
    {
        $this->authorize('update', $travel);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:2048',
            'arrive_date' => 'required|date',
            'depart_date' => 'required|date|after_or_equal:arrive_date',
            'banner'      => 'nullable|string',
        ]);

        // Ensure dates are within travel dates
        if ($validated['arrive_date'] < $travel->start_date ||
            $validated['depart_date'] > $travel->end_date) {
            return back()->with('error', 'City dates must be within the travel dates');
        }

        $city = $travel->cities()->create($validated);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('city-images', 'public');
            $city->update(['image' => $path]);
        }

        return back()->with('success', 'City added successfully');
    }

    public function update(Request $request, City $city)
    {
        $this->authorize('update', $city->travel);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:2048',
            'arrive_date' => 'nullable|date',
            'depart_date' => 'nullable|date|after_or_equal:arrive_date',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($city->image) {
                Storage::disk('public')->delete($city->image);
            }
            $path               = $request->file('image')->store('city-images', 'public');
            $validated['image'] = $path;
        }

        $city->update($validated);

        // Create travel update
        TravelUpdate::create([
            'travel_id'   => $city->travel_id,
            'created_by'  => Auth::id(),
            'title'       => 'Updated city details',
            'description' => Auth::user()->name . ' updated ' . $city->name . ' details.',
        ]);

        return back()->with('success', 'City updated successfully');
    }

    public function destroy(City $city)
    {
        $this->authorize('update', $city->travel);

        // Delete image if exists
        if ($city->image) {
            Storage::disk('public')->delete($city->image);
        }

        $cityName = $city->name;
        $city->delete();

        // Create travel update
        TravelUpdate::create([
            'travel_id'   => $city->travel_id,
            'created_by'  => Auth::id(),
            'title'       => 'Removed city',
            'description' => Auth::user()->name . ' removed ' . $cityName . ' from the travel itinerary.',
        ]);

        return back()->with('success', 'City removed successfully');
    }
}
