<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public routes
Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/user', [App\Http\Controllers\AuthController::class, 'user']);
    
    // Favorites
    Route::get('/favorites', [App\Http\Controllers\FavoriteController::class, 'index']);
    Route::post('/favorites/{songId}', [App\Http\Controllers\FavoriteController::class, 'store']);
    Route::delete('/favorites/{songId}', [App\Http\Controllers\FavoriteController::class, 'destroy']);
    Route::get('/favorites/{songId}/check', [App\Http\Controllers\FavoriteController::class, 'check']);
});

Route::apiResource('songs', \App\Http\Controllers\SongController::class);
