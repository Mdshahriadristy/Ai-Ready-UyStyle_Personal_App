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
import { Bell, ChevronRight, Search, Zap } from 'lucide-react-native';

const HomeScreen = () => {
    const [activeTab, setActiveTab] = useState<'wear' | 'build'>('wear');

    const recentItems = [
        { id: 1, name: 'White Oversiz...', category: 'Top', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=200' },
        { id: 2, name: 'Blue Straight J...', category: 'Bottom', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200' },
        { id: 3, name: 'Black Sneake...', category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
    ];

    const recentOutfits = [
        { id: 1, name: 'Casual Friday...', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200' },
        { id: 2, name: 'Blue Straight J...', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=200' },
        { id: 3, name: 'Black Sneake...', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200' },
    ];

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
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }}
                        style={styles.avatar}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="What are you wearing today?"
                        placeholderTextColor="#94a3b8"
                    />
                    <TouchableOpacity style={styles.headerIcon}>
                        <Search size={20} color="#0F1729" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <View style={styles.notifWrapper}>
                            <Bell size={20} color="#1E293B" />
                            <View style={styles.notifDot} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Quick Fit Banner */}
                <TouchableOpacity style={styles.quickFit} activeOpacity={0.8}>
                    <View style={styles.quickFitLeft}>
                        <View style={styles.quickFitIcon}>
                            <Zap size={16} color="white" />
                        </View>
                        <View>
                            <Text style={styles.quickFitTitle}>Quick Fit</Text>
                            <Text style={styles.quickFitSub}>Generate an outfit instantly</Text>
                        </View>
                    </View>
                    <ChevronRight size={24} strokeWidth={2} color="#000" />
                </TouchableOpacity>

                {/* Today's Pick Banner */}
                <View style={styles.todayPick}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600' }}
                        style={styles.todayPickImage}
                    />
                    <View style={styles.todayPickOverlay}>
                        <Text style={styles.todayPickLabel}>Today's Pick</Text>
                        <Text style={styles.todayPickTitle}>Casual sunny{'\n'}day look</Text>
                    </View>
                </View>

                {/* Wear / Build Tabs */}
                <View style={styles.tabRow}>
                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'wear' && styles.tabBtnActive]}
                        onPress={() => setActiveTab('wear')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.tabText, activeTab === 'wear' && styles.tabTextActive]}>
                            Wear This
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'build' && styles.tabBtnActive]}
                        onPress={() => setActiveTab('build')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.tabText, activeTab === 'build' && styles.tabTextActive]}>
                            Build Another
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Items */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Items</Text>
                        <TouchableOpacity style={styles.seeAll}>
                            <Text style={styles.seeAllText}>See All</Text>
                            <ChevronRight size={14} color="#65758B" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemsRow}>
                        {recentItems.map(item => (
                            <TouchableOpacity key={item.id} style={styles.itemCard} activeOpacity={0.8}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.itemCategory}>{item.category}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Outfits */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Outfits</Text>
                        <TouchableOpacity style={styles.seeAll}>
                            <Text style={styles.seeAllText}>See All</Text>
                            <ChevronRight size={14} color="#2869BD" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemsRow}>
                        {recentOutfits.map(item => (
                            <TouchableOpacity key={item.id} style={styles.itemCard} activeOpacity={0.8}>
                                <Image source={{ uri: item.image }} style={styles.itemImage} />
                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Create Your Own */}
                <TouchableOpacity style={styles.createBtn} activeOpacity={0.85}>
                    <Text style={styles.createBtnText}>Create Your Own</Text>
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
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30,
        gap: 11,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    searchInput: {
        flex: 1,
        height: 36,
        borderRadius: 8,
        fontSize: 14,
        fontFamily: 'InterRegular',
        fontWeight: '400',
        color: '#65758B',
    },
    headerIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 50,
    },
    notifWrapper: {
        position: 'relative',
    },
    notifDot: {
        position: 'absolute',
        top: -1,
        right: 1,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4343',
    },

    // Quick Fit
    quickFit: {
        marginHorizontal: 20,
        marginBottom: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quickFitLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quickFitIcon: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#2869BD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quickFitTitle: {
        fontSize: 16,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color: '#1E293B',
    },
    quickFitSub: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        color: '#65758B',
        marginTop: 2,
        fontWeight: '400',
    },

    // Today's Pick
    todayPick: {
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        height: 180,
    },
    todayPickImage: {
        width: '100%',
        height: '100%',
    },
    todayPickOverlay: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        alignItems: 'flex-end',
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        overflow: 'hidden',
        height: '60%',
        width: '40%',
        justifyContent: 'center',
    },
    todayPickLabel: {
        fontSize: 20,
        fontFamily: 'InterRegular',
        color: 'rgba(255,255,255,0.85)',
        fontStyle: 'italic',
    },
    todayPickTitle: {
        fontSize: 18,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#fff',
        textAlign: 'right'
    },

    // Tabs
    tabRow: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 24,
        marginTop: 12,
        gap: 8,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tabBtnActive: {
        backgroundColor: '#2869BD',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#0F1729',
    },
    tabTextActive: {
        color: '#fff',
    },

    // Sections
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#0F1729',
    },
    seeAll: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    seeAllText: {
        fontSize: 14,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color: '#65758B',
    },
    itemsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 8,
    },
    itemCard: {
        flex: 1,
    },
    itemImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        marginBottom: 6,
    },
    itemName: {
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#0F1729',
    },
    itemCategory: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        color: '#65758B',
        marginTop: 2,
    },

    // Create Button
    createBtn: {
        marginHorizontal: 20,
        backgroundColor: '#2869BD',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    createBtnText: {
        fontSize: 16,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#fff',
    },


});

export default HomeScreen;