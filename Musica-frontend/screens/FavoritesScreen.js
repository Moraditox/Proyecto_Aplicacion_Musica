import { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://192.168.1.24:8000/api';

export default function FavoritesScreen() {
    const { token } = useAuth();
    const { playSong } = useMusic();
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("Pantalla enfocada 🔄");
            fetchFavorites();
        });

        return unsubscribe;
    }, [navigation]);

    const fetchFavorites = async () => {
        console.log("Cargando favoritos...");

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/favorites`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
            });

            console.log("Status:", response.status);

            const data = await response.json();
            console.log("DATA:", data);

            setFavorites(data);
        } catch (error) {
            console.error("Error al obtener favoritos:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleSongPress = async (song, favorites) => {
        await playSong(song, favorites); // 👈 pasa la lista
        navigation.navigate('Player');
    };


    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const renderSongItem = ({ item }) => (
        <TouchableOpacity
            style={styles.songItem}
            onPress={() => handleSongPress(item, favorites)}
            activeOpacity={0.7}
        >
            <Image
                source={{ uri: item.cover_url }}
                style={styles.coverImage}
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

    if (loading) {
        return (
            <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF2D55" />
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#1a1a1a', '#000000']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Favorites</Text>
                </View>

                {favorites.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-outline" size={80} color="#666" />
                        <Text style={styles.emptyText}>No favorites yet</Text>
                        <Text style={styles.emptySubtext}>
                            Start adding songs to your favorites!
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={favorites}
                        renderItem={renderSongItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
        marginTop: 20,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#999',
        marginTop: 10,
        textAlign: 'center',
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
