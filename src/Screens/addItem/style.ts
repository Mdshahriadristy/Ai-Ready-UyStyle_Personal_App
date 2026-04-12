import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'InterBold',
        fontWeight: '700',
        color: '#0F1729',
    },

    // Container
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    subtitle: {
        fontSize: 13,
        fontFamily: 'InterRegular',
        fontWeight: '400',
        color: '#65758B',
        marginBottom: 48,
        marginTop: -6,
    },

    // Upload Box
    uploadBox: {
        width: '100%',
        height: 244,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    uploadIconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#2869BD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    uploadTitle: {
        fontSize: 16,
        fontFamily: 'InterBold',
        fontWeight: '600',
        color: '#0F1729',
        marginTop: 20,
    },
    uploadSub: {
        fontSize: 12,
        fontFamily: 'InterRegular',
        fontWeight: '400',
        color: '#65758B',
        marginTop: 3,
    },

    // Options
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        gap: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingHorizontal: 17,
        marginBottom: 12,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#2869BD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 15,
        fontFamily: 'InterSemiBold',
        fontWeight: '600',
        color: '#0F1729',
    },
});