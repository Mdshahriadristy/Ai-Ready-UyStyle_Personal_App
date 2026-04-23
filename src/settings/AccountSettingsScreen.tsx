// import React from 'react';
// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     StyleSheet,
//     StatusBar,
//     Image,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ArrowLeft, ChevronRight, User, Mail, Lock } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';

// // Helper component for a setting row
// const SettingRow = ({ icon: Icon, label, value, onPress, isLast, isDanger }: any) => (
//     <TouchableOpacity
//         style={[styles.row, isLast && styles.noBorder]}
//         onPress={onPress}
//         activeOpacity={0.7}
//     >
//         <View style={styles.rowLeft}>
//             <View style={[styles.iconContainer, isDanger && styles.dangerIconContainer]}>
//                 <Icon size={20} color={isDanger ? '#EF4444' : '#64748B'} />
//             </View>
//             <Text style={[styles.rowLabel, isDanger && styles.dangerText]}>{label}</Text>
//         </View>
//         <View style={styles.rowRight}>
//             {value && <Text style={styles.rowValue}>{value}</Text>}
//             <ChevronRight size={18} color={isDanger ? '#EF4444' : '#94A3B8'} />
//         </View>
//     </TouchableOpacity>
// );

// const AccountSettingsScreen = () => {
//     const navigation = useNavigation();

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//                     <ArrowLeft size={24} color="#1E293B" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Account Settings</Text>
//                 <View style={{ width: 40 }} />
//             </View>

//             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

//                 {/* Profile Picture Section */}
//                 <View style={styles.avatarSection}>
//                     <View style={styles.avatarWrapper}>
//                         <Image
//                             source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }}
//                             style={styles.avatar}
//                         />
//                     </View>
//                     <Text style={styles.userName}>Sarah Jenkins</Text>
//                     <Text style={styles.userEmail}>sarah.j@example.com</Text>
//                 </View>

//                 {/* Personal Info Section */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Personal Information</Text>
//                     <View style={styles.card}>
//                         <SettingRow
//                             icon={User}
//                             label="Full Name"
//                             value="Sarah Jenkins"
//                             onPress={() => { }}
//                         />
//                         <SettingRow
//                             icon={Mail}
//                             label="Email"
//                             value="sarah.j@example.com"
//                             onPress={() => { }}
//                         />
//                     </View>
//                 </View>

//                 {/* Security Section */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Security</Text>
//                     <View style={styles.card}>
//                         <SettingRow
//                             icon={Lock}
//                             label="Change Password"
//                             onPress={() => { }}
//                         />
//                     </View>
//                 </View>


//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontFamily: 'InterBold',
//         color: '#0F1729',
//     },
//     backBtn: {
//         width: 40,
//         height: 40,
//         justifyContent: 'center',
//     },
//     scrollContent: {
//         paddingBottom: 40,
//     },
//     // Avatar Section
//     avatarSection: {
//         alignItems: 'center',
//         paddingVertical: 30,
//         backgroundColor: '#fff',
//     },
//     avatarWrapper: {
//         position: 'relative',
//         marginBottom: 16,
//     },
//     avatar: {
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//         borderWidth: 4,
//         borderColor: '#F1F5F9',
//     },
//     cameraBtn: {
//         position: 'absolute',
//         bottom: 0,
//         right: 0,
//         backgroundColor: '#2869BD',
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 3,
//         borderColor: '#fff',
//     },
//     userName: {
//         fontSize: 20,
//         fontFamily: 'InterBold',
//         color: '#1E293B',
//     },
//     userEmail: {
//         fontSize: 14,
//         fontFamily: 'InterRegular',
//         color: '#64748B',
//         marginTop: 4,
//     },
//     // Sections & Cards
//     section: {
//         marginTop: 25,
//         paddingHorizontal: 20,
//     },
//     sectionTitle: {
//         fontSize: 13,
//         fontFamily: 'InterSemiBold',
//         color: '#94A3B8',
//         letterSpacing: 1,
//         marginBottom: 10,
//         marginLeft: 4,
//     },
//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 16,
//         overflow: 'hidden',
//         borderWidth: 1,
//         borderColor: '#F1F5F9',
//     },
//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingVertical: 16,
//         paddingHorizontal: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#F8FAFC',
//     },
//     noBorder: {
//         borderBottomWidth: 0,
//     },
//     rowLeft: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     iconContainer: {
//         width: 36,
//         height: 36,
//         borderRadius: 10,
//         backgroundColor: '#F1F5F9',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: 12,
//     },
//     dangerIconContainer: {
//         backgroundColor: '#FEF2F2',
//     },
//     rowLabel: {
//         fontSize: 15,
//         fontFamily: 'InterMedium',
//         color: '#1E293B',
//     },
//     rowRight: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     rowValue: {
//         fontSize: 14,
//         fontFamily: 'InterRegular',
//         color: '#64748B',
//         marginRight: 8,
//     },
//     dangerText: {
//         color: '#EF4444',
//     },
//     footer: {
//         marginTop: 40,
//         alignItems: 'center',
//     },
//     versionText: {
//         fontSize: 12,
//         fontFamily: 'InterRegular',
//         color: '#94A3B8',
//     },
// });

