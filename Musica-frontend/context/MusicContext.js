import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MusicContext = createContext();

const API_URL = 'http://192.168.1.24:8000/api';

export const MusicProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1.0);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'one', 'all'

  // refs para control interno del reproductor
  const soundRef = useRef(null);
  const playlistRef = useRef([]);
  const originalPlaylistRef = useRef([]);
  const indexRef = useRef(-1);
  const isChangingRef = useRef(false);

  useEffect(() => {
    setupAudio();
    fetchSongs();
    loadPreferences();
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

  const loadPreferences = async () => {
    try {
      const shuffle = await AsyncStorage.getItem('isShuffleOn');
      const repeat = await AsyncStorage.getItem('repeatMode');
      if (shuffle !== null) setIsShuffleOn(JSON.parse(shuffle));
      if (repeat !== null) setRepeatMode(repeat);
    } catch (e) {
      console.log('Error loading preferences:', e);
    }
  };

  const savePreferences = async (shuffle, repeat) => {
    try {
      await AsyncStorage.setItem('isShuffleOn', JSON.stringify(shuffle));
      await AsyncStorage.setItem('repeatMode', repeat);
    } catch (e) {
      console.log('Error saving preferences:', e);
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const toggleShuffle = () => {
    const newShuffleState = !isShuffleOn;
    setIsShuffleOn(newShuffleState);
    savePreferences(newShuffleState, repeatMode);

    if (playlistRef.current.length === 0) return;

    if (newShuffleState) {
      // Activar shuffle
      originalPlaylistRef.current = [...playlistRef.current];
      const currentSongInPlaylist = playlistRef.current[indexRef.current];

      // Mezclar la playlist
      const shuffled = shuffleArray(playlistRef.current);

      // Asegurar que la canción actual sea la primera
      const currentIndex = shuffled.findIndex(s => s.id === currentSongInPlaylist?.id);
      if (currentIndex > 0) {
        [shuffled[0], shuffled[currentIndex]] = [shuffled[currentIndex], shuffled[0]];
      }

      playlistRef.current = shuffled;
      indexRef.current = 0;
    } else {
      // Desactivar shuffle - restaurar orden original
      const currentSongInPlaylist = playlistRef.current[indexRef.current];
      playlistRef.current = [...originalPlaylistRef.current];

      // Encontrar el índice de la canción actual en la playlist original
      const originalIndex = playlistRef.current.findIndex(s => s.id === currentSongInPlaylist?.id);
      indexRef.current = originalIndex !== -1 ? originalIndex : 0;
    }

    console.log('Shuffle:', newShuffleState ? 'ON' : 'OFF');
  };

  const toggleRepeat = () => {
    const modes = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const newMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(newMode);
    savePreferences(isShuffleOn, newMode);
    console.log('Repeat mode:', newMode);
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

    // Repeat One - repetir la misma canción
    if (repeatMode === 'one') {
      await loadAndPlay(playlistRef.current[indexRef.current]);
      return;
    }

    // Calcular siguiente índice
    let nextIndex = indexRef.current + 1;

    // Si llegamos al final de la playlist
    if (nextIndex >= playlistRef.current.length) {
      if (repeatMode === 'all') {
        // Repeat All - volver al inicio
        nextIndex = 0;
      } else {
        // Repeat Off - detener reproducción
        setIsPlaying(false);
        return;
      }
    }

    console.log("Going NEXT: ", nextIndex);
    indexRef.current = nextIndex;
    await loadAndPlay(playlistRef.current[nextIndex]);
  };

  const playSong = async (song, list) => {
    console.log("playSong called with:", song.title);
    console.log("playlist length:", list?.length ?? "undefined");
    const playlist = list && list.length ? list : songs;
    if (!playlist || !playlist.length || !song) return;

    // Guardar playlist original
    originalPlaylistRef.current = playlist;

    // Si shuffle está activo, mezclar la playlist
    if (isShuffleOn) {
      const shuffled = shuffleArray(playlist);
      // Asegurar que la canción seleccionada sea la primera
      const selectedIndex = shuffled.findIndex(s => s.id === song.id);
      if (selectedIndex > 0) {
        [shuffled[0], shuffled[selectedIndex]] = [shuffled[selectedIndex], shuffled[0]];
      }
      playlistRef.current = shuffled;
      indexRef.current = 0;
    } else {
      playlistRef.current = playlist;
      const idx = playlist.findIndex((s) => s.id === song.id);
      indexRef.current = idx === -1 ? 0 : idx;
    }

    await loadAndPlay(playlistRef.current[indexRef.current]);
  };

  const playNextSong = async () => {
    console.log("NEXT pressed (public) index:", indexRef.current);
    await handleNextInternal();
  };

  const playPreviousSong = async () => {
    if (!playlistRef.current.length) return;

    // Repeat One - reiniciar la canción actual
    if (repeatMode === 'one') {
      await seekTo(0);
      return;
    }

    let prevIndex = indexRef.current - 1;

    // Si estamos al inicio de la playlist
    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        // Repeat All - ir al final
        prevIndex = playlistRef.current.length - 1;
      } else {
        // Repeat Off - reiniciar canción actual
        await seekTo(0);
        return;
      }
    }

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
        isShuffleOn,
        repeatMode,
        playSong,
        playNextSong,
        playPreviousSong,
        togglePlayPause,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);