<?php

namespace App\Http\Controllers;

use App\Models\HotelReservation;
use Illuminate\Http\Request;

class HotelReservationController extends Controller{
    public function index(Request $request){
        $travelId = $request->input('travel_id');
        $tickets = HotelReservation::where('travel_id', $travelId)->get();
        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'travel_id' => 'required|exists:travels,id',
            'user_id' => 'required|exists:users,id',
            'reservation_number' => 'required|string|max:50',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after_or_equal:check_in_date',
            'hotel_name' => 'required|string|max:100',
            'room_type' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'status' => 'sometimes|string|in:confirmed,pending,cancelled',
        ]);

        $ticket = HotelReservation::create($validated);

        // Return an Inertia response instead of JSON
        return back()->with([
            'message' => 'Hotel reservation added successfully',
            'ticket' => $ticket
        ]);
    }

    public function update(Request $request, $id){
        $ticket = HotelReservation::find($id);
        $ticket->update($request->all());
        return response()->json($ticket);
    }

    public function destroy($id){
        $ticket = HotelReservation::find($id);
        $ticket->delete();
        return response()->json(['message' => 'Reservation deleted successfully']);
    }

    public function getTotalPrice($travelId){
        $totalPrice = HotelReservation::where('travel_id', $travelId)->sum('price');
        return response()->json($totalPrice);
    }

    public function getReservationByStatus($travelId){
        $tickets = HotelReservation::where('travel_id', $travelId)->where('status', '!=', 'cancelled')->get();
        return response()->json($tickets);
    }

    
}