// export default AccountSettingsScreen;




import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, User, Mail, Lock, Camera } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, onSnapshot } from '@react-native-firebase/firestore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
    fullName: string;
    email: string;
    photoURL?: string;
}

interface SettingRowProps {
    icon: React.ComponentType<{ size: number; color: string }>;
    label: string;
    value?: string;
    onPress: () => void;
    isLast?: boolean;
    isDanger?: boolean;
}

// ─── SettingRow ───────────────────────────────────────────────────────────────

const SettingRow = React.memo(({
    icon: Icon,
    label,
    value,
    onPress,
    isLast,
    isDanger,
}: SettingRowProps) => (
    <TouchableOpacity
        style={[styles.row, isLast && styles.noBorder]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityLabel={label}
        accessibilityRole="button"
    >
        <View style={styles.rowLeft}>
            <View style={[styles.iconContainer, isDanger && styles.dangerIconContainer]}>
                <Icon size={20} color={isDanger ? '#EF4444' : '#64748B'} />
            </View>
            <Text style={[styles.rowLabel, isDanger && styles.dangerText]}>{label}</Text>
        </View>
        <View style={styles.rowRight}>
            {value ? (
                <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
            ) : null}
            <ChevronRight size={18} color={isDanger ? '#EF4444' : '#94A3B8'} />
        </View>
    </TouchableOpacity>
));

// ─── Screen ───────────────────────────────────────────────────────────────────

const AccountSettingsScreen = () => {
    const navigation = useNavigation<any>();

    const app  = getApp();
    const auth = getAuth(app);
    const db   = getFirestore(app);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            navigation.replace('Login');
            return;
        }

        const unsubscribe = onSnapshot(
            doc(db, 'users', currentUser.uid),
            (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    setProfile({
                        fullName: data?.fullName ?? '',
                        email:    data?.email    ?? currentUser.email ?? '',
                        photoURL: data?.photoURL ?? undefined,
                    });
                } else {
                    setError('Profile not found.');
                }
                setLoading(false);
            },
            (err) => {
                console.error('Firestore error:', err);
                setError('Failed to load profile.');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleEditName = useCallback(() => {
        navigation.navigate('profileedit', {
            field:        'name',
            currentValue: profile?.fullName,
        });
    }, [navigation, profile?.fullName]);

    const handleEditEmail = useCallback(() => {
        navigation.navigate('profileedit', {
            field:        'email',
            currentValue: profile?.email,
        });
    }, [navigation, profile?.email]);

    const handleChangePassword = useCallback(() => {
        navigation.navigate('ChangePassword');
    }, [navigation]);

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator style={styles.centered} size="large" color="#2869BD" />
            </SafeAreaView>
        );
    }

    // ── Error ──────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryBtn}>
                        <Text style={styles.retryBtnText}>Go back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <ArrowLeft size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        {profile?.photoURL ? (
                            <Image source={{ uri: profile.photoURL }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <User size={38} color="#94A3B8" />
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.cameraBtn}
                            onPress={() => navigation.navigate('ProfileEdit', { field: 'photo' })}
                            accessibilityLabel="Change profile photo"
                            accessibilityRole="button"
                        >
                            <Camera size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{profile?.fullName}</Text>
                    <Text style={styles.userEmail}>{profile?.email}</Text>
                </View>

                {/* Personal Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
                    <View style={styles.card}>
                        <SettingRow
                            icon={User}
                            label="Full Name"
                            value={profile?.fullName}
                            onPress={handleEditName}
                        />
                        <SettingRow
                            icon={Mail}
                            label="Email"
                            value={profile?.email}
                            onPress={handleEditEmail}
                            isLast
                        />
                    </View>
                </View>

                {/* Security */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SECURITY</Text>
                    <View style={styles.card}>
                        <SettingRow
                            icon={Lock}
                            label="Change Password"
                            onPress={handleChangePassword}
                            isLast
                        />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea:            { flex: 1, backgroundColor: '#fff' },
    centered:            { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    header: {
        flexDirection:      'row',
        alignItems:         'center',
        justifyContent:     'space-between',
        paddingHorizontal:   20,
        paddingVertical:     15,
    },
    headerTitle:         { fontSize: 18, fontFamily: 'InterBold', color: '#0F1729' },
    backBtn:             { width: 40, height: 40, justifyContent: 'center' },
    scrollContent:       { paddingBottom: 40 },
    avatarSection:       { alignItems: 'center', paddingVertical: 30, backgroundColor: '#fff' },
    avatarWrapper:       { position: 'relative', marginBottom: 16 },
    avatar:              { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#F1F5F9' },
    avatarPlaceholder: {
        width:           100,
        height:          100,
        borderRadius:    50,
        backgroundColor: '#E2E8F0',
        alignItems:      'center',
        justifyContent:  'center',
        borderWidth:     4,
        borderColor:     '#F1F5F9',
    },
    cameraBtn: {
        position:        'absolute',
        bottom:           0,
        right:            0,
        backgroundColor: '#2869BD',
        width:            32,
        height:           32,
        borderRadius:     16,
        alignItems:      'center',
        justifyContent:  'center',
        borderWidth:      3,
        borderColor:     '#fff',
    },
    userName:            { fontSize: 20, fontFamily: 'InterBold', color: '#1E293B' },
    userEmail:           { fontSize: 14, fontFamily: 'InterRegular', color: '#64748B', marginTop: 4 },
    section:             { marginTop: 25, paddingHorizontal: 20 },
    sectionTitle: {
        fontSize:      13,
        fontFamily:    'InterSemiBold',
        color:         '#94A3B8',
        letterSpacing:  1,
        marginBottom:  10,
        marginLeft:     4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius:     16,
        overflow:        'hidden',
        borderWidth:      1,
        borderColor:     '#F1F5F9',
    },
    row: {
        flexDirection:     'row',
        alignItems:        'center',
        justifyContent:    'space-between',
        paddingVertical:    16,
        paddingHorizontal:  16,
        borderBottomWidth:  1,
        borderBottomColor: '#F8FAFC',
    },
    noBorder:            { borderBottomWidth: 0 },
    rowLeft:             { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconContainer: {
        width:           36,
        height:          36,
        borderRadius:    10,
        backgroundColor: '#F1F5F9',
        alignItems:      'center',
        justifyContent:  'center',
        marginRight:     12,
    },
    dangerIconContainer: { backgroundColor: '#FEF2F2' },
    rowLabel:            { fontSize: 15, fontFamily: 'InterMedium', color: '#1E293B' },
    rowRight:            { flexDirection: 'row', alignItems: 'center' },
    rowValue:            { fontSize: 14, fontFamily: 'InterRegular', color: '#64748B', marginRight: 8, maxWidth: 140 },
    dangerText:          { color: '#EF4444' },
    errorText:           { fontSize: 15, color: '#EF4444', textAlign: 'center', marginBottom: 16 },
    retryBtn:            { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, backgroundColor: '#F1F5F9' },
    retryBtnText:        { fontSize: 14, fontFamily: 'InterMedium', color: '#1E293B' },
});

export default AccountSettingsScreen;