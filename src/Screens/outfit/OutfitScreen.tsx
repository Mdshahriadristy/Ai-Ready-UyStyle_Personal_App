import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    Animated,
    FlatList,
    Dimensions,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    onSnapshot,
    getDocs,
    deleteDoc,
    doc,
    QueryDocumentSnapshot,
    DocumentData,
} from '@react-native-firebase/firestore';
import { styles } from './style';



const { width: SCREEN_WIDTH } = Dimensions.get('window');
const H_PAD      = 16;
const CARD_GAP   = 12;
const CARD_WIDTH  = (SCREEN_WIDTH - H_PAD * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1;
const INFO_HEIGHT = 52;
const PAGE_SIZE   = 10;



type ClosetItem = {
    id:        string;
    title:     string;
    category:  string;
    color:     string;
    imageURL:  string;
    userId:    string;
    createdAt?: any;
};

interface OutfitCardProps {
    item:        ClosetItem;
    isActive:    boolean;
    onCardPress: (id: string) => void;
    onDelete:    (item: ClosetItem) => void;
    onOutfitPress?: (item: ClosetItem) => void;
}

interface CategoryTabProps {
    label:    string;
    isActive: boolean;
    onPress:  () => void;
}

interface EmptyStateProps {
    category: string;
}

interface ErrorStateProps {
    onRetry: () => void;
}

interface OutfitScreenProps {
    onOutfitPress?: (item: ClosetItem) => void;
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard: React.FC = () => {
    const shimmer = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
                Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, [shimmer]);

    const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.75] });

    return (
        <Animated.View style={[styles.skeletonCard, { opacity }]}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonTextBlock}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '55%' }]} />
            </View>
        </Animated.View>
    );
};

// ─── Outfit Card ──────────────────────────────────────────────────────────────
// Tap card → X icon appears. Tap X → confirmation popup. Tap elsewhere → deactivate.

const OutfitCard: React.FC<OutfitCardProps> = React.memo(
    ({ item, isActive, onCardPress, onDelete, onOutfitPress }) => {

        // Animate the X badge scale in/out
        const xScale = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.spring(xScale, {
                toValue:       isActive ? 1 : 0,
                useNativeDriver: true,
                speed:          30,
                bounciness:     8,
            }).start();
        }, [isActive]);

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    if (isActive) {

                        onOutfitPress?.(item);
                    } else {
                        onCardPress(item.id);
                    }
                }}
                onLongPress={() => onCardPress(item.id)}
                delayLongPress={300}
            >
                <View style={[styles.card, isActive && styles.cardActive]}>
                    {/* Image */}
                    <View style={styles.imageWrapper}>
                        {item.imageURL ? (
                            <Image
                                source={{ uri: item.imageURL }}
                                style={styles.itemImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.imageFallback}>
                                <Text style={styles.imageFallbackText}>
                                    {item.title?.charAt(0) ?? '?'}
                                </Text>
                            </View>
                        )}

                        {/* ── X delete badge — hidden by default, shown when active ── */}
                        <Animated.View
                            style={[
                                styles.deleteBadge,
                                { transform: [{ scale: xScale }] },
                                // pointer-events off when invisible so it doesn't block taps
                                !isActive && { pointerEvents: 'none' },
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.deleteBadgeInner}
                                onPress={() => onDelete(item)}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                activeOpacity={0.8}
                            >
                                <X size={11} color="#fff" strokeWidth={3} />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {/* Info */}
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={1}>
                            {item.title}
                        </Text>
                        <Text style={styles.itemMeta} numberOfLines={1}>
                            {[item.category, item.color].filter(Boolean).join(' · ')}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
);

// ─── Category Tab ──────

const CategoryTab: React.FC<CategoryTabProps> = React.memo(({ label, isActive, onPress }) => (
    <TouchableOpacity
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={onPress}
        activeOpacity={0.75}
    >
        <Text style={[styles.chipText, isActive && styles.chipTextActive]} numberOfLines={1}>
            {label}
        </Text>
    </TouchableOpacity>
));

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<EmptyStateProps> = ({ category }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>👗</Text>
        <Text style={styles.emptyTitle}>No items here yet</Text>
        <Text style={styles.emptySubtitle}>
            {category === 'All'
                ? 'Your wardrobe is empty. Start adding clothes!'
                : `No items found in "${category}".`}
        </Text>
    </View>
);

// ─── Error State ──────────────────────────────────────────────────────────────

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => (
    <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Couldn't load items</Text>
        <Text style={styles.emptySubtitle}>Check your connection and try again.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
            <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
    </View>
);

// ─── Main Screen ───

