import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpFromLine, Camera, ChevronLeft, Image as ImageIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const AdditemScreen = () => {

    const navigation = useNavigation();

    const handleTakePhoto = () => {
        // Handle camera logic
        console.log('Take photo');
    };

    const handleChooseGallery = () => {
        // Handle gallery logic
        console.log('Choose from gallery');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation?.goBack()}
                    style={styles.backBtn}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ChevronLeft size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Item</Text>
            </View>

            <View style={styles.container}>
                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Upload a clothing piece to add it to your closet.
                </Text>

                {/* Upload Box */}
                <TouchableOpacity
                    style={styles.uploadBox}
                    activeOpacity={0.8}
                    onPress={handleChooseGallery}
                >
                    <View style={styles.uploadIconWrapper}>
                        <ArrowUpFromLine size={26} color="#fff" />
                    </View>
                    <Text style={styles.uploadTitle}>Tap to upload photo</Text>
                    <Text style={styles.uploadSub}>Take a photo or choose from gallery</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Options */}
                <TouchableOpacity
                    style={styles.optionRow}
                    onPress={handleTakePhoto}
                    activeOpacity={0.8}
                >
                    <View style={styles.optionIcon}>
                        <Camera size={20} color="#fff" />
                    </View>
                    <Text style={styles.optionText}>Take Photo</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.optionRow}
                    onPress={handleChooseGallery}
                    activeOpacity={0.8}
                >
                    <View style={styles.optionIcon}>
                        <ImageIcon size={20} color="#fff" />
                    </View>
                    <Text style={styles.optionText}>Choose from Gallery</Text>
                </TouchableOpacity>

                <View style={styles.divider} />
            </View>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    backBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#1E293B',
    },

    // Container
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 13,
        fontFamily: 'InterRegular',
        fontWeight: '400',
        color: '#64748B',
        marginBottom: 20,
    },

    // Upload Box
    uploadBox: {
        width: '100%',
        height: 220,
        backgroundColor: '#F0F4FA',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        gap: 10,
    },
    uploadIconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: '#2869BD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    uploadTitle: {
        fontSize: 15,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#1E293B',
    },
    uploadSub: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        fontWeight: '400',
        color: '#94a3b8',
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
    },

    // Options
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        gap: 14,
    },
    optionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#2869BD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 15,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#1E293B',
    },
});

export default AdditemScreen;