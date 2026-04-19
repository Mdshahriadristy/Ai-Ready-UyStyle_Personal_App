// import React from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ArrowUpFromLine, Camera, Image as ImageIcon } from 'lucide-react-native';
// import { styles } from './style';

// const AdditemScreen = () => {

//     const handleTakePhoto = () => {
//         console.log('Take photo');
//     };

//     const handleChooseGallery = () => {
//         console.log('Choose from gallery');
//     };

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <StatusBar barStyle="dark-content" backgroundColor="#fff" />

//             {/* Header */}
//             <View style={styles.header}>
//                 <Text style={styles.headerTitle}>Add New Item</Text>
//             </View>

//             <View style={styles.container}>
//                 {/* Subtitle */}
//                 <Text style={styles.subtitle}>
//                     Upload a clothing piece to add it to your closet.
//                 </Text>

//                 {/* Upload Box */}
//                 <TouchableOpacity
//                     style={styles.uploadBox}
//                     activeOpacity={0.8}
//                     onPress={handleChooseGallery}
//                 >
//                     <View style={styles.uploadIconWrapper}>
//                         <ArrowUpFromLine size={26} color="#fff" />
//                     </View>
//                     <Text style={styles.uploadTitle}>Tap to upload photo</Text>
//                     <Text style={styles.uploadSub}>Take a photo or choose from gallery</Text>
//                 </TouchableOpacity>

//                 {/* Options */}
//                 <TouchableOpacity
//                     style={[styles.optionRow, styles.primeryButton]}
//                     onPress={handleTakePhoto}
//                     activeOpacity={0.8}
//                 >
//                     <View style={[styles.optionIcon, styles.primeryButtonIcon]}>
//                         <Camera size={20} color="#fff" />
//                     </View>
//                     <Text style={[styles.optionText, styles.primeryButtonText]}>Take Photo</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     style={styles.optionRow}
//                     onPress={handleChooseGallery}
//                     activeOpacity={0.8}
//                 >
//                     <View style={styles.optionIcon}>
//                         <ImageIcon size={20} color="#fff" />
//                     </View>
//                     <Text style={styles.optionText}>Choose from Gallery</Text>
//                 </TouchableOpacity>

//             </View>
//         </SafeAreaView>
//     );
// };



// export default AdditemScreen;







import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    Platform,
    ActionSheetIOS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpFromLine, Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { styles } from './style';
import {
    launchCamera,
    launchImageLibrary,
    ImagePickerResponse,
} from 'react-native-image-picker';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
} from '@react-native-firebase/firestore';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from '@react-native-firebase/storage';

const CATEGORIES = ['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories', 'Others'];

