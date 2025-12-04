<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Song management routes
Route::get('/songs', [App\Http\Controllers\SongController::class, 'webIndex'])->name('web.songs.index');
Route::get('/songs/create', [App\Http\Controllers\SongController::class, 'create'])->name('web.songs.create');
Route::post('/songs', [App\Http\Controllers\SongController::class, 'store'])->name('web.songs.store');
