import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shirt } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    query,
    where,
    orderBy,
    getDocs,
} from '@react-native-firebase/firestore';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_SIZE = (SCREEN_W - 48) / 2;

type ClosetItem = {
    id:        string;
    title:     string;
    category:  string;
    color:     string;
    imageURL:  string;
    createdAt: any;
};

const AllitemsScreen = () => {
    const navigation = useNavigation<any>();
    const app  = getApp();
    const auth = getAuth(app);
    const db   = getFirestore(app);
    const user = auth.currentUser;

    const [items,   setItems]   = useState<ClosetItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetch = async () => {
            try {
                const snap = await getDocs(
                    query(
                        collection(db, 'closetItems'),
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc')
                    )
                );
                setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as ClosetItem)));
            } catch (e) {
                console.warn('[AllItems] error:', e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const renderItem = ({ item }: { item: ClosetItem }) => (
        <View style={styles.card}>
            {item.imageURL ? (
                <Image source={{ uri: item.imageURL }} style={styles.cardImage} />
            ) : (
                <View style={[styles.cardImage, styles.cardFallback]}>
                    <Shirt size={28} color="#CBD5E1" />
                </View>
            )}
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardMeta}>{item.category}{item.color ? ` · ${item.color}` : ''}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>All Items</Text>
                <View style={{ width: 36 }} />
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#2869BD" />
                </View>
            ) : items.length === 0 ? (
                <View style={styles.centered}>
                    <Shirt size={48} color="#E2E8F0" />
                    <Text style={styles.emptyText}>No items in your closet yet</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={i => i.id}
                    renderItem={renderItem}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <Text style={styles.countText}>{items.length} items</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea:        { flex: 1, backgroundColor: '#fff' },
    centered:        { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },

    header: {
        flexDirection:     'row',
        alignItems:        'center',
        justifyContent:    'space-between',
        paddingHorizontal:  20,
        paddingVertical:    12,
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16, fontFamily: 'InterBold', fontWeight: '700', color: '#1E293B',
    },

    countText: {
        fontSize: 13, fontFamily: 'InterRegular', color: '#94A3B8',
        paddingHorizontal: 16, paddingBottom: 12,
    },
    listContent: {
        paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40,
    },
    row: {
        justifyContent: 'space-between', marginBottom: 16,
    },

    card: {
        width: CARD_SIZE, backgroundColor: '#F8FAFC',
        borderRadius: 14, overflow: 'hidden',
    },
    cardImage: {
        width: CARD_SIZE, height: CARD_SIZE * 1.15,
    },
    cardFallback: {
        backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center',
    },
    cardInfo: {
        paddingHorizontal: 10, paddingVertical: 8, gap: 2,
    },
    cardTitle: {
        fontSize: 13, fontFamily: 'InterSemiBold', fontWeight: '600', color: '#1E293B',
    },
    cardMeta: {
        fontSize: 11, fontFamily: 'InterRegular', color: '#94A3B8',
    },

    emptyText: {
        fontSize: 14, fontFamily: 'InterRegular', color: '#94A3B8',
    },
});

export default AllitemsScreen;