import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    StatusBar,
    Animated,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Shuffle,
    Plus,
    Shirt,
    RefreshCw,
    Sparkles,
    Search,
    Heart,
} from 'lucide-react-native';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
} from '@react-native-firebase/firestore';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_GAP   = 12;
const CARD_WIDTH = (SCREEN_W - 32 - CARD_GAP) / 2;

// ─── Types ────────────────────────────────────────────────────────────────────

type ClosetItem = {
    id:        string;
    title:     string;
    category:  string;
    color:     string;
    imageURL:  string;
    userId:    string;
    likeCount: number;
    createdAt: any;
};

type StylePrefs = {
    styles:    string[];
    occasions: string[];
    colors:    string[];
};

type Outfit = {
    id:       string;
    name:     string;
    occasion: string;
    items:    ClosetItem[];
};

// ─── Filter tabs — emoji সরিয়ে দিলাম, শুধু text ──────────────────────────────
const FILTER_TABS = [
    { id: 'all',     label: 'All'      },
    { id: 'casual',  label: 'Casual'   },
    { id: 'gym',     label: 'Gym'      },
    { id: 'formal',  label: 'Formal'   },
    { id: 'night',   label: 'Night Out'},
    { id: 'weekend', label: 'Weekend'  },
];

const OUTFIT_NAMES: Record<string, string[]> = {
    all:     ['Everyday Look', 'Daily Fit', 'Go-To Outfit', 'Fresh Combo'],
    casual:  ['Chill Vibes', 'Weekend Casual', 'Laid-Back Look'],
    gym:     ['Gym Session', 'Workout Ready', 'Active Mode'],
    formal:  ['Office Ready', 'Business Look', 'Smart Formal'],
    night:   ['Night Out', 'Evening Glam', 'Party Mode'],
    weekend: ['Weekend Mood', 'Sunday Fit', 'Brunch Ready'],
};

const FILTER_KEYWORDS: Record<string, string[]> = {
    gym:     ['gym', 'sport', 'active', 'athletic', 'workout'],
    formal:  ['formal', 'business', 'office', 'suit', 'blazer'],
    night:   ['night', 'party', 'evening', 'dress'],
    weekend: ['casual', 'weekend', 'relax', 'denim'],
    casual:  ['casual', 'basic', 't-shirt', 'jeans', 'tee'],
};

function colorMatches(itemColor: string, prefColors: string[]): boolean {
    if (!prefColors || prefColors.length === 0) return true;
    const c = itemColor.toLowerCase();
    return prefColors.some(p => c.includes(p.toLowerCase()) || p.toLowerCase().includes(c));
}

function generateOutfits(
    items: ClosetItem[],
    filter: string,
    stylePrefs: StylePrefs | null,
    count = 3,
): { outfits: Outfit[]; notEnough: boolean } {

    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    let pool = items;

    if (stylePrefs && filter !== 'all') {
        const prefStylesLower = (stylePrefs.styles ?? []).map(s => s.toLowerCase());
        const filterInPrefs = prefStylesLower.some(s =>
            s.includes(filter) || filter.includes(s)
        );
        if (!filterInPrefs) return { outfits: [], notEnough: true };

        const keywords = FILTER_KEYWORDS[filter] ?? [];
        const filtered = items.filter(i =>
            keywords.some(k =>
                (i.category ?? '').toLowerCase().includes(k) ||
                (i.title ?? '').toLowerCase().includes(k)
            )
        );
        pool = filtered.length >= 2 ? filtered : items;
    }

    if (stylePrefs?.colors?.length) {
        const colorFiltered = pool.filter(i => colorMatches(i.color, stylePrefs.colors));
        pool = colorFiltered.length >= 2 ? colorFiltered : pool;
    }

    if (pool.length < 2) return { outfits: [], notEnough: true };

    const tops    = pool.filter(i => /top|shirt|tee|blouse|hoodie|sweater|jacket|coat|outerwear/i.test(i.category));
    const bottoms = pool.filter(i => /bottom|pant|jean|skirt|short|trouser/i.test(i.category));
    const shoes   = pool.filter(i => /shoe|sneaker|boot|sandal|footwear/i.test(i.category));

    const outfits: Outfit[] = [];
    const usedCombos = new Set<string>();
    const names  = OUTFIT_NAMES[filter] ?? OUTFIT_NAMES.all;
    const occasion = FILTER_TABS.find(t => t.id === filter)?.label ?? 'Everyday';

    for (let attempt = 0; attempt < 30 && outfits.length < count; attempt++) {
        const top    = shuffle(tops)[0];
        const bottom = shuffle(bottoms)[0];
        const shoe   = shuffle(shoes)[0];
        const comboItems = [top, bottom, shoe].filter(Boolean) as ClosetItem[];
        if (comboItems.length < 1) continue;
        const key = comboItems.map(i => i.id).sort().join('|');
        if (usedCombos.has(key)) continue;
        usedCombos.add(key);
        outfits.push({
            id:       `outfit-${Date.now()}-${outfits.length}`,
            name:     names[outfits.length % names.length],
            occasion,
            items:    comboItems,
        });
    }

    if (outfits.length === 0) {
        const shuffled = shuffle(pool);
        for (let i = 0; i < Math.min(count, shuffled.length); i++) {
            const comboItems = shuffled.slice(i, i + Math.min(3, shuffled.length - i));
            if (comboItems.length === 0) break;
            outfits.push({
                id:       `outfit-fallback-${i}`,
                name:     names[i % names.length],
                occasion,
                items:    comboItems,
            });
        }
    }

    return { outfits, notEnough: outfits.length === 0 };
}

