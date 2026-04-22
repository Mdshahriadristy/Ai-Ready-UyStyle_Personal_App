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





import React, { useState, useEffect, useRef } from 'react';
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
    Animated,
    Keyboard,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ArrowUpFromLine,
    Camera,
    Image as ImageIcon,
    X,
    Plus,
    Pencil,
    Check,
    XIcon,
} from 'lucide-react-native';
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
    onSnapshot,
    query,
    where,
    deleteDoc,
    doc,
    updateDoc,
    getDocs,
} from '@react-native-firebase/firestore';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from '@react-native-firebase/storage';

// ─── Default built-in categories (not editable/deletable) ─────────────────────
const DEFAULT_CATEGORIES = ['Tops', 'Bottoms', 'Shoes', 'Outerwear', 'Accessories', 'Others'];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
    id: string;          // Firestore doc id ('' for defaults)
    name: string;
    isCustom: boolean;
}

// ─── Inline card for creating / editing a category ───────────────────────────
interface CategoryCardProps {
    visible: boolean;
    initialValue?: string;
    onSubmit: (name: string) => void;
    onCancel: () => void;
    loading: boolean;
    mode: 'create' | 'edit';
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    visible, initialValue = '', onSubmit, onCancel, loading, mode,
}) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (visible) {
            setValue(initialValue);
            Animated.spring(slideAnim, {
                toValue: 1, useNativeDriver: true, bounciness: 6,
            }).start(() => inputRef.current?.focus());
        } else {
            Animated.timing(slideAnim, {
                toValue: 0, duration: 180, useNativeDriver: true,
            }).start();
        }
    }, [visible, initialValue]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                categoryCardStyles.card,
                {
                    opacity: slideAnim,
                    transform: [{
                        translateY: slideAnim.interpolate({
                            inputRange: [0, 1], outputRange: [-8, 0],
                        }),
                    }],
                },
            ]}
        >
            <Text style={categoryCardStyles.cardTitle}>
                {mode === 'create' ? '✦ New Category' : '✎ Edit Category'}
            </Text>
            <TextInput
                ref={inputRef}
                style={categoryCardStyles.cardInput}
                value={value}
                onChangeText={setValue}
                placeholder="e.g. Swimwear, Loungewear…"
                placeholderTextColor="#94a3b8"
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={() => value.trim() && onSubmit(value.trim())}
            />
            <Text style={categoryCardStyles.charCount}>{value.length}/30</Text>

            <View style={categoryCardStyles.cardActions}>
                <TouchableOpacity
                    style={categoryCardStyles.cancelBtn}
                    onPress={() => { Keyboard.dismiss(); onCancel(); }}
                    activeOpacity={0.75}
                >
                    <Text style={categoryCardStyles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        categoryCardStyles.confirmBtn,
                        (!value.trim() || loading) && categoryCardStyles.confirmBtnDisabled,
                    ]}
                    onPress={() => value.trim() && onSubmit(value.trim())}
                    disabled={!value.trim() || loading}
                    activeOpacity={0.8}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" size="small" />
                        : <>
                            <Check size={14} color="#fff" style={{ marginRight: 4 }} />
                            <Text style={categoryCardStyles.confirmText}>
                                {mode === 'create' ? 'Create' : 'Save'}
                            </Text>
                          </>
                    }
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const AdditemScreen = () => {
    // ── Image state ──────────────────────────────────────────────────────────
    const [imageUri,  setImageUri]  = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<any>(null);

    // ── Form state ───────────────────────────────────────────────────────────
    const [title,    setTitle]    = useState('');
    const [category, setCategory] = useState('');
    const [color,    setColor]    = useState('');

    // ── Category state ───────────────────────────────────────────────────────
    const [categories,       setCategories]       = useState<Category[]>([]);
    const [showCreateCard,   setShowCreateCard]   = useState(false);
    const [editingCategory,  setEditingCategory]  = useState<Category | null>(null);
    const [categoryLoading,  setCategoryLoading]  = useState(false);

    // ── Upload state ─────────────────────────────────────────────────────────
    const [uploading, setUploading] = useState(false);
    const [uploadPct, setUploadPct] = useState(0);

    const app  = getApp();
    const auth = getAuth(app);
    const db   = getFirestore(app);
    const user = auth.currentUser;

    // ── defaults + Firestore custom categories ─────────────
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'categories'),
            where('userId', '==', user.uid),
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const defaults: Category[] = DEFAULT_CATEGORIES.map(name => ({
                id: '', name, isCustom: false,
            }));

            const custom: Category[] = snapshot.docs.map(d => ({
                id: d.id,
                name: d.data().name as string,
                isCustom: true,
            }));

            setCategories([...defaults, ...custom]);
        });

        return () => unsub();
    }, [user]);

    // ── Helpers ──────────────────────────────────────────────────────────────
    const allCategoryNames = () => categories.map(c => c.name.toLowerCase());

    const isDuplicate = (name: string, excludeId?: string) =>
        categories.some(
            c => c.name.toLowerCase() === name.toLowerCase() && c.id !== (excludeId ?? '__never__'),
        );

    // ── Create category ───────────────────────────────────────────────────────
    const handleCreateCategory = async (name: string) => {
        if (isDuplicate(name)) {
            Alert.alert('Duplicate', `"${name}" already exists.`);
            return;
        }
        if (!user) return;

        setCategoryLoading(true);
        try {
            const docRef = await addDoc(collection(db, 'categories'), {
                userId:    user.uid,
                name:      name.trim(),
                createdAt: serverTimestamp(),
            });
            setCategory(name.trim());  
            setShowCreateCard(false);
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setCategoryLoading(false);
        }
    };

    // ── Edit category ────────────────────────────────────────────────────────
    const handleEditCategory = async (name: string) => {
        if (!editingCategory) return;
        if (isDuplicate(name, editingCategory.id)) {
            Alert.alert('Duplicate', `"${name}" already exists.`);
            return;
        }

        setCategoryLoading(true);
        try {
            await updateDoc(doc(db, 'categories', editingCategory.id), {
                name: name.trim(),
            });
            if (category === editingCategory.name) setCategory(name.trim());
            setEditingCategory(null);
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setCategoryLoading(false);
        }
    };

    // ── Delete category ───────────────────────────────────────────────────────
    const confirmDelete = (cat: Category) => {
        Alert.alert(
            'Delete Category',
            `Remove "${cat.name}"? Items already tagged will keep this value.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'categories', cat.id));
                            if (category === cat.name) setCategory('');
                        } catch (e: any) {
                            Alert.alert('Error', e.message);
                        }
                    },
                },
            ],
        );
    };

    // ── Image Picker ──────────────────────────────────────────────────────────
    const handleAddImage = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                { options: [ '📁 Choose from Gallery'], cancelButtonIndex: 0 },
                (index) => {
                 
                    if (index === 2) openGallery();
                }
            );
        } else {
            Alert.alert('Add Photo', 'Choose an option', [
                { text: 'Cancel',                  style: 'cancel' },
                { text: '📁 Choose from Gallery',  onPress: openGallery },
            ]);
        }
    };

    const openCamera  = () => launchCamera(  { mediaType: 'photo', saveToPhotos: false }, handleImageResponse);
    const openGallery = () => launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, handleImageResponse);

    const handleImageResponse = (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (asset?.uri) { setImageUri(asset.uri); setImageFile(asset); }
    };

    const clearImage = () => { setImageUri(null); setImageFile(null); };

    // ── Upload to Storage ─────────────────────────────────────────────────────
    const uploadImage = async (uid: string): Promise<string> => {
        const storage  = getStorage(app);
        const fileRef  = ref(storage, `closet/${uid}/${Date.now()}.jpg`);
        const response = await fetch(imageFile.uri);
        const blob     = await response.blob();

        return new Promise((resolve, reject) => {
            const task = uploadBytesResumable(fileRef, blob);
            task.on(
                'state_changed',
                (snap) => setUploadPct(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
                reject,
                async () => {
                    const url = await getDownloadURL(task.snapshot!.ref);
                    resolve(url);
                },
            );
        });
    };

    // ── Validation ────────────────────────────────────────────────────────────
    const validate = (): boolean => {
        if (!imageUri)      { Alert.alert('Required', 'Please select an image first.');        return false; }
        if (!title.trim())  { Alert.alert('Required', 'Please enter a title for the item.');   return false; }
        if (!category)      { Alert.alert('Required', 'Please select or create a category.');  return false; }
        return true;
    };

    // ── Save item ─────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!validate() || !user) return;
        setUploading(true);
        try {
            const imageURL = await uploadImage(user.uid);
            await addDoc(collection(db, 'closetItems'), {
                userId:    user.uid,
                title:     title.trim(),
                category,
                color:     color.trim(),
                imageURL,
                createdAt: serverTimestamp(),
            });
            Alert.alert('Success!', 'Item added to your closet.', [{
                text: 'OK',
                onPress: () => {
                    setImageUri(null); setImageFile(null);
                    setTitle(''); setCategory(''); setColor('');
                    setUploadPct(0);
                },
            }]);
        } catch (e: any) {
            Alert.alert('Error', e.message);
        } finally {
            setUploading(false); setUploadPct(0);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
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
                            <TouchableOpacity style={styles.removeBtn} onPress={clearImage} activeOpacity={0.8}>
                                <X size={16} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.changeBtn} onPress={handleAddImage} activeOpacity={0.8}>
                                <Text style={styles.changeBtnText}>Change Photo</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8} onPress={handleAddImage}>
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
                            <TouchableOpacity style={[styles.optionRow, styles.primeryButton]} onPress={openCamera} activeOpacity={0.8}>
                                <View style={[styles.optionIcon, styles.primeryButtonIcon]}>
                                    <Camera size={20} color="#fff" />
                                </View>
                                <Text style={[styles.optionText, styles.primeryButtonText]}>Take Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionRow} onPress={openGallery} activeOpacity={0.8}>
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

                            {/* ── Category Section ── */}
                            <View style={styles.fieldGroup}>
                                <View style={categoryStyles.labelRow}>
                                    <Text style={styles.fieldLabel}>
                                        Category <Text style={styles.required}>*</Text>
                                    </Text>
                                    {category !== '' && (
                                        <Text style={categoryStyles.selectedBadge}>{category}</Text>
                                    )}
                                </View>

                                {/* Chip grid */}
                                <View style={styles.categoryRow}>
                                    {categories.map((cat) => (
                                        <View key={cat.id || cat.name} style={categoryStyles.chipWrapper}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.categoryChip,
                                                    category === cat.name && styles.categoryChipActive,
                                                    categoryStyles.chip,
                                                ]}
                                                onPress={() => {
                                                    setCategory(cat.name);
                                                    setShowCreateCard(false);
                                                    setEditingCategory(null);
                                                }}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={[
                                                    styles.categoryChipText,
                                                    category === cat.name && styles.categoryChipTextActive,
                                                ]}>
                                                    {cat.name}
                                                </Text>
                                            </TouchableOpacity>

                                            {/* Edit / Delete icons — custom categories only */}
                                            {cat.isCustom && (
                                                <View style={categoryStyles.chipActions}>
                                                    <TouchableOpacity
                                                        style={categoryStyles.chipActionBtn}
                                                        onPress={() => confirmDelete(cat)}
                                                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                                    >
                                                        <XIcon size={15} color="#ef4444" />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    ))}

                                    {/* + Create New Category chip */}
                                    <TouchableOpacity
                                        style={[
                                            categoryStyles.createChip,
                                            showCreateCard && categoryStyles.createChipActive,
                                        ]}
                                        onPress={() => {
                                            setEditingCategory(null);
                                            setShowCreateCard(prev => !prev);
                                        }}
                                        activeOpacity={0.75}
                                    >
                                        <Plus size={15} color={showCreateCard ? '#fff' : '#0f172a'}  />
                                        <Text style={[
                                            categoryStyles.createChipText,
                                            showCreateCard && categoryStyles.createChipTextActive,
                                        ]}>
                                            Create New
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* ── Inline Create Card ── */}
                                <CategoryCard
                                    visible={showCreateCard}
                                    mode="create"
                                    onSubmit={handleCreateCategory}
                                    onCancel={() => setShowCreateCard(false)}
                                    loading={categoryLoading}
                                />

                                {/* ── Inline Edit Card ── */}
                                <CategoryCard
                                    visible={!!editingCategory}
                                    mode="edit"
                                    initialValue={editingCategory?.name ?? ''}
                                    onSubmit={handleEditCategory}
                                    onCancel={() => setEditingCategory(null)}
                                    loading={categoryLoading}
                                />
                            </View>

                            {/* Color */}
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
                                    <View style={{ alignItems: 'center' }}>
                                        <ActivityIndicator color="#fff" />
                                        {uploadPct > 0 && (
                                            <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>
                                                {uploadPct}%
                                            </Text>
                                        )}
                                    </View>
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

// ─── Local styles for category feature ───────────────────────────────────────
import { StyleSheet } from 'react-native';

const categoryStyles = StyleSheet.create({
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    selectedBadge: {
        fontSize: 11,
        color: '#0f172a',
        backgroundColor: '#e2e8f0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 99,
        fontWeight: '600',
    },
    chip: {
        marginBottom: 0,   
    },
    chipWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        marginRight: 8,
        marginBottom: 10,
    },
chipActions: {
    position: 'absolute',
    top: -15,     
    right: -1,    
    flexDirection: 'row',
    gap: 4,
    zIndex: 10,
},
    chipActionBtn: {
        padding: 2,
        
  
    },
    createChip: {
        flexDirection: 'row',
        alignItems: 'center',
        height:40,
        marginBottom:30,
        borderRadius:99,
        padding:10,
        backgroundColor:'#94a3b8'

    },
    createChipActive: {
        backgroundColor: '#0f172a',
        height:40,
       padding:10,
        borderRadius:100,
    },
    createChipText: {
        fontSize: 13,
        fontWeight: '600',
   
        


    },
    createChipTextActive: {
        color: '#fff',
        textAlign:'center',

    },
});

const categoryCardStyles = StyleSheet.create({
    card: {
        marginTop: 4,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 10,
        letterSpacing: 0.2,
    },
    cardInput: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#cbd5e1',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 14,
        color: '#0f172a',
        fontWeight: '500',
    },
    charCount: {
        fontSize: 11,
        color: '#94a3b8',
        textAlign: 'right',
        marginTop: 4,
        marginBottom: 2,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#e2e8f0',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
    },
    confirmBtn: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmBtnDisabled: {
        backgroundColor: '#94a3b8',
    },
    confirmText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
});