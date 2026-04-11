import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';

const categories = ['All', 'Favorites', 'Casual', 'Formal', 'Event'];

const outfits = [
    {
        id: 1,
        name: 'Casual Friday Look',
        category: 'Casual',
        date: 'Apr 5',
        liked: false,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    },
    {
        id: 2,
        name: 'Gym Morning Fit',
        category: 'Gym',
        date: 'Apr 4',
        liked: false,
        image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400',
    },
    {
        id: 3,
        name: 'Dinner Date Outfit',
        category: 'Event',
        date: 'Apr 3',
        liked: true,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
    },
    {
        id: 4,
        name: 'Weekend Brunch',
        category: 'Casual',
        date: 'Apr 2',
        liked: false,
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400',
    },
    {
        id: 5,
        name: 'Office Monday',
        category: 'Formal',
        date: 'Apr 1',
        liked: false,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f82?w=400',
    },
    {
        id: 6,
        name: 'Date Night',
        category: 'Event',
        date: 'Mar 31',
        liked: true,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    },
];

const OutfitScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [likedItems, setLikedItems] = useState<number[]>(
        outfits.filter(o => o.liked).map(o => o.id)
    );

    const toggleLike = (id: number) => {
        setLikedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };


    const finalOutfits = selectedCategory === 'Favorites'
        ? outfits.filter(o => likedItems.includes(o.id))
        : selectedCategory === 'All'
            ? outfits
            : outfits.filter(o => o.category === selectedCategory);

    const rows = [];
    for (let i = 0; i < finalOutfits.length; i += 2) {
        rows.push(finalOutfits.slice(i, i + 2));
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Saved Outfits</Text>
                    <Text style={styles.subtitle}>{outfits.length} items</Text>
                </View>

                {/* Category Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsRow}
                    style={styles.chipsScroll}
                >
                    {categories.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.chip, selectedCategory === cat && styles.chipActive]}
                            onPress={() => setSelectedCategory(cat)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Grid */}
                <View style={styles.grid}>
                    {rows.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {row.map(item => (
                                <View key={item.id} style={styles.card}>
                                    <View style={styles.imageWrapper}>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.itemImage}
                                        />
                                        {/* Like Button */}
                                        <TouchableOpacity
                                            style={styles.likeBtn}
                                            onPress={() => toggleLike(item.id)}
                                            activeOpacity={0.8}
                                        >
                                            <Heart
                                                size={16}
                                                color={likedItems.includes(item.id) ? '#EF4444' : '#fff'}
                                                fill={likedItems.includes(item.id) ? '#EF4444' : 'transparent'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.itemMeta}>{item.category} · {item.date}</Text>
                                    </View>
                                </View>
                            ))}
                            {row.length === 1 && <View style={styles.card} />}
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },

    // Header
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
    },
    title: {
        fontSize: 22,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#1E293B',
    },
    subtitle: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        color: '#94a3b8',
        marginTop: 2,
    },

    // Chips
    chipsScroll: {
        marginBottom: 16,
    },
    chipsRow: {
        paddingHorizontal: 16,
        gap: 8,
    },
    chip: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    chipActive: {
        backgroundColor: '#2869BD',
    },
    chipText: {
        fontSize: 13,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color: '#64748B',
    },
    chipTextActive: {
        color: '#fff',
    },

    // Grid
    grid: {
        paddingHorizontal: 16,
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    card: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        overflow: 'hidden',
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 1,
        position: 'relative',
    },
    itemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    likeBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: {
        padding: 10,
    },
    itemName: {
        fontSize: 13,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 3,
    },
    itemMeta: {
        fontSize: 11,
        fontFamily: 'InterRegular',
        color: '#94a3b8',
    },
});

export default OutfitScreen;