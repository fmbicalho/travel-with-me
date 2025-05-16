<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\Travel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FriendshipController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        return Inertia::render('Friends/Index', [
            'friends' => $user->friends()
                ->get(),
            'pendingInvites' => $user->receivedFriendInvites()
                ->where('status', 'pending')
                ->with(['sender' => function($query) {
                    $query->select('id', 'name', 'nickname', 'photo');
                }])
                ->get()
        ]);
    }

    public function addFriendToTravel(Request $request, Travel $travel, User $friend)
    {
        if (!$travel->creator_id === Auth::id()) {
            return redirect()->back()
                ->with('error', 'Você não tem permissão para adicionar amigos a esta viagem.');
        }

        // Verificar se já são amigos
        if (!Auth::user()->isFriendsWith($friend)) {
            return redirect()->back()
                ->with('error', 'Você só pode adicionar amigos à viagem.');
        }

        // Verificar se o amigo já está na viagem
        if ($travel->users()->where('user_id', $friend->id)->exists()) {
            return redirect()->back()
                ->with('warning', 'Este amigo já está na viagem.');
        }

        // Adicionar amigo à viagem
        $travel->users()->attach($friend->id);

        return redirect()->back()
            ->with('success', 'Amigo adicionado à viagem com sucesso.');
    }
}