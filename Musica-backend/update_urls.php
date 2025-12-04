<?php

use Illuminate\Support\Facades\DB;

// Update all songs with localhost or 127.0.0.1 URLs to use the network IP
DB::table('songs')->update([
    'audio_url' => DB::raw("REPLACE(REPLACE(audio_url, 'http://localhost:8000/', 'http://192.168.1.24:8000/'), 'http://127.0.0.1:8000/', 'http://192.168.1.24:8000/')"),
    'cover_url' => DB::raw("REPLACE(REPLACE(cover_url, 'http://localhost:8000/', 'http://192.168.1.24:8000/'), 'http://127.0.0.1:8000/', 'http://192.168.1.24:8000/')")
]);

echo "URLs updated successfully!\n";