const OutfitScreen: React.FC<OutfitScreenProps> = ({ onOutfitPress }) => {

    const app  = getApp();
    const auth = getAuth(app);
    const db   = getFirestore(app);
    const user = auth.currentUser;

    const [items, setItems]                       = useState<ClosetItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [loading, setLoading]                   = useState<boolean>(true);
    const [loadingMore, setLoadingMore]           = useState<boolean>(false);
    const [hasMore, setHasMore]                   = useState<boolean>(false);
    const [error, setError]                       = useState<Error | null>(null);
    const [activeCardId, setActiveCardId]         = useState<string | null>(null);
    const [deletingId, setDeletingId]             = useState<string | null>(null);

    const unsubscribeRef = useRef<(() => void) | null>(null);
    // Cursor for pagination: last Firestore document of the current page
    const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

    // ── Page 1 — real-time snapshot, first PAGE_SIZE items ───────────────────
    const subscribe = useCallback(() => {
        if (!user) return;

        setLoading(true);
        setError(null);
        setItems([]);
        lastDocRef.current = null;

        const q = query(
            collection(db, 'closetItems'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),   
            limit(PAGE_SIZE),
        );

        unsubscribeRef.current = onSnapshot(
            q,
            snapshot => {
                const docs: ClosetItem[] = snapshot.docs.map(d => ({
                    id: d.id,
                    ...(d.data() as Omit<ClosetItem, 'id'>),
                }));
                setItems(docs);
                lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] ?? null;
                setHasMore(snapshot.docs.length === PAGE_SIZE);
                setLoading(false);
            },
            (err: Error) => {
                console.warn('[Firestore] closetItems error:', err);
                setError(err);
                setLoading(false);
            }
        );
    }, [user?.uid]);

    useEffect(() => {
        subscribe();
        return () => unsubscribeRef.current?.();
    }, [subscribe]);

  
    const loadMore = useCallback(async () => {
        if (!user || !hasMore || loadingMore || !lastDocRef.current) return;

        try {
            setLoadingMore(true);
            const q = query(
                collection(db, 'closetItems'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc'),
                startAfter(lastDocRef.current),
                limit(PAGE_SIZE),
            );
            const snapshot = await getDocs(q);
            const newDocs: ClosetItem[] = snapshot.docs.map(d => ({
                id: d.id,
                ...(d.data() as Omit<ClosetItem, 'id'>),
            }));
            setItems(prev => [...prev, ...newDocs]);
            lastDocRef.current = snapshot.docs[snapshot.docs.length - 1] ?? null;
            setHasMore(snapshot.docs.length === PAGE_SIZE);
        } catch (err) {
            console.warn('[Firestore] loadMore error:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [user?.uid, hasMore, loadingMore]);

    // ── Delete item from Firestore ────────────────────────────────────────────
    const handleDelete = useCallback((item: ClosetItem) => {
        Alert.alert(
            'Delete Item',
            `Remove "${item.title}" from your wardrobe?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => setActiveCardId(null),
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setDeletingId(item.id);
                            setActiveCardId(null);
                            await deleteDoc(doc(db, 'closetItems', item.id));
                            // Optimistic removal from local state
                            setItems(prev => prev.filter(i => i.id !== item.id));
                        } catch (err) {
                            console.warn('[Firestore] delete error:', err);
                            Alert.alert('Error', 'Could not delete item. Please try again.');
                        } finally {
                            setDeletingId(null);
                        }
                    },
                },
            ],
        );
    }, []);

    // ── Card activation toggle ────────────────────────────────────────────────
    const handleCardPress = useCallback((id: string) => {
        setActiveCardId(prev => (prev === id ? null : id));
    }, []);

    // Dismiss active card when tapping outside the grid
    const dismissActive = useCallback(() => {
        if (activeCardId) setActiveCardId(null);
    }, [activeCardId]);

    // ── Derived: categories ───────────────────────────────────────────────────
    const categories = useMemo<string[]>(() => {
        const unique = [
            ...new Set(
                items
                    .map(o => o.category)
                    .filter((c): c is string => Boolean(c))
            ),
        ].sort();
        return ['All', ...unique];
    }, [items]);

    // ── Derived: filtered list ────────────────────────────────────────────────
    const filteredItems = useMemo<ClosetItem[]>(() => {
        if (selectedCategory === 'All') return items;
        return items.filter(o => o.category === selectedCategory);
    }, [items, selectedCategory]);


    useEffect(() => {
        if (selectedCategory !== 'All' && !categories.includes(selectedCategory)) {
            setSelectedCategory('All');
        }
    }, [categories, selectedCategory]);

    // ── FlatList helpers ───
    const renderItem = useCallback(
        ({ item }: { item: ClosetItem }) => (
            <OutfitCard
                item={item}
                isActive={activeCardId === item.id}
                onCardPress={handleCardPress}
                onDelete={handleDelete}
                onOutfitPress={onOutfitPress}
            />
        ),
        [activeCardId, handleCardPress, handleDelete, onOutfitPress]
    );

    const keyExtractor = useCallback((item: ClosetItem) => item.id, []);

    const ROW_H = CARD_HEIGHT + INFO_HEIGHT + CARD_GAP;

    const ListFooter = () => (
        <View style={styles.listFooter}>
            {loadingMore && <ActivityIndicator size="small" color="#2869BD" />}
        </View>
    );

    // ── Render ────────────────
    return (
        <TouchableWithoutFeedback onPress={dismissActive}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Saved Outfits</Text>
                    <Text style={styles.subtitle}>
                        {loading
                            ? 'Loading…'
                            : `${filteredItems.length}${hasMore ? '+' : ''} ${filteredItems.length === 1 ? 'item' : 'items'}`}
                    </Text>
                </View>

                {/* Category tabs */}
                {!loading && !error && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chipsRow}
                        style={styles.chipsScroll}
                    >
                        {categories.map(cat => (
                            <CategoryTab
                                key={cat}
                                label={cat}
                                isActive={selectedCategory === cat}
                                onPress={() => {
                                    setActiveCardId(null);
                                    setSelectedCategory(cat);
                                }}
                            />
                        ))}
                    </ScrollView>
                )}

                {/* Content */}
                {loading ? (
                    <View style={styles.skeletonGrid}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </View>
                ) : error ? (
                    <ErrorState onRetry={subscribe} />
                ) : filteredItems.length === 0 ? (
                    <EmptyState category={selectedCategory} />
                ) : (
                    <FlatList<ClosetItem>
                        data={filteredItems}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={ListFooter}
                        // ── Pagination ───────────────────────────────────────
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.4}   // trigger when 40% from bottom
                        // ── Performance ──────────────────────────────────────
                        removeClippedSubviews
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        initialNumToRender={8}
                        getItemLayout={(_data, index) => ({
                            length: ROW_H,
                            offset: ROW_H * Math.floor(index / 2),
                            index,
                        })}
                    />
                )}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default OutfitScreen;