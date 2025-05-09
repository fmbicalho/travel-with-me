<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;

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

    public function store(Request $request)
    {
        $restaurant = Restaurant::create($request->all());
        return response()->json($restaurant, 201);
    }

    public function update(Request $request, $id)
    {
        $restaurant = Restaurant::findOrFail($id);
        $restaurant->update($request->all());
        return response()->json($restaurant, 200);
    }

    public function destroy($id)
    {
        Restaurant::destroy($id);
        return response()->json(null, 204);
    }
}