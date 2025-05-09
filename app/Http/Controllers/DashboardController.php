<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Travel;
use App\Models\AppUpdate;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get user metrics
        $userMetrics = $this->getUserMetrics($user);
        
        // Get travel statistics
        $travelStats = $this->getTravelStatistics($user);
        
        // Get social data (messages, updates)
        $socialData = $this->getSocialData($user);
        
        // Get closest travel details
        $closestTravel = $this->getClosestTravelDetails($user);

        return Inertia::render('Dashboard/Index', [
            'user' => $userMetrics,
            'metrics' => array_merge($travelStats, $socialData, [
                'closestTravel' => $closestTravel
            ])
        ]);
    }

    protected function getUserMetrics($user)
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'nickname' => $user->nickname,
            'photo' => $user->photo,
            'travels' => $user->travels()->count(),
            'friends' => $user->friends()->count(),
            'totalUpdates' => $user->travelUpdates()->count(),
        ];
    }

    protected function getTravelStatistics($user)
    {
        $travels = $user->travels()->get();
        $nextTravel = $travels->where('start_date', '>=', now())->sortBy('start_date')->first();

        return [
            'totalTravels' => $travels->count(),
            'nextTravel' => $nextTravel?->title,
            'totalDays' => $travels->sum(function ($travel) {
                return Carbon::parse($travel->end_date)->diffInDays(
                    Carbon::parse($travel->start_date)
                ) + 1;
            }),
            'mostFrequentDestination' => $travels->groupBy('destination')
                ->sortByDesc(fn($group) => $group->count())
                ->keys()
                ->first(),
            'travelsPerYear' => $travels->groupBy(function ($travel) {
                return Carbon::parse($travel->start_date)->format('Y');
            })->map->count()
        ];
    }

    protected function getSocialData($user)
    {
        return [
            'lastMessages' => $user->receivedMessages()
                ->with('sender:id,name,photo')
                ->latest()
                ->take(3)
                ->get()
                ->map(function ($message) {
                    return [
                        'id' => $message->id,
                        'content' => $message->content,
                        'created_at' => $message->created_at->diffForHumans(),
                        'sender' => $message->sender->only(['id', 'name', 'photo'])
                    ];
                }),
            'appUpdates' => AppUpdate::latest()
                ->take(3)
                ->get()
                ->map(function ($update) {
                    return [
                        'id' => $update->id,
                        'title' => $update->title,
                        'description' => $update->description,
                        'created_at' => $update->created_at->diffForHumans()
                    ];
                })
        ];
    }

    protected function getClosestTravelDetails($user)
    {
        $travel = $user->travels()
            ->where('start_date', '>=', now())
            ->orderBy('start_date')
            ->first();

        if (!$travel) {
            return [
                'title' => 'No upcoming travels',
                'startDate' => null,
                'endDate' => null,
                'countdown' => 0,
                'updates' => [],
                'topUpdaters' => []
            ];
        }

        // Convert string dates to Carbon instances if needed
        $startDate = is_string($travel->start_date) 
            ? Carbon::parse($travel->start_date)
            : $travel->start_date;

        $endDate = is_string($travel->end_date) 
            ? Carbon::parse($travel->end_date)
            : $travel->end_date;

        return [
            'id' => $travel->id,
            'title' => $travel->title,
            'destination' => $travel->destination,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
            'countdown' => now()->diffInDays($startDate),
            'updates' => $travel->updates()
                ->with('creator:id,name,photo')
                ->latest()
                ->take(3)
                ->get()
                ->map(function ($update) {
                    return [
                        'id' => $update->id,
                        'title' => $update->title,
                        'description' => $update->description,
                        'created_at' => $update->created_at->diffForHumans(),
                        'creator' => $update->creator->only(['id', 'name', 'photo'])
                    ];
                }),
            'topUpdaters' => $travel->updates()
                ->selectRaw('created_by, count(*) as update_count')
                ->groupBy('created_by')
                ->orderByDesc('update_count')
                ->with('creator:id,name,photo')
                ->take(3)
                ->get()
                ->map(function ($updater) {
                    return [
                        'user' => $updater->creator->only(['id', 'name', 'photo']),
                        'update_count' => $updater->update_count
                    ];
                })
        ];
    }
}