// ─── ItemCard ─────────────────────────────────────────────────────────────────

const ItemCard: React.FC<{ item: ClosetItem }> = React.memo(({ item }) => {
    const count = item.likeCount ?? 0;
    return (
        <View style={cardStyles.card}>
            <View style={cardStyles.imageWrapper}>
                {item.imageURL ? (
                    <Image source={{ uri: item.imageURL }} style={cardStyles.image} resizeMode="cover" />
                ) : (
                    <View style={cardStyles.imageFallback}>
                        <Shirt size={28} color="#CBD5E1" />
                    </View>
                )}
            </View>
            <View style={cardStyles.info}>
                <Text style={cardStyles.title} numberOfLines={1}>{item.title}</Text>
                <View style={cardStyles.metaRow}>
                    <Text style={cardStyles.meta} numberOfLines={1}>
                        {item.category ?? '—'} · {item.color ?? '—'}
                    </Text>
                    {count > 0 && (
                        <View style={cardStyles.badge}>
                            <Heart size={10} color="#ef4444" fill="#ef4444" strokeWidth={0} />
                            <Text style={cardStyles.badgeText}>
                                {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
});

// ─── OutfitCard ───────────────────────────────────────────────────────────────

const OutfitCard: React.FC<{ outfit: Outfit; index: number }> = ({ outfit, index }) => {
    const slideAnim = useRef(new Animated.Value(40)).current;
    const fadeAnim  = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim,  { toValue: 1, duration: 350, delay: index * 120, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 8,   delay: index * 120, useNativeDriver: true }),
        ]).start();
    }, [outfit.id]);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.outfitCardHeader}>
                <View style={styles.outfitHeaderLeft}>
                    <View style={styles.outfitIndexBadge}>
                        <Text style={styles.outfitIndexText}>{index + 1}</Text>
                    </View>
                    <View>
                        <Text style={styles.outfitName}>{outfit.name}</Text>
                        <Text style={styles.outfitOccasion}>{outfit.occasion} · {outfit.items.length} pieces</Text>
                    </View>
                </View>
            </View>
            <View style={styles.outfitItemsGrid}>
                {outfit.items.map(item => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </View>
        </Animated.View>
    );
};

// ─── FilterTab — ────────────────────────────

const FilterTab: React.FC<{
    tab: typeof FILTER_TABS[0];
    selected: boolean;
    onPress: () => void;
}> = ({ tab, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.filterTab, selected && styles.filterTabSelected]}
        onPress={onPress}
        activeOpacity={0.75}
    >
        <Text style={[styles.filterTabLabel, selected && styles.filterTabLabelSelected]}>
            {tab.label}
        </Text>
    </TouchableOpacity>
);



