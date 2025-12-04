<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = $request->user()
            ->favorites() // 👈 Esta es la relación correcta
            ->latest()
            ->get()
            ->map(function ($song) {
                return [
                    'id' => $song->id,
                    'title' => $song->title,
                    'artist' => $song->artist,
                    'album' => $song->album,
                    'cover_url' => $song->cover_url,
                    'audio_url' => $song->audio_url,
                    'duration' => $song->duration,
                ];
            })
            ->values();

        return response()->json($favorites);
    }

    public function store(Request $request, $songId)
    {
        $song = Song::findOrFail($songId);

        // Check if already favorited
        $exists = DB::table('favorites')
            ->where('user_id', $request->user()->id)
            ->where('song_id', $songId)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Song already in favorites'], 200);
        }

        DB::table('favorites')->insert([
            'user_id' => $request->user()->id,
            'song_id' => $songId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Song added to favorites'], 201);
    }

    public function destroy(Request $request, $songId)
    {
        DB::table('favorites')
            ->where('user_id', $request->user()->id)
            ->where('song_id', $songId)
            ->delete();

        return response()->json(['message' => 'Song removed from favorites']);
    }

    public function check(Request $request, $songId)
    {
        $isFavorite = DB::table('favorites')
            ->where('user_id', $request->user()->id)
            ->where('song_id', $songId)
            ->exists();

        return response()->json(['is_favorite' => $isFavorite]);
    }
}
