import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, PenLine, Shirt } from 'lucide-react-native';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';

const stats = [
    { label: 'Items', value: '128' },
    { label: 'Outfits', value: '24' },
    { label: 'Favorites', value: '8' },
];

const menuItems = [
    { label: 'Notifications', danger: false, screen: 'notification' },
    { label: 'Account Settings', danger: false, screen: 'accountsettings' },
    { label: 'Privacy', danger: false, screen: 'privacypolicy' },
    { label: 'Help', danger: false, screen: 'help' },
    { label: 'Logout', danger: true, },
];

const favoriteLooks = [
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300',
];

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
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
                    <TouchableOpacity
                        onPress={() => navigation.navigate('profileedit')}
                        style={styles.editBtn} activeOpacity={0.7}>
                        <PenLine size={18} color="#1E293B" />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {stats.map((stat) => (
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Style Preferences */}
                <TouchableOpacity style={styles.stylePrefs} activeOpacity={0.8}
                    onPress={() => navigation.navigate('preference')}
                >
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
                    {menuItems.map((item) => (
                        <TouchableOpacity key={item.label} style={styles.menuRow} activeOpacity={0.7}
                            onPress={() => navigation.navigate(item.screen)}
                        >
                            <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                                {item.label}
                            </Text>
                            <ChevronRight size={18} color={item.danger ? '#EF4444' : '#65758B'} />
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView >
    );
};


export default ProfileScreen;