const NotEnoughState: React.FC<{
    onAdd:  () => void;
    filter: string;
    prefs:  StylePrefs | null;
}> = ({ onAdd, filter, prefs }) => {
    const bounceAnim = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, { toValue: 1.08, duration: 700, useNativeDriver: true }),
                Animated.timing(bounceAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const filterLabel = FILTER_TABS.find(t => t.id === filter)?.label ?? filter;
    const prefStylesLower = (prefs?.styles ?? []).map(s => s.toLowerCase());
    const filterInPrefs   = filter === 'all' || prefStylesLower.some(s =>
        s.includes(filter) || filter.includes(s)
    );
    const msg = !filterInPrefs
        ? `"${filterLabel}" isn't in your style preferences.`
        : prefs?.colors?.length
        ? `Not enough items matching your favorite colors for "${filterLabel}" outfits.`
        : `Not enough "${filterLabel}" items in your closet.\nAdd more to unlock outfit suggestions!`;

    return (
        <View style={styles.emptyState}>
            <Animated.View style={[styles.emptyIconWrap, { transform: [{ scale: bounceAnim }] }]}>
                <Shirt size={48} color="#CBD5E1" />
            </Animated.View>
            <Text style={styles.emptyTitle}>Add more items to get{'\n'}better outfit suggestions.</Text>
            <Text style={styles.emptyMsg}>{msg}</Text>
            <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.85}>
                <Plus size={16} color="#fff" />
                <Text style={styles.addBtnText}>Add Items to Closet</Text>
            </TouchableOpacity>
        </View>
    );
};



const AIChatScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const app  = getApp();
    const db   = getFirestore(app);
    const user = getAuth(app).currentUser;

    const [closetItems,  setClosetItems]  = useState<ClosetItem[]>([]);
    const [stylePrefs,   setStylePrefs]   = useState<StylePrefs | null>(null);
    const [outfits,      setOutfits]      = useState<Outfit[]>([]);
    const [notEnough,    setNotEnough]    = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading,      setLoading]      = useState(true);
    const [generating,   setGenerating]   = useState(false);

    const spinAnim = useRef(new Animated.Value(0)).current;
    const startSpin = () => {
        spinAnim.setValue(0);
        Animated.timing(spinAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    };
    const spinDeg = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const q    = query(collection(db, 'closetItems'), where('userId', '==', user.uid));
                const snap = await getDocs(q);
                const items: ClosetItem[] = snap.docs.map(d => ({
                    id: d.id, likeCount: 0, ...(d.data() as any),
                }));
                setClosetItems(items);

                const prefsSnap = await getDoc(doc(db, 'stylePrefs', user.uid));
                const prefs = prefsSnap.exists() ? (prefsSnap.data() as StylePrefs) : null;
                setStylePrefs(prefs);

                const result = generateOutfits(items, 'all', prefs);
                setOutfits(result.outfits);
                setNotEnough(result.notEnough);
            } catch (err) {
                console.error('[QuickFit] fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.uid]);

    const handleGenerate = useCallback((filter: string = activeFilter) => {
        setGenerating(true);
        startSpin();
        setTimeout(() => {
            const result = generateOutfits(closetItems, filter, stylePrefs);
            setOutfits(result.outfits);
            setNotEnough(result.notEnough);
            setGenerating(false);
        }, 500);
    }, [closetItems, activeFilter, stylePrefs]);

    const handleFilterChange = (filterId: string) => {
        setActiveFilter(filterId);
        handleGenerate(filterId);
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Quick Fit</Text>
                    <Text style={styles.headerSub}>
                        {loading
                            ? 'Loading your closet…'
                            : `${closetItems.length} items · ${outfits.length} outfits`}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.shuffleBtn, generating && styles.shuffleBtnDisabled]}
                    onPress={() => handleGenerate()}
                    disabled={generating}
                    activeOpacity={0.8}
                >
                    <Animated.View style={{ transform: [{ rotate: spinDeg }] }}>
                        <Shuffle size={18} color="#1E293B" />
                    </Animated.View>
                    <Text style={styles.shuffleBtnText}>Outfit Generate</Text>
                </TouchableOpacity>
            </View>

            {/* Style prefs banner */}
            {stylePrefs && stylePrefs.styles?.length > 0 && (
                <View style={styles.prefsBanner}>
                    <Sparkles size={12} color="#2869BD" />
                    <Text style={styles.prefsBannerText}>
                        Your style: {stylePrefs.styles.slice(0, 3).join(' · ')}
                        {stylePrefs.colors?.length
                            ? `  ·  Colors: ${stylePrefs.colors.slice(0, 3).join(', ')}`
                            : ''}
                    </Text>
                </View>
            )}

            {/* ── Filter tabs ── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
                style={styles.filterScroll}
            >
                {FILTER_TABS.map(tab => (
                    <FilterTab
                        key={tab.id}
                        tab={tab}
                        selected={activeFilter === tab.id}
                        onPress={() => handleFilterChange(tab.id)}
                    />
                ))}
            </ScrollView>

            {/* Body */}
            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" color="#2869BD" />
                    <Text style={styles.loadingText}>Syncing your closet…</Text>
                </View>
            ) : notEnough ? (
                <NotEnoughState
                    filter={activeFilter}
                    prefs={stylePrefs}
                    onAdd={() => navigation.navigate('Additem')}
                />
            ) : (
                <FlatList
                    data={outfits}
                    keyExtractor={o => o.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        generating ? (
                            <View style={styles.generatingRow}>
                                <ActivityIndicator size="small" color="#2869BD" />
                                <Text style={styles.generatingText}>Finding combinations…</Text>
                            </View>
                        ) : null
                    }
                    renderItem={({ item, index }) => (
                        <OutfitCard outfit={item} index={index} />
                    )}
                    ListEmptyComponent={
                        <NotEnoughState
                            filter={activeFilter}
                            prefs={stylePrefs}
                            onAdd={() => navigation.navigate('AddItemScreen')}
                        />
                    }
                    ListFooterComponent={
                        outfits.length > 0 ? (
                            <TouchableOpacity
                                style={styles.reshuffleFooter}
                                onPress={() => handleGenerate()}
                                activeOpacity={0.8}
                            >
                                <RefreshCw size={14} color="#2869BD" />
                                <Text style={styles.reshuffleFooterText}>Try different combinations</Text>
                            </TouchableOpacity>
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },

    header: {
        flexDirection:     'row',
        alignItems:        'center',
        justifyContent:    'space-between',
        paddingHorizontal: 20,
        paddingVertical:   14,
    },
    headerTitle: {
        fontSize:      22,
        fontFamily:    'InterBold',
        fontWeight:    '700',
        color:         '#0F172A',
        letterSpacing: -0.5,
    },
    headerSub: {
        fontSize:   12,
        fontFamily: 'InterRegular',
        color:      '#94A3B8',
        marginTop:   2,
    },

    shuffleBtn: {
        flexDirection:     'row',
        alignItems:        'center',
        gap:               6,
        backgroundColor:   '#F1F5F9',
        paddingHorizontal: 14,
        paddingVertical:    9,
        borderRadius:      24,
        borderWidth:        1,
        borderColor:       '#E2E8F0',
    },
    shuffleBtnDisabled: { opacity: 0.5 },
    shuffleBtnText: {
        fontSize:   13,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color:      '#1E293B',
    },

    prefsBanner: {
        flexDirection:     'row',
        alignItems:        'center',
        gap:               6,
        marginHorizontal:  20,
        marginBottom:       8,
        backgroundColor:   '#EBF1FB',
        paddingHorizontal: 12,
        paddingVertical:    7,
        borderRadius:      10,
    },
    prefsBannerText: {
        fontSize:      12,
        fontFamily:    'InterMedium',
        color:         '#2869BD',
        fontWeight:    '500',
        textTransform: 'capitalize',
        flexShrink:     1,
    },

    // ── Filter tabs — clean, text-only, fixed height ──────────────────────────
    filterScroll: {
        flexGrow:  0,
        flexShrink: 0,
    },
    filterRow: {
        paddingHorizontal: 16,
        paddingVertical:   10,
        gap:                8,
        flexDirection:     'row',
        alignItems:        'center',
    },
    filterTab: {
        height:            36,
        paddingHorizontal: 16,
        borderRadius:      18,
        backgroundColor:   '#F1F5F9',
        borderWidth:        1.5,
        borderColor:       '#E2E8F0',
        alignItems:        'center',
        justifyContent:    'center',
    },
    filterTabSelected: {
        backgroundColor: '#EBF1FB',
        borderColor:     '#2869BD',
    },
    filterTabLabel: {
        fontSize:   13,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color:      '#64748B',
        lineHeight: 16,
    },
    filterTabLabelSelected: {
        color:      '#2869BD',
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
    },

    loadingWrap: {
        flex:           1,
        alignItems:     'center',
        justifyContent: 'center',
        gap:            12,
    },
    loadingText: {
        fontSize:   14,
        fontFamily: 'InterRegular',
        color:      '#94A3B8',
    },

    generatingRow: {
        flexDirection:   'row',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             8,
        paddingVertical: 12,
    },
    generatingText: {
        fontSize:   13,
        fontFamily: 'InterMedium',
        color:      '#94A3B8',
    },

    listContent: {
        paddingHorizontal: 16,
        paddingTop:         8,
        paddingBottom:     40,
        gap:               16,
    },

    outfitCardHeader: {
        flexDirection:   'row',
        alignItems:      'center',
        justifyContent:  'space-between',
        marginBottom:    14,
    },
    outfitHeaderLeft: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           10,
    },
    outfitIndexBadge: {
        width:           28,
        height:          28,
        borderRadius:    14,
        backgroundColor: '#EBF1FB',
        alignItems:      'center',
        justifyContent:  'center',
    },
    outfitIndexText: {
        fontSize:   13,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color:      '#2869BD',
    },
    outfitName: {
        fontSize:   15,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color:      '#0F172A',
    },
    outfitOccasion: {
        fontSize:   12,
        fontFamily: 'InterRegular',
        color:      '#94A3B8',
        marginTop:   1,
    },

    outfitItemsGrid: {
        flexDirection: 'row',
        flexWrap:      'wrap',
        gap:           CARD_GAP,
    },

    reshuffleFooter: {
        flexDirection:   'row',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             6,
        marginTop:        8,
        paddingVertical: 14,
    },
    reshuffleFooterText: {
        fontSize:   13,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color:      '#2869BD',
    },

    emptyState: {
        flex:              1,
        alignItems:        'center',
        justifyContent:    'center',
        paddingHorizontal: 40,
        paddingVertical:   60,
        gap:               14,
    },
    emptyIconWrap: {
        width:           80,
        height:          80,
        borderRadius:    40,
        backgroundColor: '#F1F5F9',
        alignItems:      'center',
        justifyContent:  'center',
        marginBottom:     4,
    },
    emptyTitle: {
        fontSize:   16,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color:      '#1E293B',
        textAlign:  'center',
        lineHeight: 22,
    },
    emptyMsg: {
        fontSize:   13,
        fontFamily: 'InterRegular',
        color:      '#94A3B8',
        textAlign:  'center',
        lineHeight: 19,
    },
    addBtn: {
        flexDirection:     'row',
        alignItems:        'center',
        gap:               8,
        backgroundColor:   '#2869BD',
        paddingHorizontal: 20,
        paddingVertical:   12,
        borderRadius:      14,
        marginTop:          8,
    },
    addBtnText: {
        fontSize:   14,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color:      '#FFFFFF',
    },
});

