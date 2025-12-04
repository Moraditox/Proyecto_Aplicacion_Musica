import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useMusic } from '../context/MusicContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function MiniPlayer() {
    const { currentSong, isPlaying, togglePlayPause } = useMusic();
    const navigation = useNavigation();

    if (!currentSong) return null;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('Player')}
            activeOpacity={0.9}
        >
            <BlurView intensity={40} style={styles.blurView}>
                <Image
                    source={{ uri: currentSong.cover_url }}
                    style={styles.coverImage}
                />
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>
                        {currentSong.title}
                    </Text>
                    <Text style={styles.artist} numberOfLines={1}>
                        {currentSong.artist}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                    }}
                    style={styles.playButton}
                >
                    <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={28}
                        color="#fff"
                    />
                </TouchableOpacity>
            </BlurView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 75,
        left: 20,
        right: 20,
        height: 70,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    blurView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.10)',  // 10% opacity
    },
    coverImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
        backgroundColor: '#333',
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 3,
    },
    artist: {
        fontSize: 13,
        color: '#999',
    },
    playButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
});
