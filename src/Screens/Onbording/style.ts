import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    background: { flex: 1 },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '700',
        marginTop: 17,
        textAlign: 'center',
        fontFamily: 'InterBold',
    },
    subtitle: {
        color: '#F5F3EE',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'InterRegular',
        fontWeight: '400',
    },
    bottomBar: {
        backgroundColor: '#1E293B',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingTop: 14,
        paddingBottom: 36,
        alignItems: 'center',
        gap: 16,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    dot: {
        height: 10,
        borderRadius: 48,
    },
    dotActive: {
        width: 26,
        backgroundColor: '#3F8EFC',
    },
    dotInactive: {
        width: 12,
        height: 10,
        backgroundColor: '#F5F3EE',
    },
    nextButton: {
        width: '100%',
        backgroundColor: '#2869BD',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '500',
        fontFamily: 'InterMedium',
    },
    loginText: {
        color: '#ffffffff',
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'InterRegular',
        marginBottom: 10,
    },
})