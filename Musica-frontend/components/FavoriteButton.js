import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://192.168.1.24:8000/api';

export default function FavoriteButton({ songId, size = 28, color = '#FF2D55' }) {
    const { token, isAuthenticated } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && songId) {
            checkFavorite();
        }
    }, [songId, isAuthenticated]);

    const checkFavorite = async () => {
        try {
            const response = await fetch(`${API_URL}/favorites/${songId}/check`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsFavorite(data.is_favorite);
            }
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const toggleFavorite = async () => {
        if (!isAuthenticated) {
            Alert.alert('Login Required', 'Please login to add favorites');
            return;
        }

        if (loading) return;

        setLoading(true);
        try {
            const url = `${API_URL}/favorites/${songId}`;
            const method = isFavorite ? 'DELETE' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setIsFavorite(!isFavorite);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Error', 'Failed to update favorite');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.button}
            disabled={loading}
        >
            <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={size}
                color={isFavorite ? color : '#999'}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
    },
});
