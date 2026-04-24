import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
    bg:           '#FFFFFF',
    surface:      '#F7F7F7',
    surfaceRaise: '#F0F0F0',
    border:       '#EBEBEB',
    borderMid:    '#E0E0E0',
    accent:       '#C9960A',    // deep gold (readable on white)
    accentMuted:  '#FFF8E0',
    textPrimary:  '#111111',
    textSecondary:'#666666',
    textMuted:    '#AAAAAA',
    userBubble:   '#C9960A',
    userText:     '#FFFFFF',
    aiBubble:     '#F4F4F4',
    aiText:       '#1a1a1a',
};

export const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: C.bg,
    },
    flex: {
        flex: 1,
    },

    // ─── Header ────────────────────────────────────────────────────────────────
    header: {
        flexDirection:    'row',
        alignItems:       'center',
        justifyContent:   'space-between',
        paddingHorizontal: 18,
        paddingVertical:  14,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        backgroundColor:  C.bg,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           12,
    },
    headerAvatarWrap: {
        width:           40,
        height:          40,
        borderRadius:    20,
        backgroundColor: C.accentMuted,
        borderWidth:     1,
        borderColor:     '#E8C000',
        alignItems:      'center',
        justifyContent:  'center',
    },
    headerTitle: {
        fontSize:    17,
        fontWeight:  '700',
        color:       C.textPrimary,
        letterSpacing: -0.3,
    },
    headerSub: {
        fontSize:  12,
        color:     C.textSecondary,
        marginTop: 1,
    },
    clearBtn: {
        width:           36,
        height:          36,
        borderRadius:    18,
        backgroundColor: C.surfaceRaise,
        borderWidth:     1,
        borderColor:     C.border,
        alignItems:      'center',
        justifyContent:  'center',
    },

    // ─── API key error banner ──────────────────────────────────────────────────
    keyErrorBar: {
        flexDirection:    'row',
        alignItems:       'center',
        paddingHorizontal: 16,
        paddingVertical:  10,
        backgroundColor:  '#FFF0F0',
        borderBottomWidth: 1,
        borderBottomColor: '#FFCCCC',
    },
    keyErrorText: {
        fontSize:  12,
        color:     '#CC3333',
        flex:      1,
        lineHeight: 18,
    },
    keyErrorPath: {
        fontWeight:    '700',
        color:         '#AA2222',
        letterSpacing: 0.3,
    },

    // ─── Wardrobe loading bar ──────────────────────────────────────────────────
    wardrobeLoadingBar: {
        flexDirection:    'row',
        alignItems:       'center',
        gap:              8,
        paddingHorizontal: 18,
        paddingVertical:  9,
        backgroundColor:  C.accentMuted,
        borderBottomWidth: 1,
        borderBottomColor: '#F0E080',
    },
    wardrobeLoadingText: {
        fontSize:  12,
        color:     '#906B00',
        fontWeight: '500',
    },

    // ─── Messages list ─────────────────────────────────────────────────────────
    messagesList: {
        paddingHorizontal: 16,
        paddingTop:        20,
        paddingBottom:     12,
        gap:               14,
    },

    // ─── Message row ───────────────────────────────────────────────────────────
    messageRow: {
        flexDirection: 'row',
        alignItems:    'flex-end',
        gap:           8,
        marginBottom:  4,
    },
    messageRowUser: {
        justifyContent: 'flex-end',
    },
    messageRowAssistant: {
        justifyContent: 'flex-start',
    },
    avatarDot: {
        width:           30,
        height:          30,
        borderRadius:    15,
        backgroundColor: C.accentMuted,
        borderWidth:     1,
        borderColor:     '#E8C000',
        alignItems:      'center',
        justifyContent:  'center',
        marginBottom:    2,
    },
    bubbleWrapper: {
        maxWidth: SCREEN_W * 0.78,
    },

    // ─── Bubbles ───────────────────────────────────────────────────────────────
    bubble: {
        borderRadius:   18,
        paddingHorizontal: 14,
        paddingVertical:   10,
    },
    bubbleUser: {
        backgroundColor: C.userBubble,
        borderBottomRightRadius: 4,
    },
    bubbleAssistant: {
        backgroundColor:       C.aiBubble,
        borderWidth:           1,
        borderColor:           C.border,
        borderBottomLeftRadius: 4,
    },
    bubbleText: {
        fontSize:   15,
        lineHeight: 22,
    },
    bubbleTextUser: {
        color:      C.userText,
        fontWeight: '500',
    },
    bubbleTextAssistant: {
        color: C.aiText,
    },
    timestamp: {
        fontSize:  10,
        color:     C.textMuted,
        marginTop: 4,
        marginLeft: 4,
    },
    timestampRight: {
        textAlign: 'right',
        marginRight: 4,
        marginLeft:  0,
    },

    // ─── Typing indicator ──────────────────────────────────────────────────────
    typingBubble: {
        backgroundColor: C.aiBubble,
        borderWidth:     1,
        borderColor:     C.border,
        borderRadius:    18,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 16,
        paddingVertical:   14,
    },
    typingDotsRow: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           6,
    },
    typingDot: {
        width:           7,
        height:          7,
        borderRadius:    3.5,
        backgroundColor: C.accent,
    },

    // ─── Outfit cards ──────────────────────────────────────────────────────────
    outfitsContainer: {
        marginTop: 10,
        gap:       10,
    },
    outfitCard: {
        backgroundColor: C.surfaceRaise,
        borderRadius:    16,
        borderWidth:     1,
        borderColor:     C.borderMid,
        overflow:        'hidden',
    },
    outfitCardHeader: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center',
        paddingHorizontal: 14,
        paddingTop:     12,
        paddingBottom:  10,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
    },
    outfitCardMeta: {
        flex: 1,
    },
    outfitCardName: {
        fontSize:   14,
        fontWeight: '700',
        color:      C.textPrimary,
        letterSpacing: -0.2,
    },
    outfitCardOccasion: {
        fontSize:  11,
        color:     C.textSecondary,
        marginTop: 2,
    },
    outfitCardBadge: {
        backgroundColor: C.accentMuted,
        borderRadius:    100,
        paddingHorizontal: 10,
        paddingVertical:   4,
        borderWidth:     1,
        borderColor:     '#E8C000',
    },
    outfitCardBadgeText: {
        fontSize:  10,
        fontWeight: '700',
        color:     C.accent,
        letterSpacing: 0.5,
    },

    // Outfit items horizontal scroll
    outfitItemsRow: {
        paddingHorizontal: 12,
        paddingVertical:   12,
        gap:               10,
    },
    outfitItemTile: {
        width:      76,
        alignItems: 'flex-start',
    },
    outfitItemImage: {
        width:        76,
        height:       96,
        borderRadius: 10,
        backgroundColor: C.surface,
        marginBottom:  6,
    },
    outfitItemFallback: {
        width:           76,
        height:          96,
        borderRadius:    10,
        backgroundColor: C.surface,
        borderWidth:     1,
        borderColor:     C.border,
        alignItems:      'center',
        justifyContent:  'center',
        marginBottom:    6,
    },
    outfitItemFallbackText: {
        fontSize:   24,
        color:      C.textMuted,
        fontWeight: '700',
    },
    outfitItemCategory: {
        fontSize:      9,
        fontWeight:    '700',
        letterSpacing: 0.8,
        color:         C.accent,
        textTransform: 'uppercase',
        marginBottom:  2,
    },
    outfitItemTitle: {
        fontSize:   11,
        fontWeight: '500',
        color:      '#777777',
    },
    outfitItemColor: {
        fontSize:  10,
        color:     C.textMuted,
        marginTop: 1,
    },

    // ─── Quick prompts ─────────────────────────────────────────────────────────
    quickPromptsWrap: {
        paddingTop:  20,
        paddingBottom: 8,
    },
    quickPromptsLabel: {
        fontSize:      10,
        fontWeight:    '700',
        letterSpacing: 1.4,
        color:         C.textMuted,
        textTransform: 'uppercase',
        marginBottom:  10,
        paddingLeft:   2,
    },
    quickPromptsGrid: {
        flexDirection: 'row',
        flexWrap:      'wrap',
        gap:           8,
    },
    promptChip: {
        backgroundColor: C.surface,
        borderWidth:     1,
        borderColor:     C.borderMid,
        borderRadius:    100,
        paddingHorizontal: 14,
        paddingVertical:   8,
    },
    promptChipText: {
        fontSize:  13,
        color:     C.textSecondary,
        fontWeight: '500',
    },

    // ─── Input bar ─────────────────────────────────────────────────────────────
    inputSafeArea: {
        backgroundColor: C.bg,
    },
    inputBar: {
        flexDirection:    'row',
        alignItems:       'flex-end',
        gap:              10,
        paddingHorizontal: 14,
        paddingTop:       10,
        paddingBottom:    12,
        borderTopWidth:   1,
        borderTopColor:   C.border,
        backgroundColor:  C.bg,
    },
    inputWrap: {
        flex:            1,
        backgroundColor: C.surface,
        borderWidth:     1,
        borderColor:     C.borderMid,
        borderRadius:    20,
        paddingHorizontal: 16,
        paddingTop:       10,
        paddingBottom:    10,
        minHeight:        44,
        maxHeight:        120,
        justifyContent:  'center',
    },
    input: {
        fontSize:  15,
        color:     C.textPrimary,
        lineHeight: 22,
        padding:   0,
        margin:    0,
    },
    sendBtn: {
        width:           44,
        height:          44,
        borderRadius:    22,
        backgroundColor: C.accent,
        alignItems:      'center',
        justifyContent:  'center',
        marginBottom:    0,
    },
    sendBtnDisabled: {
        opacity: 0.45,
    },
});