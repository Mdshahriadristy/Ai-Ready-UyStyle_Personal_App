import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Plus,
    Eye,
    Save,
    X,
    CheckCircle2,
    ShoppingBag,
    Tag,
    XIcon,
} from 'lucide-react-native';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    writeBatch,
    getDocs,
} from '@react-native-firebase/firestore';

// ─── Dimensions ───────────────────────────────────────────────────────────────

const { width } = Dimensions.get('window');
const H_PAD     = 20;
const SLOT_GAP  = 10;
const CARD_INNER = width - H_PAD * 2 - 28;
const SLOT_W    = (CARD_INNER - SLOT_GAP * 2) / 3;
const SLOT_H    = SLOT_W;

// ─── Types ────────────────────────────────────────────────────────────────────

type ClosetItem = {
    id:        string;
    title:     string;
    category:  string;
    color:     string;
    imageURL:  string;
    createdAt?: any;
};

type OutfitSlot = {
    id:        string;
    label:     string;
    isDefault: boolean;
    createdAt?: any;
};

type SlotMap = Record<string, ClosetItem | null>;

// ─── Default outfit slots ─────────────────────────────────────────────────────

const DEFAULT_SLOTS: OutfitSlot[] = [
    { id: 'Top',       label: 'Top',       isDefault: true },
    { id: 'Bottom',    label: 'Bottom',    isDefault: true },
    { id: 'Shoes',     label: 'Shoes',     isDefault: true },
    { id: 'Outerwear', label: 'Outerwear', isDefault: true },
    { id: 'Accessory', label: 'Accessory', isDefault: true },
];

const resolveSlot = (category: string, slots: OutfitSlot[]): string => {
    const cat = (category ?? '').toLowerCase().trim();
    const exact = slots.find(s => s.label.toLowerCase() === cat);
    if (exact) return exact.id;
    if (/top|shirt|sweater|blouse|tee|knit/.test(cat))        return 'Top';
    if (/bottom|jean|trouser|pant|skirt|short/.test(cat))     return 'Bottom';
    if (/shoe|sneaker|boot|loafer|heel|sandal/.test(cat))     return 'Shoes';
    if (/outer|coat|jacket|blazer|trench/.test(cat))          return 'Outerwear';
    for (const s of slots) {
        if (!s.isDefault && cat.includes(s.label.toLowerCase())) return s.id;
    }
    return 'Accessory';
};

const QUICK_PICKS = ['Hat', 'Bag', 'Watch', 'Scarf', 'Belt', 'Sunglasses', 'Jewelry', 'Socks'];

// ─── Component ────────────────────────────────────────────────────────────────

