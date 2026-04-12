import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';

interface StyleCategory {
    id: string;
    title: string;
    description: string;
    emoji: string;
}

interface OccasionItem {
    id: string;
    label: string;
}

interface ColorItem {
    id: string;
    color: string;
    label: string;
}

const styleCategories: StyleCategory[] = [
    { id: 'casual', title: 'Casual', description: 'Everyday relaxed looks', emoji: '👕' },
    { id: 'formal', title: 'Formal', description: 'Professional & polished', emoji: '👔' },
    { id: 'gym', title: 'Gym', description: 'Active & sporty wear', emoji: '🏋️' },
    { id: 'streetwear', title: 'Streetwear', description: 'Urban & trendy styles', emoji: '🧢' },
    { id: 'boho', title: 'Boho', description: 'Free-spirited & artistic', emoji: '🌸' },
    { id: 'minimalist', title: 'Minimalist', description: 'Clean & simple aesthetic', emoji: '⬜' },
];

const occasions: OccasionItem[] = [
    { id: 'work', label: 'Work' },
    { id: 'date', label: 'Date Night' },
    { id: 'weekend', label: 'Weekend' },
    { id: 'party', label: 'Party' },
    { id: 'travel', label: 'Travel' },
    { id: 'outdoor', label: 'Outdoor' },
    { id: 'brunch', label: 'Brunch' },
    { id: 'gym', label: 'Gym' },
];

const colors: ColorItem[] = [
    { id: 'black', color: '#1a1a1a', label: 'Black' },
    { id: 'white', color: '#f5f5f5', label: 'White' },
    { id: 'navy', color: '#1e3a5f', label: 'Navy' },
    { id: 'beige', color: '#d4b896', label: 'Beige' },
    { id: 'grey', color: '#9ca3af', label: 'Grey' },
    { id: 'green', color: '#4ade80', label: 'Green' },
    { id: 'red', color: '#ef4444', label: 'Red' },
    { id: 'brown', color: '#92400e', label: 'Brown' },
];

const StylePreferenceScreen = ({ navigation }: any) => {
    const onBack = () => navigation.goBack();
    const [selectedStyles, setSelectedStyles] = useState<string[]>(['casual', 'gym', 'formal']);
    const [selectedOccasions, setSelectedOccasions] = useState<string[]>(['work', 'weekend']);
    const [selectedColors, setSelectedColors] = useState<string[]>(['black', 'navy']);

    const toggleItem = (id: string, selected: string[], setSelected: (val: string[]) => void) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(s => s !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
                    <ArrowLeft size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Style Preferences</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={onBack}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Style Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Style</Text>
                    <Text style={styles.sectionSub}>Select all that match your vibe</Text>
                    <View style={styles.styleGrid}>
                        {styleCategories.map((item) => {
                            const isSelected = selectedStyles.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.styleCard, isSelected && styles.styleCardSelected]}
                                    activeOpacity={0.8}
                                    onPress={() => toggleItem(item.id, selectedStyles, setSelectedStyles)}
                                >
                                    {isSelected && (
                                        <View style={styles.checkBadge}>
                                            <Check size={10} color="#fff" />
                                        </View>
                                    )}
                                    <Text style={[styles.styleCardTitle, isSelected && styles.styleCardTitleSelected]}>
                                        {item.title}
                                    </Text>
                                    <Text style={[styles.styleCardDesc, isSelected && styles.styleCardDescSelected]}>
                                        {item.description}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Occasions Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Occasions</Text>
                    <Text style={styles.sectionSub}>When do you need outfit inspiration?</Text>
                    <View style={styles.chipRow}>
                        {occasions.map((item) => {
                            const isSelected = selectedOccasions.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.chip, isSelected && styles.chipSelected]}
                                    activeOpacity={0.8}
                                    onPress={() => toggleItem(item.id, selectedOccasions, setSelectedOccasions)}
                                >
                                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Favorite Colors Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Favorite Colors</Text>
                    <Text style={styles.sectionSub}>Pick your go-to palette</Text>
                    <View style={styles.colorRow}>
                        {colors.map((item) => {
                            const isSelected = selectedColors.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.colorItem}
                                    activeOpacity={0.8}
                                    onPress={() => toggleItem(item.id, selectedColors, setSelectedColors)}
                                >
                                    <View style={[
                                        styles.colorCircle,
                                        { backgroundColor: item.color },
                                        isSelected && styles.colorCircleSelected,
                                    ]}>
                                        {isSelected && <Check size={14} color={item.id === 'white' ? '#1E293B' : '#fff'} />}
                                    </View>
                                    <Text style={[styles.colorLabel, isSelected && styles.colorLabelSelected]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={onBack}>
                    <Text style={styles.saveBtnText}>Save Preferences</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // Header — matches ProfileEditScreen exactly
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#1E293B',
    },
    saveText: {
        fontSize: 15,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color: '#2869BD',
    },

    scrollContent: {
        paddingBottom: 40,
    },

    // Section
    section: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#1E293B',
    },
    sectionSub: {
        fontSize: 13,
        fontFamily: 'InterRegular',
        fontWeight: '400',
        color: '#94a3b8',
        marginTop: 3,
        marginBottom: 16,
    },

    // Style Grid
    styleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    styleCard: {
        width: '47%',
        backgroundColor: '#F3F4F6',   // same as input bg in ProfileEditScreen
        borderRadius: 16,
        padding: 16,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        position: 'relative',
    },
    styleCardSelected: {
        backgroundColor: '#EBF1FB',
        borderColor: '#2869BD',
    },
    checkBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#2869BD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    styleEmoji: {
        fontSize: 28,
        marginBottom: 8,
    },
    styleCardTitle: {
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#1E293B',
    },
    styleCardTitleSelected: {
        color: '#2869BD',
    },
    styleCardDesc: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        fontWeight: '400',
        color: '#94a3b8',
        marginTop: 3,
    },
    styleCardDescSelected: {
        color: '#5a8fd4',
    },

    // Chips
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',   // same as input bg in ProfileEditScreen
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
    },
    chipSelected: {
        backgroundColor: '#EBF1FB',
        borderColor: '#2869BD',
    },
    chipText: {
        fontSize: 13,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color: '#565E74',             // same as fieldLabel in ProfileEditScreen
    },
    chipTextSelected: {
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#2869BD',
    },

    // Colors
    colorRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    colorItem: {
        alignItems: 'center',
        gap: 6,
    },
    colorCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorCircleSelected: {
        borderColor: '#2869BD',
        shadowColor: '#2869BD',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    colorLabel: {
        fontSize: 11,
        fontFamily: 'InterRegular',
        fontWeight: '400',
        color: '#94a3b8',
    },
    colorLabelSelected: {
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#2869BD',
    },

    // Save Button — matches ProfileEditScreen exactly
    saveBtn: {
        marginHorizontal: 20,
        marginTop: 32,
        backgroundColor: '#2869BD',
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: 'center',
    },
    saveBtnText: {
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#fff',
    },
});

export default StylePreferenceScreen;