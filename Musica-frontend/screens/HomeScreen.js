import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import MiniPlayer from '../components/MiniPlayer';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const { songs, playSong, currentSong } = useMusic();
    const { logout, user } = useAuth();
    const navigation = useNavigation();

    const handleSongPress = async (song, songs) => {
        await playSong(song, songs); // lista completa
        navigation.navigate('Player');
    };

    const renderSongItem = ({ item }) => (
        <TouchableOpacity
            style={styles.songItem}
            onPress={() => handleSongPress(item, songs)}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: item.cover_url }}
                style={styles.coverImage}
                defaultSource={require('../assets/placeholder.png')}
            />
            <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.songArtist} numberOfLines={1}>
                    {item.artist}
                </Text>
            </View>
            <Text style={styles.duration}>
                {formatDuration(item.duration)}
            </Text>
        </TouchableOpacity>
    );

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1a1a1a', '#000000']}
                style={styles.gradient}
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>Library</Text>
                            {user && <Text style={styles.headerSubtitle}>Hi, {user.name}</Text>}
                        </View>
                        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                            <Ionicons name="log-out-outline" size={28} color="#FF2D55" />
                        </TouchableOpacity>
                    </View>

                    {/* Songs List */}
                    <FlatList
                        data={songs}
                        renderItem={renderSongItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
    logoutButton: {
        padding: 8,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    songItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#333',
    },
    coverImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    songInfo: {
        flex: 1,
        marginLeft: 15,
    },
    songTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    songArtist: {
        fontSize: 14,
        color: '#999',
    },
    duration: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
    },
});
