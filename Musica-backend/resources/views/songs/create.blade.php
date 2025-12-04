@extends('layouts.app')

@section('title', 'Upload Song')
@section('header', 'Upload New Song')

@section('content')
<div class="card">
    <form action="{{ route('web.songs.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="form-group">
            <label for="title">Title *</label>
            <input type="text" id="title" name="title" value="{{ old('title') }}" required>
            @error('title')
                <div class="error">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group">
            <label for="artist">Artist *</label>
            <input type="text" id="artist" name="artist" value="{{ old('artist') }}" required>
            @error('artist')
                <div class="error">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group">
            <label for="album">Album</label>
            <input type="text" id="album" name="album" value="{{ old('album') }}">
            @error('album')
                <div class="error">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group">
            <label for="cover">Cover Image (JPG, PNG - Max 5MB)</label>
            <input type="file" id="cover" name="cover" accept="image/jpeg,image/png,image/jpg">
            @error('cover')
                <div class="error">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group">
            <label for="audio">Audio File * (MP3, WAV, M4A - Max 20MB)</label>
            <input type="file" id="audio" name="audio" accept="audio/mpeg,audio/wav,audio/mp4" required>
            @error('audio')
                <div class="error">{{ $message }}</div>
            @enderror
        </div>

        <div class="form-group">
            <label for="duration">Duration (seconds)</label>
            <input type="number" id="duration" name="duration" value="{{ old('duration') }}" placeholder="Optional">
            @error('duration')
                <div class="error">{{ $message }}</div>
            @enderror
        </div>

        <div style="display: flex; gap: 12px;">
            <button type="submit" class="btn">Upload Song</button>
            <a href="{{ route('web.songs.index') }}" class="btn" style="background: #666;">Cancel</a>
        </div>
    </form>
</div>
@endsection
