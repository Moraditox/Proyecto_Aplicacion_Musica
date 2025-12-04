<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateSongUrls extends Command
{
    protected $signature = 'songs:update-urls';
    protected $description = 'Update song URLs from localhost to network IP';

    public function handle()
    {
        $this->info('Updating song URLs...');

        $updated = DB::table('songs')->update([
            'audio_url' => DB::raw("REPLACE(REPLACE(audio_url, 'http://localhost:8000/', 'http://192.168.1.24:8000/'), 'http://127.0.0.1:8000/', 'http://192.168.1.24:8000/')"),
            'cover_url' => DB::raw("REPLACE(REPLACE(cover_url, 'http://localhost:8000/', 'http://192.168.1.24:8000/'), 'http://127.0.0.1:8000/', 'http://192.168.1.24:8000/')")
        ]);

        $this->info("Updated {$updated} songs successfully!");
        
        return 0;
    }
}
