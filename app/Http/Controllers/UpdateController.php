<?php

namespace App\Http\Controllers;

use App\Models\Travel;
use App\Models\TravelUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UpdateController extends Controller
{
    public function index(Travel $travel)
    {
        return $travel->updates()
            ->with('creator:id,name')
            ->orderByDesc('created_at')
            ->get();
    }

    public function show(TravelUpdate $update)
    {
        return $update->load('creator:id,name', 'travel:id,title');
    }

    public function store(Request $request, Travel $travel)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $update = $travel->updates()->create([
            'title' => $request->title,
            'description' => $request->description,
            'created_by' => Auth::id()
        ]);

        return response()->json($update->load('creator'), 201);
    }

    public function update(Request $request, TravelUpdate $update)
    {
        $this->authorize('update', $update);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string'
        ]);

        $update->update($request->only(['title', 'description']));

        return response()->json($update->fresh());
    }

    public function destroy(TravelUpdate $update)
    {
        $this->authorize('delete', $update);
        $update->delete();
        return response()->noContent();
    }
}