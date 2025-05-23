<?php

namespace App\Http\Controllers;

use App\Models\FlyingTicket;
use Illuminate\Http\Request;

class FlyingTicketController extends Controller{
    public function index(Request $request){
        $travelId = $request->input('travel_id');
        $tickets = FlyingTicket::where('travel_id', $travelId)->get();
        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'travel_id' => 'required|exists:travels,id',
            'user_id' => 'required|exists:users,id',
            'ticket_number' => 'required|string|max:50',
            'departure_date' => 'required|date',
            'arrival_date' => 'required|date|after_or_equal:departure_date',
            'departure_airport' => 'required|string|max:100',
            'arrival_airport' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'status' => 'sometimes|string|in:confirmed,pending,cancelled',
        ]);

        $ticket = FlyingTicket::create($validated);

        // Return an Inertia response instead of JSON
        return back()->with([
            'message' => 'Flight ticket added successfully',
            'ticket' => $ticket
        ]);
    }

    public function update(Request $request, $id){
        $ticket = FlyingTicket::find($id);
        $ticket->update($request->all());
        return response()->json($ticket);
    }

    public function destroy($id){
        $ticket = FlyingTicket::find($id);
        $ticket->delete();
        return response()->json(['message' => 'Ticket deleted successfully']);
    }

    public function getTotalPrice($travelId){
        $totalPrice = FlyingTicket::where('travel_id', $travelId)->sum('price');
        return response()->json($totalPrice);
    }

    public function getTicketByStatus($travelId){
        $tickets = FlyingTicket::where('travel_id', $travelId)->where('status', '!=', 'cancelled')->get();
        return response()->json($tickets);
    }

    
}