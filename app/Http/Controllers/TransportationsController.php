<?php

namespace App\Http\Controllers;

use App\Models\Transportations;
use Illuminate\Http\Request;

class TransportationsController extends Controller{
    public function index(Request $request){
        $travelId = $request->input('travel_id');
        $tickets = Transportations::where('travel_id', $travelId)->get();
        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'travel_id' => 'required|exists:travels,id',
            'user_id' => 'required|exists:users,id',
            'transportation_type' => 'required|string|max:100',
            'departure_date' => 'required|date',
            'arrival_date' => 'required|date|after_or_equal:departure_date',
            'departure_time' => 'required|date_format:H:i',
            'arrival_time' => 'required|date_format:H:i',
            'departure_location' => 'required|string|max:100',
            'arrival_location' => 'required|string|max:100',
            'comments' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'status' => 'sometimes|string|in:confirmed,pending,cancelled',
        ]);

            $ticket = Transportations::create($validated);

        return back()->with([
            'message' => 'Transportation added successfully',
            'ticket' => $ticket
        ]);
    }

    public function update(Request $request, $id){
        $ticket = Transportations::find($id);
        $ticket->update($request->all());
        return response()->json($ticket);
    }

    public function destroy($id){
        $ticket = Transportations::find($id);
        $ticket->delete();
        return response()->json(['message' => 'Reservation deleted successfully']);
    }

    public function getTotalPrice($travelId){
        $totalPrice = Transportations::where('travel_id', $travelId)->sum('price');
        return response()->json($totalPrice);
    }

    public function getReservationByStatus($travelId){
        $tickets = Transportations::where('travel_id', $travelId)->where('status', '!=', 'cancelled')->get();
        return response()->json($tickets);
    }

    public function getTotalPriceByType($travelId, $type){
        $totalPrice = Transportations::where('travel_id', $travelId)->where('transportation_type', $type)->sum('price');
        return response()->json($totalPrice);
    }
}

