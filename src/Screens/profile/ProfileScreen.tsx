import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Pencil, Shirt } from 'lucide-react-native';

const stats = [
    { label: 'Items', value: '128' },
    { label: 'Outfits', value: '24' },
    { label: 'Favorites', value: '8' },
];

const menuItems = [
    { label: 'Notifications', danger: false },
    { label: 'Account Settings', danger: false },
    { label: 'Privacy', danger: false },
    { label: 'Help', danger: false },
    { label: 'Logout', danger: true },
];

const favoriteLooks = [
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300',
];

const ProfileScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.profileLeft}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.profileName}>Hi, Sarah</Text>
                            <Text style={styles.profileSub}>Inspiration for today</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
                        <Pencil size={16} color="#1E293B" />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {stats.map((stat, index) => (
                        <React.Fragment key={stat.label}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                            {index < stats.length - 1 && <View style={styles.statDivider} />}
                        </React.Fragment>
                    ))}
                </View>

                {/* Style Preferences */}
                <TouchableOpacity style={styles.stylePrefs} activeOpacity={0.8}>
                    <View style={styles.stylePrefLeft}>
                        <View style={styles.stylePrefIcon}>
                            <Shirt size={20} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.stylePrefTitle}>Style Preferences</Text>
                            <Text style={styles.stylePrefSub}>Casual, Gym, Formal</Text>
                        </View>
                    </View>
                    <ChevronRight size={18} color="#94a3b8" />
                </TouchableOpacity>

                {/* Favorite Looks */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Favorite Looks</Text>
                        <TouchableOpacity style={styles.seeAll} activeOpacity={0.7}>
                            <Text style={styles.seeAllText}>See All</Text>
                            <ChevronRight size={14} color="#2869BD" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.favRow}>
                        {favoriteLooks.map((uri, index) => (
                            <TouchableOpacity key={index} style={styles.favCard} activeOpacity={0.85}>
                                <Image source={{ uri }} style={styles.favImage} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={item.label}>
                            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                                    {item.label}
                                </Text>
                                <ChevronRight size={18} color={item.danger ? '#EF4444' : '#94a3b8'} />
                            </TouchableOpacity>
                            {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
                        </React.Fragment>
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

    // Profile Header
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
    },
    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    profileName: {
        fontSize: 20,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#1E293B',
    },
    profileSub: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        color: '#94a3b8',
        marginTop: 2,
    },
    editBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        paddingVertical: 16,
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#1E293B',
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        color: '#94a3b8',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E2E8F0',
    },

    // Style Preferences
    stylePrefs: {
        marginHorizontal: 16,
        marginBottom: 24,
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    stylePrefLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stylePrefIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#2869BD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stylePrefTitle: {
        fontSize: 14,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#1E293B',
    },
    stylePrefSub: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        color: '#64748B',
        marginTop: 2,
    },

    // Favorite Looks
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#1E293B',
    },
    seeAll: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    seeAllText: {
        fontSize: 13,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color: '#2869BD',
    },
    favRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    favCard: {
        width: 140,
        height: 140,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
    },
    favImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    // Menu
    menuSection: {
        marginHorizontal: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        paddingHorizontal: 16,
    },
    menuRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    menuLabel: {
        fontSize: 15,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color: '#1E293B',
    },
    menuLabelDanger: {
        color: '#EF4444',
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#E2E8F0',
    },
});

export default ProfileScreen;