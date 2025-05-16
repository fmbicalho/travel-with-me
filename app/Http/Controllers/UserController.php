<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::excludeCurrent()
            ->select('id', 'name', 'nickname', 'email', 'photo', 'role', 'created_at')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id'         => $user->id,
                    'name'       => $user->name,
                    'nickname'   => $user->nickname,
                    'email'      => $user->email,
                    'photo'      => $user->photo_url,
                    'role'       => $user->role,
                    'created_at' => $user->created_at,
                ];
            });

        return response()->json([
            'data'  => $users,
            'count' => $users->count(),
        ]);
    }

    public function show(User $user)
    {
        return response()->json([
            'data' => [
                'id'       => $user->id,
                'name'     => $user->name,
                'nickname' => $user->nickname,
                'email'    => $user->email,
                'photo'    => $user->photo_url,
                'role'     => $user->role,
            ],
        ]);
    }

    public function profile()
    {
        $user = Auth::user()->loadCount(['friends', 'travels']);

        return Inertia::render('Profile', [
            'user' => [
                 ...$user->toArray(),
                'photo' => $user->photo_url,
            ],
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $validated = $request->validate([
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        try {
            if (Auth::user()->photo) {
                $oldPhotoPath = ltrim(Auth::user()->photo, 'storage/');
                Storage::disk('public')->delete($oldPhotoPath);
            }

            $path = $request->file('photo')->store('photos', 'public');

            Auth::user()->update([
                'photo' => $path,
            ]);

            return back()->with('success', 'Photo updated successfully!');

        } catch (\Exception $e) {
            return back()->with('error', 'Error updating photo: ' . $e->getMessage());
        }
    }

    public function updateNickname(Request $request)
    {
        $validated = $request->validate([
            'nickname' => [
                'required',
                'string',
                'max:20',
                'unique:users,nickname,' . Auth::id(),
                'regex:/^[a-zA-Z0-9_\-]+$/',
            ],
        ]);

        Auth::user()->update($validated);

        return back()->with('success', 'Nickname atualizado com sucesso.');
    }
}
