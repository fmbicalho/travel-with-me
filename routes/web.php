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
use App\Http\Controllers\TravelInviteController;
use App\Http\Controllers\FlyingTicketController;
use App\Http\Controllers\HotelReservationController;
use App\Http\Controllers\TransportationsController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\RestaurantController;

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
        Route::get('/pending-invites', [TravelInviteController::class, 'showAllPendingInvites'])->name('travels.pending-invites');
        Route::get('/{travel}', [TravelController::class, 'show'])->name('travels.show');
        Route::get('/{travel}/edit', [TravelController::class, 'edit'])->name('travels.edit');
        Route::put('/{travel}', [TravelController::class, 'update'])->name('travels.update');
        Route::delete('/{travel}', [TravelController::class, 'destroy'])->name('travels.destroy');

        // City routes
        Route::post('/{travel}/cities', [CityController::class, 'store'])->name('travels.cities.store');
        Route::put('/cities/{city}', [CityController::class, 'update'])->name('cities.update');
        Route::delete('/cities/{city}', [CityController::class, 'destroy'])->name('cities.destroy');

        // Hotel routes
        Route::post('/cities/{city}/hotels', [HotelController::class, 'store'])->name('cities.hotels.store');
        Route::put('/hotels/{hotel}', [HotelController::class, 'update'])->name('hotels.update');
        Route::delete('/hotels/{hotel}', [HotelController::class, 'destroy'])->name('hotels.destroy');

        // Restaurant routes
        Route::post('/cities/{city}/restaurants', [RestaurantController::class, 'store'])->name('cities.restaurants.store');
        Route::put('/restaurants/{restaurant}', [RestaurantController::class, 'update'])->name('restaurants.update');
        Route::delete('/restaurants/{restaurant}', [RestaurantController::class, 'destroy'])->name('restaurants.destroy');

        // Spot routes
        Route::post('/cities/{city}/spots', [SpotController::class, 'store'])->name('cities.spots.store');
        Route::put('/spots/{spot}', [SpotController::class, 'update'])->name('spots.update');
        Route::delete('/spots/{spot}', [SpotController::class, 'destroy'])->name('spots.destroy');

        // Travel invite routes
        Route::get('/{travel}/invite', [TravelInviteController::class, 'create'])->name('travels.invite');
        Route::get('/{travel}/invites', [TravelInviteController::class, 'index'])->name('travels.invites');
        Route::post('/{travel}/invites', [TravelInviteController::class, 'store'])->name('travels.invites.store');
        Route::post('/invites/{token}/accept', [TravelInviteController::class, 'accept'])->name('travels.invites.accept');
        Route::post('/invites/{token}/decline', [TravelInviteController::class, 'decline'])->name('travels.invites.decline');
        Route::delete('/invites/{invite}', [TravelInviteController::class, 'destroy'])->name('travels.invites.destroy');

        // Updates routes
        Route::get('/updates', [TravelController::class, 'index'])->name('travels.updates.index');

        
    });

    // Flying Ticket routes
    Route::prefix('flying-tickets')->group(function () {
        Route::get('/', [FlyingTicketController::class, 'index'])->name('flying-tickets.index');
        Route::post('/', [FlyingTicketController::class, 'store'])->name('flying-tickets.store');
        Route::put('/{flyingTicket}', [FlyingTicketController::class, 'update'])->name('flying-tickets.update');
        Route::delete('/{flyingTicket}', [FlyingTicketController::class, 'destroy'])->name('flying-tickets.destroy');
        Route::get('/total-price/{travelId}', [FlyingTicketController::class, 'getTotalPrice'])->name('flying-tickets.total-price');
        Route::get('/by-status/{travelId}', [FlyingTicketController::class, 'getTicketByStatus'])->name('flying-tickets.by-status');
    });

    // Hotel Reservation routes
    Route::prefix('hotel-reservations')->group(function () {
        Route::get('/', [HotelReservationController::class, 'index'])->name('hotel-reservations.index');
        Route::post('/', [HotelReservationController::class, 'store'])->name('hotel-reservations.store');
        Route::put('/{hotelReservation}', [HotelReservationController::class, 'update'])->name('hotel-reservations.update');
        Route::delete('/{hotelReservation}', [HotelReservationController::class, 'destroy'])->name('hotel-reservations.destroy');
        Route::get('/total-price/{travelId}', [HotelReservationController::class, 'getTotalPrice'])->name('hotel-reservations.total-price');
        Route::get('/by-status/{travelId}', [HotelReservationController::class, 'getReservationByStatus'])->name('hotel-reservations.by-status');
    });

    // Transportations routes
    Route::prefix('transportations')->group(function () {
        Route::get('/', [TransportationsController::class, 'index'])->name('transportations.index');
        Route::post('/', [TransportationsController::class, 'store'])->name('transportations.store');
        Route::put('/{transportation}', [TransportationsController::class, 'update'])->name('transportations.update');
        Route::delete('/{transportation}', [TransportationsController::class, 'destroy'])->name('transportations.destroy');
        Route::get('/total-price/{travelId}', [TransportationsController::class, 'getTotalPrice'])->name('transportations.total-price');
        Route::get('/by-status/{travelId}', [TransportationsController::class, 'getReservationByStatus'])->name('transportations.by-status');
        Route::get('/total-price-by-type/{travelId}/{type}', [TransportationsController::class, 'getTotalPriceByType'])->name('transportations.total-price-by-type');
    });

    // Friend routes
    Route::prefix('friends')->group(function () {
        Route::get('/', [FriendshipController::class, 'index'])->name('friends.index');
        Route::post('/{travelId}/add/{friendId}', [FriendshipController::class, 'addFriendToTravel'])->name('friends.add-to-travel');
        Route::get('/invite', [FriendInviteController::class, 'showInviteForm'])->name('friends.invite');
        Route::get('/invite/search', [FriendInviteController::class, 'search'])->name('friends.invite.search');
        Route::post('/invite/send/{receiverId}', [FriendInviteController::class, 'sendInvite'])->name('friends.invite.send');
        Route::post('/invite/accept/{inviteId}', [FriendInviteController::class, 'acceptInvite'])->name('friends.invite.accept');
        Route::post('/invite/reject/{inviteId}', [FriendInviteController::class, 'rejectInvite'])->name('friends.invite.reject');
    });

    // Cities routes
    Route::prefix('cities')->group(function () {
        Route::get('/', [CityController::class, 'index'])->name('cities.index');
        Route::get('/{city}', [CityController::class, 'show'])->name('cities.show');
        Route::get('/{city}/edit', [CityController::class, 'edit'])->name('cities.edit');
        Route::post('/', [CityController::class, 'store'])->name('cities.store');
        Route::put('/{city}', [CityController::class, 'update'])->name('cities.update');
        Route::delete('/{city}', [CityController::class, 'destroy'])->name('cities.destroy');
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

    // Temporary debug route
    Route::get('/debug/friends', function() {
        $user = Auth::user();
        
        // Get raw friendship records
        $friendships = DB::table('friendships')
            ->where('user_id', $user->id)
            ->orWhere('friend_id', $user->id)
            ->get();
            
        // Get friends using the allFriends method
        $allFriends = $user->allFriends()->get();
        
        // Get separate friend lists
        $friends = $user->friends()->get();
        $friendOf = $user->friendOf()->get();
        
        return [
            'user_id' => $user->id,
            'raw_friendships' => $friendships,
            'all_friends' => $allFriends,
            'direct_friends' => $friends,
            'friend_of' => $friendOf,
            'query' => $user->allFriends()->toSql(),
            'bindings' => $user->allFriends()->getBindings()
        ];
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
