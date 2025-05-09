<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TravelController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\FriendInviteController;
use App\Http\Controllers\MessageController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    // Travels routes
    Route::prefix('travels')->group(function () {
        Route::get('/', [TravelController::class, 'index'])->name('travels.index');
        Route::get('/create', [TravelController::class, 'create'])->name('travels.create');
        Route::post('/', [TravelController::class, 'store'])->name('travels.store');
        Route::get('/{travel}', [TravelController::class, 'show'])->name('travels.show');
        Route::get('/{travel}/edit', [TravelController::class, 'edit'])->name('travels.edit');
        Route::put('/{travel}', [TravelController::class, 'update'])->name('travels.update');
        Route::delete('/{travel}', [TravelController::class, 'destroy'])->name('travels.destroy');
    });

    // Friend routes
    Route::prefix('friends')->group(function () {
        Route::get('/', [FriendshipController::class, 'index'])->name('friends.index');
        Route::post('/{travelId}/add/{friendId}', [FriendshipController::class, 'addFriendToTravel'])->name('friends.add-to-travel');
        Route::get('/invite', [FriendInviteController::class, 'showInviteForm'])->name('friends.invite');
        Route::get('/search', [FriendInviteController::class, 'search']);
        Route::post('/friend-invite/send/{receiverId}', [FriendInviteController::class, 'sendInvite'])->name('friend-invite.send');
        Route::post('/friend-invite/accept/{inviteId}', [FriendInviteController::class, 'acceptInvite'])->name('friend-invite.accept');
        Route::post('/friend-invite/reject/{inviteId}', [FriendInviteController::class, 'rejectInvite'])->name('friend-invite.reject');
    });

    // Chat routes
    Route::prefix('chat')->group(function () {
        Route::get('/', [MessageController::class, 'index'])->name('messages.index');
    });

    // Explore routes
    Route::get('explore', function () {
        return Inertia::render('explore');
    })->name('explore');

    //Update routes
    Route::get('updates', function () {
        return Inertia::render('updates');
    })->name('updates.index');


    Route::get('profile', [UserController::class, 'profile'])->name('profile');
    Route::post('profile/photo', [UserController::class, 'updatePhoto'])->name('profile.updatePhoto');
    Route::post('profile/nickname', [UserController::class, 'updateNickname'])->name('profile.updateNickname');

    

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