const CombineScreen = ({ navigation }: any) => {

    const app  = getApp();
    const auth = getAuth(app);
    const db   = getFirestore(app);
    const user = auth.currentUser;

    const [closetItems, setClosetItems]       = useState<ClosetItem[]>([]);
    const [customSlots, setCustomSlots]       = useState<OutfitSlot[]>([]);
    const [loadingItems, setLoadingItems]     = useState(true);
    const [loadingSlots, setLoadingSlots]     = useState(true);
    const [saving, setSaving]                 = useState(false);
    const [activeTab, setActiveTab]           = useState('All');
    const [showModal, setShowModal]           = useState(false);
    const [newSlotName, setNewSlotName]       = useState('');
    const [creating, setCreating]             = useState(false);
    const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
    const [pressedSlotId, setPressedSlotId]   = useState<string | null>(null);
    const [slotMap, setSlotMap]               = useState<SlotMap>(() =>
        Object.fromEntries(DEFAULT_SLOTS.map(s => [s.id, null]))
    );

    const allSlots = useMemo<OutfitSlot[]>(
        () => [...DEFAULT_SLOTS, ...customSlots],
        [customSlots],
    );

    // ── Firebase: closet items ───────────────────────────────────────────────

    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'closetItems'),
            where('userId', '==', user.uid),
        );
        return onSnapshot(
            q,
            snap => {
                const items: ClosetItem[] = snap.docs.map(d => ({
                    id: d.id,
                    ...(d.data() as any),
                }));
                // Sort newest-first client-side
                items.sort((a, b) => {
                    const ta = a.createdAt?.toMillis?.() ?? 0;
                    const tb = b.createdAt?.toMillis?.() ?? 0;
                    return tb - ta;
                });
                setClosetItems(items);
                setLoadingItems(false);
            },
            err => {
                console.warn('closetItems snapshot error:', err);
                setLoadingItems(false);
            },
        );
    }, [user?.uid]);

    // ── Firebase: custom slots ───────────────────────────────────────────────
    // FIX: Removed orderBy('createdAt') — sorting client-side to avoid
    //      requiring a Firestore composite index on (userId + createdAt).
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'outfitSlots'),
            where('userId', '==', user.uid),
        );
        return onSnapshot(
            q,
            snap => {
                const slots: OutfitSlot[] = snap.docs.map(d => ({
                    id:        d.id,
                    label:     (d.data() as any).label,
                    isDefault: false,
                    createdAt: (d.data() as any).createdAt,
                }));
                // Sort oldest-first client-side
                slots.sort((a, b) => {
                    const ta = a.createdAt?.toMillis?.() ?? 0;
                    const tb = b.createdAt?.toMillis?.() ?? 0;
                    return ta - tb;
                });
                setCustomSlots(slots);
                setSlotMap(prev => {
                    const next = { ...prev };
                    slots.forEach(s => { if (!(s.id in next)) next[s.id] = null; });
                    return next;
                });
                setLoadingSlots(false);
            },
            err => {
                console.warn('outfitSlots snapshot error:', err);
                setLoadingSlots(false);
            },
        );
    }, [user?.uid]);

    // ── Category tabs ────────────────────────────────────────────────────────
    const categoryTabs = useMemo(() => {
        const fromItems = Array.from(new Set(closetItems.map(i => i.category).filter(Boolean)));
        const fromSlots = customSlots.map(s => s.label);
        return ['All', ...Array.from(new Set([...fromItems, ...fromSlots]))];
    }, [closetItems, customSlots]);

    const filteredItems = useMemo(
        () => activeTab === 'All' ? closetItems : closetItems.filter(i => i.category === activeTab),
        [closetItems, activeTab],
    );

    const handleSelectItem = useCallback((item: ClosetItem) => {
        const slotId = resolveSlot(item.category, allSlots);
        setSlotMap(prev => ({
            ...prev,
            [slotId]: prev[slotId]?.id === item.id ? null : item,
        }));
    }, [allSlots]);

    const handleSlotPress = (slot: OutfitSlot) => {
        if (slotMap[slot.id]) {
            setSlotMap(prev => ({ ...prev, [slot.id]: null }));
        } else {
            const match = categoryTabs.find(t =>
                t.toLowerCase().includes(slot.label.toLowerCase()) ||
                slot.label.toLowerCase().includes(t.toLowerCase())
            ) ?? 'All';
            setActiveTab(match);
        }
    };

    const isSelected    = (item: ClosetItem) => Object.values(slotMap).some(s => s?.id === item.id);
    const selectedCount = Object.values(slotMap).filter(Boolean).length;
    const clearAll      = () => setSlotMap(Object.fromEntries(allSlots.map(s => [s.id, null])));

    // ── Delete custom slot ────────────────────────────────────────────────────
    const handleDeleteSlot = (slot: OutfitSlot) => {
        if (slot.isDefault) return;

        Alert.alert(
            `Delete "${slot.label}"?`,
            'This slot and any outfit references to it will be removed.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        if (!user) return;
                        try {
                            setDeletingSlotId(slot.id);

                            await deleteDoc(doc(db, 'outfitSlots', slot.id));

                            const outfitsQ = query(
                                collection(db, 'outfits'),
                                where('userId', '==', user.uid),
                            );
                            const outfitsSnap = await getDocs(outfitsQ);
                            const batch = writeBatch(db);
                            outfitsSnap.docs.forEach(outfitDoc => {
                                const data = outfitDoc.data() as any;
                                if (data.slots && data.slots[slot.id] !== undefined) {
                                    const updatedSlots = { ...data.slots };
                                    const removedItemId = updatedSlots[slot.id];
                                    delete updatedSlots[slot.id];
                                    const updatedItems = (data.items ?? []).filter(
                                        (id: string) => id !== removedItemId,
                                    );
                                    batch.update(outfitDoc.ref, {
                                        slots: updatedSlots,
                                        items: updatedItems,
                                    });
                                }
                            });
                            await batch.commit();

                            setSlotMap(prev => {
                                const next = { ...prev };
                                delete next[slot.id];
                                return next;
                            });

                            if (activeTab === slot.label) setActiveTab('All');

                        } catch (err) {
                            console.warn(err);
                            Alert.alert('Error', 'Could not delete slot. Try again.');
                        } finally {
                            setDeletingSlotId(null);
                        }
                    },
                },
            ],
        );
    };

    // ── Create new slot ───────────────────────────────────────────────────────
    const handleAddSlot = async () => {
        const label = newSlotName.trim();
        if (!label) return Alert.alert('Required', 'Enter a slot name.');
        if (!user)  return Alert.alert('Error', 'Not signed in.');
        if (allSlots.some(s => s.label.toLowerCase() === label.toLowerCase()))
            return Alert.alert('Duplicate', `"${label}" already exists.`);
        try {
            setCreating(true);
            await addDoc(collection(db, 'outfitSlots'), {
                userId:    user.uid,
                label,
                createdAt: serverTimestamp(),
            });
            setNewSlotName('');
            setShowModal(false);
        } catch (err) {
            console.warn(err);
            Alert.alert('Error', 'Could not create slot. Try again.');
        } finally {
            setCreating(false);
        }
    };

    // ── Save look ─────────────────────────────────────────────────────────────
    const handleSaveLook = async () => {
        if (selectedCount === 0) return Alert.alert('Empty', 'Add at least one item to your look.');
        if (!user)               return Alert.alert('Error', 'Not signed in.');
        try {
            setSaving(true);
            const itemIds  = Object.values(slotMap).filter(Boolean).map(i => i!.id);
            const slotsObj = Object.fromEntries(
                Object.entries(slotMap).filter(([, v]) => v).map(([k, v]) => [k, v!.id])
            );
            await addDoc(collection(db, 'outfits'), {
                userId:    user.uid,
                items:     itemIds,
                slots:     slotsObj,
                createdAt: serverTimestamp(),
            });
            Alert.alert(
                '✓ Saved Look!',
                `${itemIds.length} piece${itemIds.length > 1 ? 's' : ''} saved to Outfits`,
                [
                    { text: 'Go Back',    onPress: () => navigation.goBack() },
                    { text: 'New Outfit', onPress: clearAll, style: 'cancel' },
                ],
            );
        } catch (err) {
            console.warn(err);
            Alert.alert('Error', 'Save failed. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // ── Grid builder ──────────────────────────────────────────────────────────
    type GridCell = OutfitSlot | 'ADD_NEW' | 'EMPTY';
    const buildRows = (): GridCell[][] => {
        const cells: GridCell[] = [...allSlots, 'ADD_NEW'];
        const rows: GridCell[][] = [];
        for (let i = 0; i < cells.length; i += 3) {
            const row = cells.slice(i, i + 3);
            while (row.length < 3) row.push('EMPTY');
            rows.push(row as GridCell[]);
        }
        return rows;
    };
    const gridRows = buildRows();
    const loading  = loadingItems || loadingSlots;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <SafeAreaView style={s.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* ══ HEADER ══ */}
            <View style={s.header}>
                <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                    <ArrowLeft size={20} color="#0F1729" />
                    <Text style={s.headerTitle}>Combine</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.headerAddBtn} onPress={() => setShowModal(true)} activeOpacity={0.8}>
                    <Plus size={18} color="#0F1729" />
                </TouchableOpacity>
            </View>

            {/* ══ BODY ══ */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

                {/* ── Outfit builder grid ── */}
                <View style={s.gridCard}>
                    {gridRows.map((row, ri) => (
                        <View key={ri} style={s.slotRow}>
                            {row.map((cell, ci) => {

                                if (cell === 'ADD_NEW') return (
                                    <TouchableOpacity
                                        key="add_new"
                                        style={[s.slot, s.slotAddNew]}
                                        onPress={() => setShowModal(true)}
                                        activeOpacity={0.8}
                                    >
                                        <Plus size={16} color="#2869BD" />
                                        <Text style={s.slotAddNewTxt}>Add new</Text>
                                    </TouchableOpacity>
                                );

                                if (cell === 'EMPTY') return (
                                    <View key={`e${ci}`} style={[s.slot, { borderColor: 'transparent', backgroundColor: 'transparent' }]} />
                                );

                                const slot       = cell as OutfitSlot;
                                const filled     = slotMap[slot.id];
                                const isDeleting = deletingSlotId === slot.id;
                                const isPressed  = pressedSlotId === slot.id;

                                return (
                                    <View key={slot.id} style={{ position: 'relative', width: SLOT_W, height: SLOT_H }}>
                                        <TouchableOpacity
                                            style={[s.slot, { width: '100%', height: '100%' }, filled && s.slotFilled]}
                                            onPress={() => {
                                                if (!slot.isDefault && !filled) {
                                                    setPressedSlotId(prev => prev === slot.id ? null : slot.id);
                                                } else {
                                                    setPressedSlotId(null);
                                                    handleSlotPress(slot);
                                                }
                                            }}
                                            activeOpacity={0.85}
                                        >
                                            {isDeleting ? (
                                                <ActivityIndicator size="small" />
                                            ) : filled ? (
                                                <>
                                                    <Image source={{ uri: filled.imageURL }} style={s.slotImg} resizeMode="cover" />
                                                    <View style={s.slotPill}>
                                                        <Text style={s.slotPillTxt}>{slot.label}</Text>
                                                    </View>
                                                    <View style={s.slotClearDot}>
                                                        <X size={7} color="#fff" />
                                                    </View>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={15} color="#94A3B8" />
                                                    <Text style={s.slotEmptyTxt}>{slot.label}</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>

                                        {!slot.isDefault && isPressed && (
                                            <TouchableOpacity
                                                style={s.slotDeleteCornerBtn}
                                                onPress={() => {
                                                    setPressedSlotId(null);
                                                    handleDeleteSlot(slot);
                                                }}
                                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                                activeOpacity={0.75}
                                            >
                                                <XIcon size={15} color="#e71111" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ))}

                    {selectedCount > 0 && (
                        <View style={s.gridFooter}>
                            <Text style={s.gridFooterCount}>{selectedCount} item{selectedCount > 1 ? 's' : ''} added</Text>
                            <TouchableOpacity onPress={clearAll}>
                                <Text style={s.gridClearTxt}>Clear all</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* ── Category tabs ── */}
                {!loading && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={s.tabsWrap}
                        style={s.tabsScroll}
                    >
                        {categoryTabs.map(cat => {
                            const isActive = activeTab === cat;
                            return (
                                <TouchableOpacity
                                    key={cat}
                                    style={[s.tab, isActive && s.tabActive]}
                                    onPress={() => setActiveTab(cat)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[s.tabTxt, isActive && s.tabTxtActive]}>{cat}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                )}

                {/* ── Items grid ── */}
                {loading ? (
                    <View style={s.centerBox}>
                        <ActivityIndicator size="large" color="#2869BD" />
                        <Text style={s.centerTxt}>Loading closet…</Text>
                    </View>
                ) : filteredItems.length === 0 ? (
                    <View style={s.centerBox}>
                        <View style={s.emptyIcon}><ShoppingBag size={30} color="#CBD5E1" /></View>
                        <Text style={s.emptyTitle}>No items here</Text>
                        <Text style={s.emptySub}>Add clothes to your closet first</Text>
                    </View>
                ) : (
                    <View style={s.itemsGrid}>
                        {filteredItems.map(item => {
                            const sel    = isSelected(item);
                            const slotId = resolveSlot(item.category, allSlots);
                            const slot   = allSlots.find(sl => sl.id === slotId);

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[s.itemCard, sel && s.itemCardSel]}
                                    onPress={() => handleSelectItem(item)}
                                    activeOpacity={0.85}
                                >
                                    <View style={s.itemImgBox}>
                                        <Image source={{ uri: item.imageURL }} style={s.itemImg} resizeMode="cover" />
                                        {sel && (
                                            <View style={s.itemOverlay}>
                                                <View style={s.itemBadge}>
                                                    <CheckCircle2 size={11} color="#fff" />
                                                    <Text style={s.itemBadgeTxt}>{slot?.label ?? 'Added'}</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                    <View style={s.itemInfo}>
                                        <Text style={s.itemTitle} numberOfLines={1}>{item.title}</Text>
                                        <Text style={s.itemCat}>{item.category}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            {/* ══ BOTTOM BAR ══ */}
            <View style={s.bottomBar}>
                <TouchableOpacity
                    style={[s.previewBtn, selectedCount === 0 && s.btnOff]}
                    onPress={() =>
                        navigation.navigate('preview', {
                            items: Object.values(slotMap).filter(Boolean) as ClosetItem[],
                        })
                    }
                    disabled={selectedCount === 0}
                    activeOpacity={0.8}
                >
                    <Eye size={16} color={selectedCount === 0 ? '#CBD5E1' : '#0F1729'} />
                    <Text style={[s.previewTxt, selectedCount === 0 && s.disabledTxt]}>Preview</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[s.saveBtn, (saving || selectedCount === 0) && s.saveBtnOff]}
                                       onPress={() =>
                        navigation.navigate('saveSuccess', {
                            items: Object.values(slotMap).filter(Boolean) as ClosetItem[],
                        })
                    }
                    disabled={saving || selectedCount === 0}
                    activeOpacity={0.85}
                >
                    {saving
                        ? <ActivityIndicator color="#fff" size="small" />
                        : <><Save size={15} color="#fff" /><Text style={s.saveTxt}>Save Look</Text></>
                    }
                </TouchableOpacity>
            </View>

            {/* ══ ADD SLOT MODAL ══ */}
            <Modal
                visible={showModal}
                transparent
                animationType="slide"
                onRequestClose={() => { setShowModal(false); setNewSlotName(''); }}
            >
                <KeyboardAvoidingView
                    style={s.modalBg}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableOpacity
                        style={StyleSheet.absoluteFill}
                        activeOpacity={1}
                        onPress={() => { setShowModal(false); setNewSlotName(''); }}
                    />
                    <View style={s.sheet}>
                        <View style={s.sheetHandle} />
                        <View style={s.sheetTitleRow}>
                            <Text style={s.sheetTitle}>New Outfit Slot</Text>
                            <TouchableOpacity
                                style={s.sheetCloseBtn}
                                onPress={() => { setShowModal(false); setNewSlotName(''); }}
                            >
                                <X size={18} color="#565E74" />
                            </TouchableOpacity>
                        </View>
                        <Text style={s.sheetSub}>
                            Name this slot — it'll appear in your outfit grid and category tabs.
                        </Text>
                        <View style={s.inputBox}>
                            <Tag size={16} color="#2869BD" />
                            <TextInput
                                style={s.input}
                                placeholder="e.g. Hat, Bag, Watch…"
                                placeholderTextColor="#94A3B8"
                                value={newSlotName}
                                onChangeText={setNewSlotName}
                                autoFocus
                                returnKeyType="done"
                                onSubmitEditing={handleAddSlot}
                            />
                        </View>
                        <Text style={s.pickLabel}>QUICK PICKS</Text>
                        <View style={s.pickRow}>
                            {QUICK_PICKS.map(p => (
                                <TouchableOpacity
                                    key={p}
                                    style={[s.pickChip, newSlotName === p && s.pickChipOn]}
                                    onPress={() => setNewSlotName(p)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[s.pickChipTxt, newSlotName === p && s.pickChipTxtOn]}>{p}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={s.sheetBtns}>
                            <TouchableOpacity style={s.cancelBtn} onPress={() => { setShowModal(false); setNewSlotName(''); }}>
                                <Text style={s.cancelTxt}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[s.createBtn, creating && { opacity: 0.7 }]}
                                onPress={handleAddSlot}
                                disabled={creating}
                                activeOpacity={0.85}
                            >
                                {creating
                                    ? <ActivityIndicator color="#fff" size="small" />
                                    : <Text style={s.createTxt}>Create Slot</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({

    safe: { flex: 1, backgroundColor: '#fff' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: H_PAD,
        paddingVertical: 14,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#0F1729',
    },
    headerAddBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },

    scroll: { paddingBottom: 120 },

    gridCard: {
        marginHorizontal: H_PAD,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 14,
        gap: SLOT_GAP,
    },
    slotRow: { flexDirection: 'row', gap: SLOT_GAP },

    slot: {
        width: SLOT_W,
        height: SLOT_H,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed',
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        gap: 4,
    },
    slotFilled: {
        borderStyle: 'solid',
        borderColor: '#2869BD',
        borderWidth: 2,
        backgroundColor: '#fff',
    },
    slotImg: { ...StyleSheet.absoluteFill as any, width: '100%', height: '100%' },
    slotPill: {
        position: 'absolute',
        bottom: 5,
        left: 5,
        backgroundColor: 'rgba(40,105,189,0.88)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    slotPillTxt: {
        fontSize: 9,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.2,
    },
    slotClearDot: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 15,
        height: 15,
        borderRadius: 8,
        backgroundColor: 'rgba(239,68,68,0.85)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    slotDeleteCornerBtn: {
        position: 'absolute',
        top: -10,
        right: -8,
        width: 24,
        height: 24,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slotEmptyTxt: {
        fontSize: 10,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color: '#94A3B8',
    },
    slotAddNew: {
        borderColor: '#2869BD',
        borderStyle: 'dashed',
        backgroundColor: '#EBF1FB',
    },
    slotAddNewTxt: {
        fontSize: 10,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#2869BD',
    },

    gridFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 4,
        paddingHorizontal: 2,
    },
    gridFooterCount: { fontSize: 12, fontFamily: 'InterMedium', color: '#565E74' },
    gridClearTxt: { fontSize: 12, fontFamily: 'InterSemiBold', fontWeight: '600', color: '#EF4444' },

    tabsScroll: { marginTop: 18 },
    tabsWrap: { paddingHorizontal: H_PAD, gap: 8 },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
    },
    tabActive: { backgroundColor: '#2869BD', borderColor: '#2869BD' },
    tabTxt: { fontSize: 13, fontFamily: 'InterMedium', fontWeight: '500', color: '#565E74' },
    tabTxtActive: { fontFamily: 'InterSemiBold', fontWeight: '600', color: '#fff' },

    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
        marginTop: 16,
    },
    itemCard: {
        width: '47%',
        backgroundColor: '#F8F9FA',
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    itemCardSel: { borderColor: '#2869BD' },
    itemImgBox: { width: '100%', height: 150, position: 'relative' },
    itemImg: { width: '100%', height: '100%' },
    itemOverlay: {
        ...StyleSheet.absoluteFill as any,
        backgroundColor: 'rgba(40,105,189,0.20)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        padding: 7,
    },
    itemBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#2869BD',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    itemBadgeTxt: { fontSize: 10, fontFamily: 'InterBold', fontWeight: '700', color: '#fff' },
    itemInfo: { paddingHorizontal: 10, paddingVertical: 10, gap: 2 },
    itemTitle: { fontSize: 13, fontFamily: 'InterSemiBold', fontWeight: '600', color: '#0F1729' },
    itemCat: { fontSize: 11, fontFamily: 'InterRegular', color: '#94A3B8' },

    centerBox: { paddingVertical: 60, alignItems: 'center', gap: 12 },
    centerTxt: { fontSize: 13, fontFamily: 'InterRegular', color: '#94A3B8' },
    emptyIcon: {
        width: 64, height: 64, borderRadius: 18,
        backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
    },
    emptyTitle: { fontSize: 15, fontFamily: 'InterBold', fontWeight: '700', color: '#0F1729' },
    emptySub: { fontSize: 13, fontFamily: 'InterRegular', color: '#94A3B8' },

    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: H_PAD,
        paddingVertical: 14,
        paddingBottom: 30,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F0F1F3',
    },
    previewBtn: {
        flex: 1,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        paddingVertical: 15, borderRadius: 16,
        borderWidth: 1.5, borderColor: '#E5E7EB',
    },
    previewTxt: { fontSize: 14, fontFamily: 'InterSemiBold', fontWeight: '600', color: '#0F1729' },
    btnOff: { borderColor: '#F0F1F3', backgroundColor: '#FAFAFA' },
    disabledTxt: { color: '#CBD5E1' },
    saveBtn: {
        flex: 1.6,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7,
        paddingVertical: 15, borderRadius: 16, backgroundColor: '#2869BD',
    },
    saveBtnOff: { backgroundColor: '#93B5E1' },
    saveTxt: { fontSize: 14, fontFamily: 'InterSemiBold', fontWeight: '600', color: '#fff' },

    modalBg: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.40)',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 38 : 24,
        gap: 16,
    },
    sheetHandle: {
        width: 40, height: 4, borderRadius: 2,
        backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 4,
    },
    sheetTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    sheetTitle: { fontSize: 17, fontFamily: 'InterBold', fontWeight: '700', color: '#0F1729' },
    sheetCloseBtn: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
    },
    sheetSub: { fontSize: 13, fontFamily: 'InterRegular', color: '#94A3B8', lineHeight: 20, marginTop: -6 },
    inputBox: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        borderWidth: 1.5, borderColor: '#2869BD', borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 13, backgroundColor: '#EBF1FB',
    },
    input: { flex: 1, fontSize: 15, fontFamily: 'InterRegular', color: '#0F1729', padding: 0 },
    pickLabel: {
        fontSize: 11, fontFamily: 'InterSemiBold', fontWeight: '600',
        color: '#94A3B8', letterSpacing: 0.8, marginTop: -4,
    },
    pickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: -4 },
    pickChip: {
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
        backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: '#F3F4F6',
    },
    pickChipOn: { backgroundColor: '#EBF1FB', borderColor: '#2869BD' },
    pickChipTxt: { fontSize: 13, fontFamily: 'InterMedium', fontWeight: '500', color: '#565E74' },
    pickChipTxtOn: { color: '#2869BD', fontFamily: 'InterSemiBold', fontWeight: '600' },
    sheetBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
    cancelBtn: {
        flex: 1, paddingVertical: 14, borderRadius: 14,
        borderWidth: 1.5, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
    },
    cancelTxt: { fontSize: 14, fontFamily: 'InterSemiBold', fontWeight: '600', color: '#565E74' },
    createBtn: {
        flex: 2, paddingVertical: 14, borderRadius: 14,
        backgroundColor: '#2869BD', alignItems: 'center', justifyContent: 'center',
    },
    createTxt: { fontSize: 14, fontFamily: 'InterSemiBold', fontWeight: '600', color: '#fff' },
});

export default CombineScreen;