const AdditemScreen = () => {
    // ── Image state ──────────────────────────────────────
    const [imageUri,   setImageUri]   = useState<string | null>(null);
    const [imageFile,  setImageFile]  = useState<any>(null);

    // ── Form state ───────────────────────────────────────
    const [title,       setTitle]       = useState('');

    const [category,    setCategory]    = useState('');
    const [color,       setColor]       = useState('');

    // ── UI state ─────────────────────────────────────────
    const [uploading,  setUploading]  = useState(false);
    const [uploadPct,  setUploadPct]  = useState(0);

    const app  = getApp();
    const auth = getAuth(app);
    const db   = getFirestore(app);
    const user = auth.currentUser;

    // ── Image Picker ──────────────────────────────────────
    const handleAddImage = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options:           ['Cancel', 
                         
                        '📷 Take Photo', 
                        '📁 Choose from Gallery'],
                    cancelButtonIndex:  0,
                },
                (index) => {
                    if (index === 1) openCamera();
                    if (index === 2) openGallery();
                }
            );
        } else {
            Alert.alert('Add Photo', 'Choose an option', [
                { text: 'Cancel',              style: 'cancel'      },
                { text: '📷 Take Photo',       onPress: openCamera  },
                { text: '📁 Choose from Gallery', onPress: openGallery },
            ]);
        }
    };

    const openCamera = () => {
        launchCamera(
            { mediaType: 'photo',  saveToPhotos: false },
            handleImageResponse
        );
    };

    const openGallery = () => {
        launchImageLibrary(
            { mediaType: 'photo',  selectionLimit: 1 },
            handleImageResponse
        );
    };

    const handleImageResponse = (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (asset?.uri) {
            setImageUri(asset.uri);
            setImageFile(asset);
        }
    };

    const clearImage = () => {
        setImageUri(null);
        setImageFile(null);
    };

    // ── Upload to Firebase Storage ────────────────────────
    const uploadImage = async (uid: string): Promise<string> => {
        const storage   = getStorage(app);
        const filename  = `closet/${uid}/${Date.now()}.jpg`;
        const fileRef   = ref(storage, filename);
        const response  = await fetch(imageFile.uri);
        const blob      = await response.blob();

        return new Promise((resolve, reject) => {
            const task = uploadBytesResumable(fileRef, blob);

            task.on(
                'state_changed',
                (snapshot) => {
                    const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadPct(Math.round(pct));
                },
                (error) => reject(error),
                async () => {
                    const snapshot = task.snapshot;
                    if (!snapshot) {
                        reject(new Error('Upload failed'));
                        return;
                    }
                    const url = await getDownloadURL(snapshot.ref);
                    resolve(url);
                }
            );
        });
    };

    // ── Validation ────────────────────────────────────────
    const validate = (): boolean => {
        if (!imageUri) {
            Alert.alert('Required', 'Please select an image first.');
            return false;
        }
        if (!title.trim()) {
            Alert.alert('Required', 'Please enter a title for the item.');
            return false;
        }
        if (!category) {
            Alert.alert('Required', 'Please select a category.');
            return false;
        }
        return true;
    };

    // ── Save to Firestore ─────────────────────────────────
    const handleSave = async () => {
        if (!validate()) return;
        if (!user) return;

        setUploading(true);
        try {
            // Step 1: upload image
            const imageURL = await uploadImage(user.uid);

            // Step 2: save to Firestore
            await addDoc(collection(db, 'closetItems'), {
                userId:      user.uid,
                title:       title.trim(),
       
                category,
                color:       color.trim(),
                imageURL,
                createdAt:   serverTimestamp(),
            });

            Alert.alert('Success!', 'Item added to your closet.', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Reset form
                        setImageUri(null);
                        setImageFile(null);
                        setTitle('');

                        setCategory('');
                        setColor('');
                        setUploadPct(0);
                    },
                },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setUploading(false);
            setUploadPct(0);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Add New Item</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Text style={styles.subtitle}>
                        Upload a clothing piece to add it to your closet.
                    </Text>

                    {/* ── Image Preview / Upload Box ── */}
                    {imageUri ? (
                        <View style={styles.previewWrapper}>
                            <Image source={{ uri: imageUri }} style={styles.previewImage} />
                            <TouchableOpacity
                                style={styles.removeBtn}
                                onPress={clearImage}
                                activeOpacity={0.8}
                            >
                                <X size={16} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.changeBtn}
                                onPress={handleAddImage}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.changeBtnText}>Change Photo</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.uploadBox}
                            activeOpacity={0.8}
                            onPress={handleAddImage}
                        >
                            <View style={styles.uploadIconWrapper}>
                                <ArrowUpFromLine size={26} color="#fff" />
                            </View>
                            <Text style={styles.uploadTitle}>Tap to upload photo</Text>
                            <Text style={styles.uploadSub}>Take a photo or choose from gallery</Text>
                        </TouchableOpacity>
                    )}

                    {/* ── Camera / Gallery Buttons ── */}
                    {!imageUri && (
                        <>
                            <TouchableOpacity
                                style={[styles.optionRow, styles.primeryButton]}
                                onPress={openCamera}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.optionIcon, styles.primeryButtonIcon]}>
                                    <Camera size={20} color="#fff" />
                                </View>
                                <Text style={[styles.optionText, styles.primeryButtonText]}>
                                    Take Photo
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.optionRow}
                                onPress={openGallery}
                                activeOpacity={0.8}
                            >
                                <View style={styles.optionIcon}>
                                    <ImageIcon size={20} color="#fff" />
                                </View>
                                <Text style={styles.optionText}>Choose from Gallery</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* ── Item Details Form ── */}
                    {imageUri && (
                        <View style={styles.form}>
                            <Text style={styles.formTitle}>Item Details</Text>

                            {/* Title */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>
                                    Title <Text style={styles.required}>*</Text>
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="e.g. White Cotton T-Shirt"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>

                            {/* Category */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>
                                    Category <Text style={styles.required}>*</Text>
                                </Text>
                                <View style={styles.categoryRow}>
                                    {CATEGORIES.map((cat) => (
                                        <TouchableOpacity
                                            key={cat}
                                            style={[
                                                styles.categoryChip,
                                                category === cat && styles.categoryChipActive,
                                            ]}
                                            onPress={() => setCategory(cat)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.categoryChipText,
                                                category === cat && styles.categoryChipTextActive,
                                            ]}>
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Brand */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.fieldLabel}>Color</Text>
                                <TextInput
                                    style={styles.input}
                                    value={color}
                                    onChangeText={setColor}
                                    placeholder="Blue"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>


                            {/* Save Button */}
                            <TouchableOpacity
                                style={[styles.saveBtn, uploading && styles.saveBtnDisabled]}
                                onPress={handleSave}
                                disabled={uploading}
                                activeOpacity={0.85}
                            >
                                {uploading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveBtnText}>Add to Closet</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AdditemScreen;






