<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('id', '!=', Auth::id())->get([
            'id', 'name', 'nickname', 'email', 'photo', 'role',
        ]);
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::select('id', 'name', 'nickname', 'email', 'photo', 'role')
            ->findOrFail($id);
        return response()->json($user);
    }

    public function profile()
    {
        return Inertia::render('Profile', [
            'user' => Auth::user(),
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048',
        ]);

        $path = $request->file('photo')->store('photos', 'public');

        $user        = auth()->user();
        $user->photo = 'storage/' . $path;
        $user->save();

        return back();
    }

    public function updateNickname(Request $request)
    {
        $request->validate([
            'nickname' => 'required|string|max:20|unique:users,nickname,' . Auth::id(),
        ]);

        $user           = Auth::user();
        $user->nickname = $request->nickname;
        $user->save();

        return back()->with('message', 'Nickname atualizado com sucesso.');
    }

}
