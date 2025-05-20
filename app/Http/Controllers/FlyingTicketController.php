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

    public function store(Request $request){
        $ticket = FlyingTicket::create($request->all());
        return response()->json($ticket);
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