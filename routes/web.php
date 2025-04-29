<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('travels', function () {
        return Inertia::render('travels');
    })->name('travels');
    Route::get('friends', function () {
        return Inertia::render('friends');
    })->name('friends');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
