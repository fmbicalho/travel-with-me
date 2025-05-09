<?php

namespace App\Http\Controllers;

use App\Models\Spot;
use Illuminate\Http\Request;

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

    public function store(Request $request)
    {
        $spot = Spot::create($request->all());
        return response()->json($spot, 201);
    }

    public function update(Request $request, $id)
    {
        $spot = Spot::findOrFail($id);
        $spot->update($request->all());
        return response()->json($spot, 200);
    }

    public function destroy($id)
    {
        Spot::destroy($id);
        return response()->json(null, 204);
    }
}