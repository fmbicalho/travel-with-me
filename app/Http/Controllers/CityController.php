<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Travel;
use Illuminate\Http\Request;

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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $city = $travel->cities()->create([
            ...$validated,
            'created_by' => auth()->id()
        ]);

        return response()->json($city, 201);
    }

    public function update(Request $request, City $city)
    {
        $this->authorize('update', $city->travel);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048'
        ]);

        $city->update($validated);
        return response()->json($city);
    }

    public function destroy(City $city)
    {
        $this->authorize('update', $city->travel);
        $city->delete();
        return response()->noContent();
    }
}