import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useMusic } from '../context/MusicContext';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import FavoriteButton from '../components/FavoriteButton';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen() {
    const {
        currentSong,
        isPlaying,
        position,
        duration,
        volume,
        isShuffleOn,
        repeatMode,
        togglePlayPause,
        seekTo,
        playNextSong,
        playPreviousSong,
        setVolume,
        toggleShuffle,
        toggleRepeat,
    } = useMusic();
    const navigation = useNavigation();

    if (!currentSong) {
        return null;
    }

    const formatTime = (millis) => {
        if (!millis) return '0:00';
        const totalSeconds = Math.floor(millis / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2d1b3d', '#1a1a1a', '#000000']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.closeButton}
                        >
                            <Ionicons name="chevron-down" size={32} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Now Playing</Text>
                        <View style={styles.headerRight}>
                            <FavoriteButton songId={currentSong.id} size={30} paddingHorizontal={-10}/>
                        </View>
                    </View>

                    {/* Album Art */}
                    <View style={styles.artworkContainer}>
                        <Image
                            source={{ uri: currentSong.cover_url }}
                            style={styles.artwork}
                            defaultSource={require('../assets/placeholder.png')}
                        />
                    </View>

                    {/* Song Info */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.title} numberOfLines={1}>
                            {currentSong.title}
                        </Text>
                        <Text style={styles.artist} numberOfLines={1}>
                            {currentSong.artist}
                        </Text>

                        {/* Shuffle and Repeat Controls */}
                        <View style={styles.shuffleRepeatRow}>
                            <TouchableOpacity
                                style={styles.shuffleRepeatButtonInfo}
                                onPress={toggleShuffle}
                            >
                                <Ionicons
                                    name="shuffle"
                                    size={26}
                                    color={isShuffleOn ? "#FF2D55" : "#999"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.shuffleRepeatButtonInfo}
                                onPress={toggleRepeat}
                            >
                                <Ionicons
                                    name={repeatMode === 'one' ? "repeat-outline" : "repeat"}
                                    size={26}
                                    color={repeatMode !== 'off' ? "#FF2D55" : "#999"}
                                />
                                {repeatMode === 'one' && (
                                    <Text style={styles.repeatOneTextInfo}>1</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={duration || 1}
                            value={position}
                            onSlidingComplete={seekTo}
                            minimumTrackTintColor="#FF2D55"
                            maximumTrackTintColor="#333"
                            thumbTintColor="#fff"
                        />
                        <View style={styles.timeContainer}>
                            <Text style={styles.time}>{formatTime(position)}</Text>
                            <Text style={styles.time}>{formatTime(duration)}</Text>
                        </View>
                    </View>

                    {/* Volume Control */}
                    <View style={styles.volumeContainer}>
                        <Ionicons
                            name={volume === 0 ? "volume-mute" : volume < 0.5 ? "volume-low" : "volume-medium"}
                            size={20}
                            color="#999"
                        />
                        <Slider
                            style={styles.volumeSliderInline}
                            minimumValue={0}
                            maximumValue={1}
                            value={volume}
                            onValueChange={setVolume}
                            minimumTrackTintColor="#FF2D55"
                            maximumTrackTintColor="#333"
                            thumbTintColor="#fff"
                        />
                        <Text style={styles.volumePercentage}>
                            {Math.round(volume * 100)}%
                        </Text>
                    </View>

                    {/* Controls */}
                    <View style={styles.controls}>
                        <TouchableOpacity style={styles.controlButton} onPress={() => {
                            console.log("⏮ PREVIOUS button pressed");
                            playPreviousSong();
                        }}>
                            <Ionicons name="play-skip-back" size={40} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={togglePlayPause}
                        >
                            <BlurView intensity={20} style={styles.playButtonBlur}>
                                <Ionicons
                                    name={isPlaying ? 'pause' : 'play'}
                                    size={44}
                                    color="#fff"
                                />
                            </BlurView>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.controlButton} onPress={() => {
                            console.log("⏭ NEXT button pressed");
                            playNextSong();
                        }}>
                            <Ionicons name="play-skip-forward" size={40} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    gradient: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    placeholder: {
        width: 40,
    },
    artworkContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 25,
    },
    artwork: {
        width: width - 80,
        height: width - 80,
        borderRadius: 12,
        backgroundColor: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
    },
    infoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    artist: {
        fontSize: 18,
        color: '#FF2D55',
        fontWeight: '500',
    },
    progressContainer: {
        marginBottom: 10,
    },
    slider: {
        width: '98%',
        alignSelf: 'center',
        height: 40,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    controlButton: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        marginHorizontal: 15,
    },
    playButtonBlur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    volumeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    volumeSliderInline: {
        flex: 1,
        height: 40,
    },
    volumePercentage: {
        fontSize: 12,
        color: '#999',
        width: 40,
        textAlign: 'right',
    },
    shuffleRepeatButton: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    repeatOneText: {
        position: 'absolute',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FF2D55',
        top: 28,
        right: 12,
    },
    shuffleRepeatRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 50,
    },
    shuffleRepeatButtonInfo: {
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    repeatOneTextInfo: {
        position: 'absolute',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FF2D55',
        top: 28,
        right: 12,
    },
    headerRight: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});