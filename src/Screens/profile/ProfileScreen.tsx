


import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, PenLine, Shirt, User } from 'lucide-react-native';
import { styles } from './style';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';

const stats = [
    { label: 'Items',     value: '128' },
    { label: 'Outfits',   value: '24'  },
    { label: 'Favorites', value: '8'   },
];

const menuItems = [
    { label: 'Notifications',    danger: false, screen: 'notification'    },
    { label: 'Account Settings', danger: false, screen: 'accountsettings' },
    { label: 'Privacy',          danger: false, screen: 'privacypolicy'   },
    { label: 'Help',             danger: false, screen: 'help'            },
    { label: 'Logout',           danger: true,  screen: null              },
];

const favoriteLooks = [
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300',
];

const ProfileScreen = () => {
    const navigation = useNavigation<any>();

    // ── User data state ──────────────────────────────────
    const [fullName,  setFullName]  = useState('');
    const [photoURL,  setPhotoURL]  = useState<string | null>(null);
    const [loading,   setLoading]   = useState(true);

    const app  = getApp();
    const auth = getAuth(app);
    const db   = getFirestore(app);
    const user = auth.currentUser;



    useFocusEffect(
        useCallback(() => {
            const fetchProfile = async () => {
                if (!user) return;
                setLoading(true);
                try {
                    const snap = await getDoc(doc(db, 'users', user.uid));
                    if (snap.exists()) {
                        const data = snap.data();
                        setFullName(data?.fullName  || '');
                        setPhotoURL(data?.photoURL  || null);
                    }
                } catch (e) {
                    console.log('Profile fetch error:', e);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }, [])
    );

    // ── Logout ────────────────────────────────────────────
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut(getAuth(getApp()));
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    // ── Menu press ────────────────────────────────────────
    const handleMenuPress = (item: { label: string; screen: string | null }) => {
        if (item.label === 'Logout') {
            handleLogout();
        } else if (item.screen) {
            navigation.navigate(item.screen);
        }
    };

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

                        {/*  Avatar — Firestore photoURL দেখাবে */}
                        {loading ? (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <ActivityIndicator size="small" color="#2869BD" />
                            </View>
                        ) : photoURL ? (
                            <Image
                                source={{ uri: photoURL }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <User size={22} color="#94A3B8" />
                            </View>
                        )}

                        <View>
                            {/*  Name — Firestore fullName দেখাবে */}
                            <Text style={styles.profileName}>
                                Hi, {loading ? '...' : fullName || 'User'}
                            </Text>
                            <Text style={styles.profileSub}>Inspiration for today</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('profileedit')}
                        style={styles.editBtn}
                        activeOpacity={0.7}
                    >
                        <PenLine size={18} color="#1E293B" />
                    </TouchableOpacity>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {stats.map((stat) => (
                        <View key={stat.label} style={styles.statItem}>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Style Preferences */}
                <TouchableOpacity
                    style={styles.stylePrefs}
                    activeOpacity={0.8}
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
                        <TouchableOpacity
                            key={item.label}
                            style={styles.menuRow}
                            activeOpacity={0.7}
                            onPress={() => handleMenuPress(item)}
                        >
                            <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                                {item.label}
                            </Text>
                            <ChevronRight size={18} color={item.danger ? '#EF4444' : '#65758B'} />
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;