<?php

namespace App\Http\Controllers;

use App\Models\Song;
use Illuminate\Http\Request;

class SongController extends Controller
{
    /**
     * Display a listing of songs for web interface.
     */
    public function webIndex()
    {
        $songs = Song::latest()->get();
        return view('songs.index', compact('songs'));
    }

    /**
     * Show the form for creating a new song.
     */
    public function create()
    {
        return view('songs.create');
    }

    /**
     * Display a listing of the resource for API.
     */
    public function index()
    {
        return Song::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'artist' => 'required|string|max:255',
            'album' => 'nullable|string|max:255',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg|max:5120', // 5MB max
            'audio' => 'required|mimes:mp3,wav,m4a|max:20480', // 20MB max
            'duration' => 'nullable|integer',
        ]);

        // Handle cover upload
        $coverUrl = null;
        if ($request->hasFile('cover')) {
            $coverPath = $request->file('cover')->store('covers', 'public');
            // Use network IP instead of localhost for mobile access
            $coverUrl = 'http://192.168.1.24:8000/storage/' . $coverPath;
        }

        // Handle audio upload
        $audioFile = $request->file('audio');
        $audioPath = $audioFile->store('songs', 'public');
        // Use network IP instead of localhost for mobile access
        $audioUrl = 'http://192.168.1.24:8000/storage/' . $audioPath;

        // Get duration from uploaded file if not provided
        $duration = $validated['duration'] ?? null;
        
        // If duration not provided, extract it from the audio file
        if (!$duration) {
            try {
                $getID3 = new \getID3;
                $fileInfo = $getID3->analyze($audioFile->getRealPath());
                if (isset($fileInfo['playtime_seconds'])) {
                    $duration = (int) round($fileInfo['playtime_seconds']);
                }
            } catch (\Exception $e) {
                // If extraction fails, duration will remain null
                \Log::warning('Failed to extract duration from audio file: ' . $e->getMessage());
            }
        }

        $song = Song::create([
            'title' => $validated['title'],
            'artist' => $validated['artist'],
            'album' => $validated['album'] ?? null,
            'cover_url' => $coverUrl,
            'audio_url' => $audioUrl,
            'duration' => $duration,
        ]);

        // Return JSON for API or redirect for web
        if ($request->expectsJson()) {
            return response()->json($song, 201);
        }

        return redirect()->route('web.songs.index')->with('success', 'Song uploaded successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Song::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $song = Song::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'artist' => 'sometimes|string|max:255',
            'album' => 'nullable|string|max:255',
            'cover_url' => 'nullable|url',
            'audio_url' => 'sometimes|url',
            'duration' => 'nullable|integer',
        ]);

        $song->update($validated);

        return $song;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Song::destroy($id);
        return response()->noContent();
    }
}
