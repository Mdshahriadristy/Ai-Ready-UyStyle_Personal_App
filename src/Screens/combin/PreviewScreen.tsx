import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Share2, Download } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PreviewScreen = ({ route, navigation }: any) => {
    // Get items passed from CombineScreen
    const { items = [] } = route.params || {};

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Preview Look</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Share2 size={22} color="#1E293B" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {items.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No items selected to preview.</Text>
                    </View>
                ) : (
                    <View style={styles.previewCard}>
                        {/* Main Collage Area */}
                        <View style={styles.collageContainer}>
                            {items.map((item: any, index: number) => (
                                <View
                                    key={item.id}
                                    style={[
                                        styles.previewImageWrapper,
                                        index === 0 && styles.largeImage
                                    ]}
                                >
                                    <Image source={{ uri: item.image }} style={styles.previewImage} />
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{item.category}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Details List */}
                        <View style={styles.detailsContainer}>
                            <Text style={styles.summaryTitle}>Outfit Summary</Text>
                            {items.map((item: any) => (
                                <View key={item.id} style={styles.detailRow}>
                                    <Text style={styles.detailCategory}>{item.category}:</Text>
                                    <Text style={styles.detailLabel}>{item.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.downloadBtn}>
                    <Download size={20} color="#0F1729" />
                    <Text style={styles.downloadBtnText}>Save to Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.doneBtn}
                    onPress={() => navigation.navigate('bottombar')}
                >
                    <Text style={styles.doneBtnText}>Confirm Look</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F1729',
        fontFamily: 'InterBold',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
    },
    scrollContent: {
        padding: 20,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        color: '#64748B',
        fontSize: 16,
    },
    previewCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    collageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    previewImageWrapper: {
        width: (width - 100) / 2,
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F1F5F9',
    },
    largeImage: {
        width: '100%',
        height: 250,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#2869BD',
        textTransform: 'uppercase',
    },
    detailsContainer: {
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F1729',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailCategory: {
        width: 90,
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    detailLabel: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '600',
    },
    bottomBar: {
        padding: 20,
        paddingBottom: 30,
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 12,
    },
    downloadBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        height: 56,
    },
    downloadBtnText: {
        color: '#0F1729',
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'InterSemiBold',
    },
    doneBtn: {
        flex: 1,
        backgroundColor: '#2869BD',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
    },
    doneBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'InterSemiBold',
    },
});

export default PreviewScreen;