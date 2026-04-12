import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

const ProfileEditScreen = ({ navigation }: any) => {
    const onBack = () => navigation.goBack();
    const [name, setName] = useState<string>('Sarah');
    const [email, setEmail] = useState<string>('sarah@example.com');
    const [phone, setPhone] = useState<string>('+1 234 567 890');
    const [bio, setBio] = useState<string>('Fashion lover & style enthusiast');

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
                    <ArrowLeft size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
                            <Camera size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor="#94a3b8"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter your phone"
                            placeholderTextColor="#94a3b8"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Write something about yourself"
                            placeholderTextColor="#94a3b8"
                            multiline
                            numberOfLines={3}
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85}
                    onPress={navigation.goBack}
                >
                    <Text style={styles.saveBtnText}>Save Changes</Text>
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

    // Header
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

    // Avatar
    avatarSection: {
        alignItems: 'center',
        paddingTop: 28,
        paddingBottom: 24,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#2869BD',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    changePhotoText: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: 'InterMedium',
        fontWeight: '500',
        color: '#2869BD',
    },

    // Form
    form: {
        paddingHorizontal: 20,
        gap: 16,
    },
    fieldGroup: {
        gap: 6,
    },
    fieldLabel: {
        fontSize: 14,
        fontFamily: 'InterRegular',
        fontWeight: '500',
        color: '#565E74',
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 14,
        fontSize: 14,
        fontFamily: 'InterRegular',
        color: '#1E293B',
    },
    textArea: {
        height: 90,
        textAlignVertical: 'top',
    },

    // Save Button
    saveBtn: {
        marginHorizontal: 20,
        marginTop: 28,
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

export default ProfileEditScreen;