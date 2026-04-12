import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus } from 'lucide-react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SlotItem {
    id: string;
    label: string;
}

interface ClothingItem {
    id: string;
    label: string;
    category: string;
    image: string;
}

interface SelectedItems {
    [slot: string]: ClothingItem | null;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const slots: SlotItem[] = [
    { id: 'Top', label: 'Top' },
    { id: 'Bottom', label: 'Bottom' },
    { id: 'Shoes', label: 'Shoes' },
    { id: 'Outerwear', label: 'Outerwear' },
    { id: 'Accessory', label: 'Accessory' },
];

const categories: string[] = ['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessory'];

const clothingItems: ClothingItem[] = [
    {
        id: '1',
        label: 'Blue Knit Sweater',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&q=80',
    },
    {
        id: '2',
        label: 'White Oversized Shirt',
        category: 'Tops',
        image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300&q=80',
    },
    {
        id: '3',
        label: 'Black Slim Jeans',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&q=80',
    },
    {
        id: '4',
        label: 'Beige Trousers',
        category: 'Bottoms',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80',
    },
    {
        id: '5',
        label: 'White Sneakers',
        category: 'Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
    },
    {
        id: '6',
        label: 'Brown Loafers',
        category: 'Shoes',
        image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=300&q=80',
    },
    {
        id: '7',
        label: 'Camel Trench Coat',
        category: 'Outerwear',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&q=80',
    },
    {
        id: '8',
        label: 'Leather Belt',
        category: 'Accessory',
        image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=300&q=80',
    },
];

// ─── Component ───────────────────────────────────────────────────────────────

const CombineScreen = ({ navigation }: any) => {
    const [activeCategory, setActiveCategory] = useState<string>('Tops');
    const [selectedItems, setSelectedItems] = useState<SelectedItems>({});

    const filteredItems = clothingItems.filter(i => i.category === activeCategory);

    // Map category tab → slot id
    const categoryToSlot: Record<string, string> = {
        Tops: 'Top',
        Bottoms: 'Bottom',
        Shoes: 'Shoes',
        Outerwear: 'Outerwear',
        Accessory: 'Accessory',
    };

    const handleSelectItem = (item: ClothingItem) => {
        const slot = categoryToSlot[activeCategory];
        setSelectedItems(prev => ({
            ...prev,
            [slot]: prev[slot]?.id === item.id ? null : item,
        }));
    };

    // Slot grid: row1 = 3 items, row2 = 2 items centered
    const row1 = slots.slice(0, 3);
    const row2 = slots.slice(3, 5);

    const renderSlot = (slot: SlotItem) => {
        const selected = selectedItems[slot.id];
        return (
            <View key={slot.id} style={styles.slot}>
                {selected ? (
                    <Image source={{ uri: selected.image }} style={styles.slotImage} resizeMode="cover" />
                ) : (
                    <>
                        <Plus size={18} color="#65758B" />
                        <Text style={styles.slotLabel}>{slot.label}</Text>
                    </>
                )}
            </View>
        );
    };

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
                    <Text style={styles.headerTitle}>Combine</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
                    <Plus size={20} color="#1E293B" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Outfit Builder Grid */}
                <View style={styles.gridCard}>
                    <View style={styles.gridRow}>
                        {row1.map(renderSlot)}
                    </View>
                    <View style={styles.gridRowCentered}>
                        {row2.map(renderSlot)}
                    </View>
                </View>

                {/* Category Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsContainer}
                    style={styles.tabsScroll}
                >
                    {categories.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.tab, activeCategory === cat && styles.tabActive]}
                            activeOpacity={0.8}
                            onPress={() => setActiveCategory(cat)}
                        >
                            <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Clothing Items Grid */}
                <View style={styles.itemsGrid}>
                    {filteredItems.map(item => {
                        const slot = categoryToSlot[activeCategory];
                        const isSelected = selectedItems[slot]?.id === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                                activeOpacity={0.85}
                                onPress={() => handleSelectItem(item)}
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.itemImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.itemLabelRow}>
                                    <Text style={styles.itemLabel} numberOfLines={1}>
                                        {item.label}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.previewBtn} activeOpacity={0.8}
                    onPress={() => navigation.navigate('preview', { items: Object.values(selectedItems).filter(Boolean) })}
                >
                    <Text style={styles.previewBtnText}>Preview</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85}
                    onPress={() => navigation.navigate('saveSuccess')}
                >
                    <Text style={styles.saveBtnText}>Save Look</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginBottom: 10
    },
    backBtn: {
        borderRadius: 18,
        alignItems: 'center',
        // justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#0F1729',
    },
    addBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
    },

    scrollContent: {
        paddingBottom: 110,
    },

    // Outfit Builder Grid Card
    gridCard: {
        marginHorizontal: 20,
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingVertical: 16,
        paddingHorizontal: 12,
        gap: 16,
    },
    gridRow: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        gap: 16,
    },
    gridRowCentered: {
        flexDirection: 'row',
        // justifyContent: 'center',
        gap: 16,
    },
    slot: {
        width: 100,
        height: 100,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        overflow: 'hidden',
    },
    slotImage: {
        width: '100%',
        height: '100%',
    },
    slotLabel: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        fontWeight: '400',
        color: '#65758B',
        marginTop: 4,
    },

    // Category Tabs
    tabsScroll: {
        marginTop: 20,
    },
    tabsContainer: {
        paddingHorizontal: 16,
        gap: 8,
    },
    tab: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
    },
    tabActive: {
        backgroundColor: '#2869BD',
        borderColor: '#2869BD',
    },
    tabText: {
        fontSize: 13,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color: '#565E74',
    },
    tabTextActive: {
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#fff',
    },

    // Clothing Items Grid
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
        marginTop: 16,
    },
    itemCard: {
        width: '47%',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
    },
    itemCardSelected: {
        borderColor: '#2869BD',
        backgroundColor: '#EBF1FB',
    },
    itemImage: {
        width: '100%',
        height: 140,
    },
    itemLabelRow: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    itemLabel: {
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#0F1729',
    },

    // Bottom Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 28,
        backgroundColor: '#fff',
    },
    previewBtn: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewBtnText: {
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#0F1729',
    },
    saveBtn: {
        flex: 1,
        paddingVertical: 15,
        borderRadius: 16,
        backgroundColor: '#2869BD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveBtnText: {
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#fff',
    },
});

export default CombineScreen;