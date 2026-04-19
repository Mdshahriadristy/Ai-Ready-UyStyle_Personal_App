// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     Image,
//     TextInput,
//     StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Grid3x3, SlidersHorizontal, Search } from 'lucide-react-native';
// import { styles } from './style';

// const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes'];

// const items = [
//     { id: 1, name: 'White Oversized Shirt', category: 'Top', color: 'White', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300' },
//     { id: 2, name: 'Blue Straight Jeans', category: 'Bottom', color: 'Blue', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300' },
//     { id: 3, name: 'Black Sneakers', category: 'Shoes', color: 'Black', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300' },
//     { id: 4, name: 'Beige Blazer', category: 'Outerwear', color: 'Beige', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300' },
//     { id: 5, name: 'Blue Knit Sweater', category: 'Tops', color: 'Blue', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300' },
//     { id: 6, name: 'White Sneakers', category: 'Shoes', color: 'White', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300' },
//     { id: 7, name: 'Black Wide-Leg Trousers', category: 'Bottom', color: 'Black', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f82?w=300' },
//     { id: 8, name: 'Gray Gym Hoodie', category: 'Tops', color: 'Gray', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300' },
// ];

// const ClosetScreen = () => {
//     const [selectedCategory, setSelectedCategory] = useState('All');
//     const [searchText, setSearchText] = useState('');

//     const filteredItems = items.filter(item => {
//         const matchCategory = selectedCategory === 'All' || item.category === selectedCategory || item.category === selectedCategory.slice(0, -1);
//         const matchSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
//         return matchCategory && matchSearch;
//     });

//     const rows = [];
//     for (let i = 0; i < filteredItems.length; i += 2) {
//         rows.push(filteredItems.slice(i, i + 2));
//     }

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//             {/* Header */}
//             <View style={styles.header}>
//                 <View>
//                     <Text style={styles.title}>My Closet</Text>
//                     <Text style={styles.subtitle}>{filteredItems.length} items</Text>
//                 </View>
//                 <View style={styles.headerIcons}>
//                     <TouchableOpacity style={styles.iconBtn}>
//                         <Grid3x3 size={20} color="#1E293B" />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.iconBtn}>
//                         <SlidersHorizontal size={20} color="#1E293B" />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* Search */}
//             <View style={styles.searchWrapper}>
//                 <Search size={16} color="#65758B" style={styles.searchIcon} />
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Type something..."
//                     placeholderTextColor="#757575"
//                     value={searchText}
//                     onChangeText={setSearchText}
//                 />
//             </View>

//             {/* Category Chips */}
//             <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.chipsRow}
//                 style={styles.chipsScroll}
//             >
//                 {categories.map(cat => (
//                     <TouchableOpacity
//                         key={cat}
//                         style={[styles.chip, selectedCategory === cat && styles.chipActive]}
//                         onPress={() => setSelectedCategory(cat)}
//                         activeOpacity={0.8}
//                     >
//                         <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
//                             {cat}
//                         </Text>
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>
//             <ScrollView
//                 style={styles.scroll}
//                 contentContainerStyle={styles.scrollContent}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {/* Grid */}
//                 <View style={styles.grid}>
//                     {rows.map((row, rowIndex) => (
//                         <View key={rowIndex} style={styles.row}>
//                             {row.map(item => (
//                                 <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.85}>
//                                     <View style={styles.imageWrapper}>
//                                         <Image source={{ uri: item.image }} style={styles.itemImage} />
//                                     </View>
//                                     <View style={styles.itemInfo}>
//                                         <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
//                                         <Text style={styles.itemMeta}>{item.category} · {item.color}</Text>
//                                     </View>
//                                 </TouchableOpacity>
//                             ))}
//                             {row.length === 1 && <View style={styles.card} />}
//                         </View>
//                     ))}
//                 </View>

//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// export default ClosetScreen;






import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid3x3, SlidersHorizontal, Search, ShoppingBag } from 'lucide-react-native';
import { styles } from './style';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
    orderBy,
} from '@react-native-firebase/firestore';

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories', 'Others'];

type ClosetItem = {
    id:        string;
    title:     string;
    category:  string;
    color:     string;
    imageURL:  string;
    userId:    string;
    createdAt: any;
};

const ClosetScreen = () => {
    const [items,            setItems]            = useState<ClosetItem[]>([]);
    const [loading,          setLoading]          = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchText,       setSearchText]       = useState('');

    const app  = getApp();
    const auth = getAuth(app);
    const db   = getFirestore(app);
    const user = auth.currentUser;

    // ── Firestore real-time listener ─────────────────────
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'closetItems'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data: ClosetItem[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                } as ClosetItem));
                setItems(data);
                setLoading(false);
            },
            (error) => {
                console.log('Firestore error:', error);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, []);

    // ── Filter logic — safe null/undefined check ──────────
    const filteredItems = items.filter((item) => {
        const matchCategory =
            selectedCategory === 'All' || item.category === selectedCategory;

        const search = searchText.toLowerCase().trim();

        // ✅ ?? '' দিয়ে null/undefined safe করা হয়েছে
        const matchSearch =
            !search ||
            (item.title    ?? '').toLowerCase().includes(search) ||
            (item.color    ?? '').toLowerCase().includes(search) ||
            (item.category ?? '').toLowerCase().includes(search);

        return matchCategory && matchSearch;
    });

    // ── Grid rows (2 columns) ─────────────────────────────
    const rows: ClosetItem[][] = [];
    for (let i = 0; i < filteredItems.length; i += 2) {
        rows.push(filteredItems.slice(i, i + 2));
    }

    // ── Loading ───────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#0F1729" />
                    <Text style={styles.loadingText}>Loading your closet...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

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
                <Search size={16} color="#65758B" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, color, category..."
                    placeholderTextColor="#94A3B8"
                    value={searchText}
                    onChangeText={setSearchText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                />
            </View>

            {/* Category Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
                style={styles.chipsScroll}
            >
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.chip, selectedCategory === cat && styles.chipActive]}
                        onPress={() => setSelectedCategory(cat)}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.chipText,
                            selectedCategory === cat && styles.chipTextActive,
                        ]}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Empty State */}
            {filteredItems.length === 0 ? (
                <View style={styles.emptyWrapper}>
                    <View style={styles.emptyIconWrapper}>
                        <ShoppingBag size={40} color="#CBD5E1" />
                    </View>
                    <Text style={styles.emptyTitle}>
                        {searchText || selectedCategory !== 'All'
                            ? 'No items found'
                            : 'Your closet is empty'}
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        {searchText || selectedCategory !== 'All'
                            ? 'Try a different search or category'
                            : 'Tap the + tab to add your first item'}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.grid}>
                        {rows.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.card}
                                        activeOpacity={0.85}
                                    >
                                        <View style={styles.imageWrapper}>
                                            <Image
                                                source={{ uri: item.imageURL }}
                                                style={styles.itemImage}
                                            />
                                        </View>
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName} numberOfLines={1}>
                                                {item.title}
                                            </Text>
                                            <Text style={styles.itemMeta}>
                                                {item.category ?? '—'} · {item.color ?? '—'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                                {row.length === 1 && <View style={styles.card} />}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default ClosetScreen;