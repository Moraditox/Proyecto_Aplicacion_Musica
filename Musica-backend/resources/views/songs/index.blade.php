@extends('layouts.app')

@section('title', 'Songs Library')
@section('header', 'Songs Library')

@section('content')
<div style="margin-bottom: 20px;">
    <a href="{{ route('web.songs.create') }}" class="btn">+ Upload New Song</a>
</div>

@if(session('success'))
    <div class="alert">
        {{ session('success') }}
    </div>
@endif

<div class="card">
    @if($songs->count() > 0)
        <table>
            <thead>
                <tr>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Duration</th>
                </tr>
            </thead>
            <tbody>
                @foreach($songs as $song)
                <tr>
                    <td>
                        @if($song->cover_url)
                            <img src="{{ $song->cover_url }}" alt="{{ $song->title }}" class="song-cover">
                        @else
                            <div class="song-cover" style="background: #333;"></div>
                        @endif
                    </td>
                    <td><strong>{{ $song->title }}</strong></td>
                    <td>{{ $song->artist }}</td>
                    <td>{{ $song->album ?? '-' }}</td>
                    <td>
                        @if($song->duration)
                            {{ floor($song->duration / 60) }}:{{ str_pad($song->duration % 60, 2, '0', STR_PAD_LEFT) }}
                        @else
                            -
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p style="text-align: center; color: #999; padding: 40px 0;">
            No songs uploaded yet. Click "Upload New Song" to get started!
        </p>
    @endif
</div>
@endsection
