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
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\UpdateController;

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
    Route::prefix('messages')->group(function () {
        Route::get('/', [MessageController::class, 'index'])->name('messages.index');
        Route::get('/{user}', [MessageController::class, 'show'])->name('messages.show');
        Route::post('/{user}', [MessageController::class, 'store'])->name('messages.store');
    });

    // Explore routes
    Route::prefix('explore')->group(function () {
        Route::get('/', [ExploreController::class, 'index'])->name('explore.index');
        Route::get('/{travel}', [ExploreController::class, 'show'])->name('explore.show');
    });

    // Updates routes
    Route::prefix('updates')->group(function () {
        Route::get('/', [UpdateController::class, 'index'])->name('updates.index');
        Route::post('/{travel}', [UpdateController::class, 'store'])->name('updates.store');
        Route::put('/{update}', [UpdateController::class, 'update'])->name('updates.update');
        Route::delete('/{update}', [UpdateController::class, 'destroy'])->name('updates.destroy');
    });

    Route::get('profile', [UserController::class, 'profile'])->name('profile');
    Route::post('profile/photo', [UserController::class, 'updatePhoto'])->name('profile.updatePhoto');
    Route::post('profile/nickname', [UserController::class, 'updateNickname'])->name('profile.updateNickname');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
