<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Song;

class SongSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $songs = [
            [
                'title' => 'Blinding Lights',
                'artist' => 'The Weeknd',
                'album' => 'After Hours',
                'cover_url' => 'http://192.168.1.24:8000/storage/covers/blinding_lights.png',
                'audio_url' => 'http://192.168.1.24:8000/storage/songs/blinding_lights.mp3',
                'duration' => 200,
            ],
            [
                'title' => 'Levitating',
                'artist' => 'Dua Lipa',
                'album' => 'Future Nostalgia',
                'cover_url' => 'http://192.168.1.24:8000/storage/covers/levitating.png',
                'audio_url' => 'http://192.168.1.24:8000/storage/songs/levitating.mp3',
                'duration' => 203,
            ],
            [
                'title' => 'Peaches',
                'artist' => 'Justin Bieber',
                'album' => 'Justice',
                'cover_url' => 'http://192.168.1.24:8000/storage/covers/peaches.png',
                'audio_url' => 'http://192.168.1.24:8000/storage/songs/peaches.mp3',
                'duration' => 198,
            ],
             [
                'title' => 'Save Your Tears',
                'artist' => 'The Weeknd',
                'album' => 'After Hours',
                'cover_url' => 'http://192.168.1.24:8000/storage/covers/save_your_tears.png',
                'audio_url' => 'http://192.168.1.24:8000/storage/songs/save_your_tears.mp3',
                'duration' => 215,
            ],
            [
                'title' => 'Good 4 U',
                'artist' => 'Olivia Rodrigo',
                'album' => 'SOUR',
                'cover_url' => 'http://192.168.1.24:8000/storage/covers/good_4_u.png',
                'audio_url' => 'http://192.168.1.24:8000/storage/songs/good_4_u.mp3',
                'duration' => 178,
            ],
        ];

        foreach ($songs as $song) {
            Song::create($song);
        }
    }
}
