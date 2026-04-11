import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid3x3, SlidersHorizontal, Search } from 'lucide-react-native';

const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes'];

const items = [
    { id: 1, name: 'White Oversized Shirt', category: 'Top', color: 'White', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300' },
    { id: 2, name: 'Blue Straight Jeans', category: 'Bottom', color: 'Blue', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300' },
    { id: 3, name: 'Black Sneakers', category: 'Shoes', color: 'Black', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300' },
    { id: 4, name: 'Beige Blazer', category: 'Outerwear', color: 'Beige', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300' },
    { id: 5, name: 'Blue Knit Sweater', category: 'Tops', color: 'Blue', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300' },
    { id: 6, name: 'White Sneakers', category: 'Shoes', color: 'White', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300' },
    { id: 7, name: 'Black Wide-Leg Trousers', category: 'Bottom', color: 'Black', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f82?w=300' },
    { id: 8, name: 'Gray Gym Hoodie', category: 'Tops', color: 'Gray', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300' },
];

const ClosetScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchText, setSearchText] = useState('');

    const filteredItems = items.filter(item => {
        const matchCategory = selectedCategory === 'All' || item.category === selectedCategory || item.category === selectedCategory.slice(0, -1);
        const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
        return matchCategory && matchSearch;
    });

    const rows = [];
    for (let i = 0; i < filteredItems.length; i += 2) {
        rows.push(filteredItems.slice(i, i + 2));
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
                    <View>
                        <Text style={styles.title}>My Closet</Text>
                        <Text style={styles.subtitle}>{filteredItems.length} items</Text>
                    </View>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Grid3x3 size={20} color="#1E293B" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <SlidersHorizontal size={20} color="#1E293B" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search */}
                <View style={styles.searchWrapper}>
                    <Search size={16} color="#94a3b8" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Type something..."
                        placeholderTextColor="#94a3b8"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
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
                                <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.85}>
                                    <View style={styles.imageWrapper}>
                                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                                    </View>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.itemMeta}>{item.category} · {item.color}</Text>
                                </TouchableOpacity>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    headerIcons: {
        flexDirection: 'row',
        gap: 8,
    },
    iconBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },

    // Search
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 44,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'InterRegular',
        color: '#1E293B',
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
        paddingHorizontal: 16,
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
    },
    imageWrapper: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    itemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    itemName: {
        fontSize: 13,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 2,
    },
    itemMeta: {
        fontSize: 11,
        fontFamily: 'InterRegular',
        color: '#94a3b8',
    },
});

export default ClosetScreen;