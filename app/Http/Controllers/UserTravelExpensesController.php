<?php

namespace App\Http\Controllers;

use App\Models\UserTravelExpenses;
use Illuminate\Http\Request;

{/**
    This Controller is only to handle the expenses of the user inside a specific travel
    It will be used to add, edit and delete expenses of the user inside a travel
    It will also be used to get the total expenses of the user inside a travel
    It will also be used to get the expenses of the user inside a travel by type
 */}
class UserTravelExpensesController extends Controller{
    public function index(Request $request){
        $travelId = $request->input('travel_id');
        $expenses = UserTravelExpenses::where('travel_id', $travelId)->get();
        return response()->json($expenses);
    }
    
    public function store(Request $request){
        $expense = UserTravelExpenses::create($request->all());
        return response()->json($expense);
    }

    public function update(Request $request, $id){
        $expense = UserTravelExpenses::find($id);
        $expense->update($request->all());
        return response()->json($expense);
    }

    public function destroy($id){
        $expense = UserTravelExpenses::find($id);
        $expense->delete();
        return response()->json(['message' => 'Expense deleted successfully']);
    }

    public function getTotalExpenses($travelId){
        $totalExpenses = UserTravelExpenses::where('travel_id', $travelId)->sum('amount');
        return response()->json($totalExpenses);
    }

    public function getExpensesByType($travelId){
        $expenses = UserTravelExpenses::where('travel_id', $travelId)->groupBy('expense_type')->sum('amount');
        return response()->json($expenses);
    }
    
}