const cardStyles = StyleSheet.create({
    card: {
        width:           CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius:    16,
        overflow:        'hidden',
        shadowColor:     '#1e293b',
        shadowOffset:    { width: 0, height: 2 },
        shadowOpacity:   0.07,
        shadowRadius:    8,
        elevation:        3,
    },
    imageWrapper: {
        width:           '100%',
        height:          CARD_WIDTH,
        backgroundColor: '#f1f5f9',
    },
    image:       { width: '100%', height: '100%' },
    imageFallback: {
        width:           '100%',
        height:          '100%',
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: '#f1f5f9',
    },
    info: {
        paddingHorizontal: 10,
        paddingTop:         8,
        paddingBottom:     10,
    },
    title: {
        fontSize:     13,
        fontWeight:   '600',
        color:        '#0f172a',
        marginBottom:  4,
    },
    metaRow: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'space-between',
    },
    meta: {
        fontSize:   11,
        color:      '#94a3b8',
        fontWeight: '400',
        flexShrink:  1,
        marginRight: 6,
    },
    badge: {
        flexDirection:     'row',
        alignItems:        'center',
        gap:               3,
        backgroundColor:   '#fef2f2',
        borderRadius:      99,
        paddingHorizontal: 6,
        paddingVertical:    2,
    },
    badgeText: { fontSize: 10, fontWeight: '700', color: '#ef4444' },
});

export default AIChatScreen;