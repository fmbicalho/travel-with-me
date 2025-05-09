<?php

namespace App\Http\Controllers;

use App\Models\Travel;
use Inertia\Inertia;

class ExploreController extends Controller
{
    public function index()
    {
        $travels = Travel::where('is_public', true)
            ->with(['creator', 'cities'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Explore/Index', [
            'travels' => $travels
        ]);
    }

    public function show(Travel $travel)
    {
        if (!$travel->is_public) {
            abort(404);
        }

        return Inertia::render('Explore/Show', [
            'travel' => $travel->load(['creator', 'cities.hotels', 'cities.restaurants', 'cities.spots'])
        ]);
    }
}