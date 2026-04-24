import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronRight, Search, Sparkles, Zap } from 'lucide-react-native';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const [activeTab, setActiveTab] = useState<'wear' | 'build'>('wear');
    const navigation = useNavigation<any>();

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
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.headerText}>What are you wearing today?</Text>
                </View>
                <View style={styles.headerRight}>
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
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* --- Quick Fit Banner (Navigation Updated Here) --- */}
                <TouchableOpacity 
                    style={styles.quickFit} 
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('AIChatScreen')} // এখানে আপনার চ্যাট স্ক্রিনের নাম দিন
                >
                    <View style={styles.quickFitLeft}>
                        <View style={styles.quickFitIcon}>
                            <Zap size={16} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.quickFitTitle}>Quick Fit</Text>
                            <Text style={styles.quickFitSub}>Generate an outfit instantly with AI</Text>
                        </View>
                    </View>
                    <Sparkles size={20} color="#fff" />
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
                        onPress={() => navigation.navigate('combine')}
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
                <TouchableOpacity 
                    style={styles.createBtn} 
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('combine')}
                >
                    <Text style={styles.createBtnText}>Create Your Own</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;