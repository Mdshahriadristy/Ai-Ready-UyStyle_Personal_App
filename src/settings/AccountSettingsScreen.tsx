import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight, User, Mail, Lock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// Helper component for a setting row
const SettingRow = ({ icon: Icon, label, value, onPress, isLast, isDanger }: any) => (
    <TouchableOpacity
        style={[styles.row, isLast && styles.noBorder]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.rowLeft}>
            <View style={[styles.iconContainer, isDanger && styles.dangerIconContainer]}>
                <Icon size={20} color={isDanger ? '#EF4444' : '#64748B'} />
            </View>
            <Text style={[styles.rowLabel, isDanger && styles.dangerText]}>{label}</Text>
        </View>
        <View style={styles.rowRight}>
            {value && <Text style={styles.rowValue}>{value}</Text>}
            <ChevronRight size={18} color={isDanger ? '#EF4444' : '#94A3B8'} />
        </View>
    </TouchableOpacity>
);

const AccountSettingsScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Profile Picture Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.userName}>Sarah Jenkins</Text>
                    <Text style={styles.userEmail}>sarah.j@example.com</Text>
                </View>

                {/* Personal Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.card}>
                        <SettingRow
                            icon={User}
                            label="Full Name"
                            value="Sarah Jenkins"
                            onPress={() => { }}
                        />
                        <SettingRow
                            icon={Mail}
                            label="Email"
                            value="sarah.j@example.com"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* Security Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Security</Text>
                    <View style={styles.card}>
                        <SettingRow
                            icon={Lock}
                            label="Change Password"
                            onPress={() => { }}
                        />
                    </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'InterBold',
        color: '#0F1729',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    // Avatar Section
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#F1F5F9',
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2869BD',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 20,
        fontFamily: 'InterBold',
        color: '#1E293B',
    },
    userEmail: {
        fontSize: 14,
        fontFamily: 'InterRegular',
        color: '#64748B',
        marginTop: 4,
    },
    // Sections & Cards
    section: {
        marginTop: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontFamily: 'InterSemiBold',
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    dangerIconContainer: {
        backgroundColor: '#FEF2F2',
    },
    rowLabel: {
        fontSize: 15,
        fontFamily: 'InterMedium',
        color: '#1E293B',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowValue: {
        fontSize: 14,
        fontFamily: 'InterRegular',
        color: '#64748B',
        marginRight: 8,
    },
    dangerText: {
        color: '#EF4444',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        color: '#94A3B8',
    },
});

export default AccountSettingsScreen;