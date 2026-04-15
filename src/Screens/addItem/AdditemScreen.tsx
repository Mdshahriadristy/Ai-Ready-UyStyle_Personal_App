import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpFromLine, Camera, Image as ImageIcon } from 'lucide-react-native';
import { styles } from './style';

const AdditemScreen = () => {

    const handleTakePhoto = () => {
        console.log('Take photo');
    };

    const handleChooseGallery = () => {
        console.log('Choose from gallery');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
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

                {/* Options */}
                <TouchableOpacity
                    style={[styles.optionRow, styles.primeryButton]}
                    onPress={handleTakePhoto}
                    activeOpacity={0.8}
                >
                    <View style={[styles.optionIcon, styles.primeryButtonIcon]}>
                        <Camera size={20} color="#fff" />
                    </View>
                    <Text style={[styles.optionText, styles.primeryButtonText]}>Take Photo</Text>
                </TouchableOpacity>

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

            </View>
        </SafeAreaView>
    );
};



export default AdditemScreen;