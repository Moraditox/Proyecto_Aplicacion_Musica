import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { Audio } from 'expo-av';

const MusicContext = createContext();

const API_URL = 'http://192.168.1.24:8000/api';

export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1.0);

  // refs para control interno del reproductor
  const soundRef = useRef(null);
  const playlistRef = useRef([]);
  const indexRef = useRef(-1);
  const isChangingRef = useRef(false);

  useEffect(() => {
    setupAudio();
    fetchSongs();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      console.log('Audio mode configured for background playback');
    } catch (e) {
      console.error('Error setting up audio:', e);
    }
  };

  const fetchSongs = async () => {
    try {
      const res = await fetch(`${API_URL}/songs`);
      const data = await res.json();
      setSongs(data);
    } catch (e) {
      console.error('Error fetching songs:', e);
    }
  };

  const updateNowPlaying = async (song) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setStatusAsync({
          androidImplementation: 'SimpleExoPlayer',
        });
      }

      // This will update iOS Now Playing Info Center
      console.log('Now Playing:', song.title, 'by', song.artist);
    } catch (e) {
      console.log('Error updating now playing:', e);
    }
  };

  const loadAndPlay = async (song) => {
    try {
      console.log("⏩ loadAndPlay: song.id =", song?.id, "title =", song?.title);
      console.log("🎵 current playlist:", playlistRef.current.map(s => s.id));
      console.log("▶ playing index:", indexRef.current);
      console.log("🎵 Loading audio from URL:", song.audio_url);
      isChangingRef.current = true;

      // Unload previous sound
      if (soundRef.current) {
        try {
          await soundRef.current.unloadAsync();
        } catch (e) {
          console.log('Error unloading (ignored):', e);
        }
        soundRef.current = null;
      }

      setCurrentSong(song);
      setPosition(0);
      setDuration(song.duration ? song.duration * 1000 : 0);

      const { sound } = await Audio.Sound.createAsync(
        { uri: song.audio_url },
        {
          shouldPlay: true,
          progressUpdateIntervalMillis: 500,
          volume: volume,
        },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setIsPlaying(true);

      // Update Now Playing info for iOS lock screen
      await updateNowPlaying(song);

    } catch (e) {
      console.error('Error playing song:', e);
    } finally {
      setTimeout(() => {
        isChangingRef.current = false;
      }, 150);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded || isChangingRef.current) return;

    setPosition(status.positionMillis ?? 0);
    setIsPlaying(status.isPlaying ?? false);

    if (duration === 0 && status.durationMillis) {
      setDuration(status.durationMillis);
    }

    if (status.didJustFinish && !status.isLooping) {
      handleNextInternal();
    }
  };

  const handleNextInternal = async () => {
    if (!playlistRef.current.length) return;

    const nextIndex = (indexRef.current + 1) % playlistRef.current.length;
    console.log("Going NEXT: ", nextIndex);

    indexRef.current = nextIndex;
    await loadAndPlay(playlistRef.current[nextIndex]);
  };

  const playSong = async (song, list) => {
    console.log("playSong called with:", song.title);
    console.log("playlist length:", list?.length ?? "undefined");
    const playlist = list && list.length ? list : songs;
    if (!playlist || !playlist.length || !song) return;

    playlistRef.current = playlist;

    const idx = playlist.findIndex((s) => s.id === song.id);
    indexRef.current = idx === -1 ? 0 : idx;

    await loadAndPlay(playlistRef.current[indexRef.current]);
  };

  const playNextSong = async () => {
    console.log("NEXT pressed (public) index:", indexRef.current);
    await handleNextInternal();
  };

  const playPreviousSong = async () => {
    if (!playlistRef.current.length) return;

    const prevIndex =
      (indexRef.current - 1 + playlistRef.current.length) %
      playlistRef.current.length;
    console.log("Going PREVIOUS: ", prevIndex);

    indexRef.current = prevIndex;
    await loadAndPlay(playlistRef.current[prevIndex]);
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (e) {
      console.log('Toggle error:', e);
    }
  };

  const seekTo = async (value) => {
    if (!soundRef.current) return;
    if (isChangingRef.current) return;
    try {
      await soundRef.current.setPositionAsync(value);
    } catch (e) {
      console.log('Seek error (ignored):', e);
    }
  };

  const setVolume = async (value) => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.setVolumeAsync(value);
      setVolumeState(value);
    } catch (e) {
      console.log('Volume error:', e);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        songs,
        currentSong,
        isPlaying,
        position,
        duration,
        volume,
        playSong,
        playNextSong,
        playPreviousSong,
        togglePlayPause,
        seekTo,
        setVolume,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);