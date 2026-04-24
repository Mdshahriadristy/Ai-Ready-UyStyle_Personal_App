import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StatusBar,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Sparkles, RefreshCw, Shirt } from 'lucide-react-native';
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    QueryDocumentSnapshot,
    DocumentData,
} from '@react-native-firebase/firestore';
import { styles } from './Style';

// ─── Config ───────────────────────────────────────────────────────────────────
// API key is fetched at runtime from Firestore:
//   Collection : 'config'   Document : 'keys'   Field : 'anthropicKey'
// ─────────────────────────────────────────────────────────────────────────────
const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

// ─── Types ────────────────────────────────────────────────────────────────────

type WardrobeItem = {
    id: string;
    title: string;
    category: string;
    color: string;
    imageURL: string;
};

type SuggestedOutfit = {
    name: string;
    occasion: string;
    items: WardrobeItem[];
};

type ChatRole = 'user' | 'assistant';

type Message = {
    id: string;
    role: ChatRole;
    text: string;
    outfits?: SuggestedOutfit[];
    isLoading?: boolean;
    timestamp: Date;
};

type AIResponse = {
    text: string;
    outfits?: { name: string; occasion: string; itemIds: string[] }[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
    "What should I wear today? 🌤️",
    "Suggest a casual weekend look",
    "Give me a night out outfit",
    "What matches my blue jeans?",
    "Build a gym outfit for me",
    "Best outfit for a date night?",
];

// ─── Firestore mapper ─────────────────────────────────────────────────────────

const mapDocToItem = (d: QueryDocumentSnapshot<DocumentData>): WardrobeItem => {
    const data = d.data();
    const itemDetails = data.itemDetails || {};
    const firstKey = Object.keys(itemDetails)[0];
    const details  = itemDetails[firstKey] || {};
    return {
        id:       d.id,
        title:    details.title    || 'Untitled',
        category: details.category || 'Uncategorized',
        color:    details.color    || '',
        imageURL: details.imageURL || '',
    };
};

// ─── Build wardrobe context string for AI ─────────────────────────────────────

const buildWardrobeContext = (wardrobe: WardrobeItem[]): string => {
    if (wardrobe.length === 0) return 'The user has no saved wardrobe items yet.';
    const grouped: Record<string, WardrobeItem[]> = {};
    wardrobe.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
    });
    return Object.entries(grouped)
        .map(([cat, items]) =>
            `${cat}:\n` +
            items.map(i => `  - [ID:${i.id}] "${i.title}" (${i.color})`).join('\n')
        )
        .join('\n\n');
};

// ─── System Prompt ────────────────────────────────────────────────────────────

const buildSystemPrompt = (wardrobe: WardrobeItem[]): string => `
You are a personal AI fashion stylist. You help users create stylish outfits from their saved wardrobe.

USER'S WARDROBE INVENTORY:
${buildWardrobeContext(wardrobe)}

RESPONSE RULES:
1. Always respond in valid JSON with this exact structure:
{
  "text": "Your friendly stylist message here",
  "outfits": [
    {
      "name": "Outfit name",
      "occasion": "When to wear it",
      "itemIds": ["item-id-1", "item-id-2"]
    }
  ]
}

2. The "outfits" array is OPTIONAL. Only include it when suggesting specific outfit combinations.
3. itemIds must be REAL IDs from the wardrobe inventory above (format [ID:xxx]).
4. Suggest 1–3 outfits max per response. Keep text warm, concise, and stylish.
5. If the wardrobe is empty or lacks items for the request, say so kindly and give general advice.
6. If a question is not about fashion or styling, politely redirect to wardrobe topics.
7. ALWAYS return valid JSON. Never return plain text.
`.trim();

// ─── Anthropic API call ───────────────────────────────────────────────────────

async function callAI(
    apiKey: string,
    systemPrompt: string,
    history: { role: ChatRole; content: string }[],
    userMessage: string,
): Promise<AIResponse> {
    const messages = [
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: userMessage },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model:      ANTHROPIC_MODEL,
            max_tokens: 1024,
            system:     systemPrompt,
            messages,
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text ?? '{"text":"Sorry, I had trouble responding."}';

    try {
        // Strip markdown fences if present
        const clean = rawText.replace(/```json\n?|```\n?/g, '').trim();
        return JSON.parse(clean) as AIResponse;
    } catch {
        return { text: rawText };
    }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated "typing" dots for the AI loading state */
const TypingIndicator: React.FC = () => {
    const dots = [useRef(new Animated.Value(0)).current,
                  useRef(new Animated.Value(0)).current,
                  useRef(new Animated.Value(0)).current];

    useEffect(() => {
        const animations = dots.map((dot, i) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(i * 160),
                    Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
                    Animated.delay((2 - i) * 160),
                ])
            )
        );
        animations.forEach(a => a.start());
        return () => animations.forEach(a => a.stop());
    }, []);

    return (
        <View style={styles.typingBubble}>
            <View style={styles.typingDotsRow}>
                {dots.map((dot, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.typingDot,
                            { opacity: dot, transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

/** Single outfit suggestion card rendered inside a chat bubble */
const OutfitCard: React.FC<{ outfit: SuggestedOutfit; index: number }> = ({ outfit, index }) => {
    const fadeAnim  = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim,  { toValue: 1, duration: 300, delay: index * 100, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 8, delay: index * 100, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.outfitCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Card header */}
            <View style={styles.outfitCardHeader}>
                <View style={styles.outfitCardMeta}>
                    <Text style={styles.outfitCardName}>{outfit.name}</Text>
                    <Text style={styles.outfitCardOccasion}>{outfit.occasion}</Text>
                </View>
                <View style={styles.outfitCardBadge}>
                    <Text style={styles.outfitCardBadgeText}>{outfit.items.length} pcs</Text>
                </View>
            </View>

            {/* Item images */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.outfitItemsRow}
            >
                {outfit.items.map(item => (
                    <View key={item.id} style={styles.outfitItemTile}>
                        {item.imageURL ? (
                            <Image
                                source={{ uri: item.imageURL }}
                                style={styles.outfitItemImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.outfitItemFallback}>
                                <Text style={styles.outfitItemFallbackText}>
                                    {item.title[0]?.toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <Text style={styles.outfitItemCategory} numberOfLines={1}>
                            {item.category}
                        </Text>
                        <Text style={styles.outfitItemTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                        {item.color ? (
                            <Text style={styles.outfitItemColor} numberOfLines={1}>
                                {item.color}
                            </Text>
                        ) : null}
                    </View>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

/** A single chat message bubble */
const MessageBubble: React.FC<{ message: Message; wardrobe: WardrobeItem[] }> = ({
    message,
    wardrobe,
}) => {
    const isUser = message.role === 'user';
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(isUser ? 16 : -16)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim,  { toValue: 1, duration: 250, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 10, useNativeDriver: true }),
        ]).start();
    }, []);

    if (message.isLoading) {
        return (
            <Animated.View style={[styles.messageRow, styles.messageRowAssistant, { opacity: fadeAnim }]}>
                <View style={styles.avatarDot}><Sparkles size={12} color="#F4C430" /></View>
                <TypingIndicator />
            </Animated.View>
        );
    }

    // Resolve outfit items from wardrobe
    const resolvedOutfits: SuggestedOutfit[] = (message.outfits ?? []).map(outfit => ({
        ...outfit,
        items: outfit.items.filter(Boolean),
    }));

    return (
        <Animated.View
            style={[
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowAssistant,
                { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
            ]}
        >
            {!isUser && (
                <View style={styles.avatarDot}>
                    <Sparkles size={12} color="#F4C430" />
                </View>
            )}

            <View style={styles.bubbleWrapper}>
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
                    <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>
                        {message.text}
                    </Text>
                </View>

                {/* Outfit suggestion cards */}
                {resolvedOutfits.length > 0 && (
                    <View style={styles.outfitsContainer}>
                        {resolvedOutfits.map((outfit, idx) => (
                            <OutfitCard key={idx} outfit={outfit} index={idx} />
                        ))}
                    </View>
                )}

                <Text style={[styles.timestamp, isUser && styles.timestampRight]}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </Animated.View>
    );
};

/** Quick prompt chip */
const PromptChip: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
    <TouchableOpacity style={styles.promptChip} onPress={onPress} activeOpacity={0.75}>
        <Text style={styles.promptChipText}>{label}</Text>
    </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const AIChatScreen: React.FC = () => {
    const db   = getFirestore(getApp());
    const user = getAuth().currentUser;

    const [wardrobe,        setWardrobe]        = useState<WardrobeItem[]>([]);
    const [wardrobeLoading, setWardrobeLoading] = useState(true);
    const [apiKey,          setApiKey]          = useState<string>('');
    const [keyError,        setKeyError]        = useState(false);
    const [messages,        setMessages]        = useState<Message[]>([]);
    const [inputText,       setInputText]       = useState('');
    const [isThinking,      setIsThinking]      = useState(false);

    const flatListRef = useRef<FlatList>(null);

    // ── Conversation history for multi-turn context ───────────────────────────
    const historyRef = useRef<{ role: ChatRole; content: string }[]>([]);

    // ── Fetch API key from Firestore ──────────────────────────────────────────
    // Firestore path:  config / keys  →  { anthropicKey: "sk-ant-..." }
    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const snap = await getDoc(doc(db, 'config', 'keys'));
                const key  = snap.data()?.anthropicKey as string | undefined;
                if (key && key.startsWith('sk-')) {
                    setApiKey(key);
                } else {
                    console.warn('[AIChatScreen] anthropicKey not found or invalid in config/keys');
                    setKeyError(true);
                }
            } catch (err) {
                console.error('[AIChatScreen] Failed to fetch API key:', err);
                setKeyError(true);
            }
        };
        fetchApiKey();
    }, []);

    // ── Fetch wardrobe from Firestore ─────────────────────────────────────────
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'outfits'), where('userId', '==', user.uid));
        getDocs(q)
            .then(snap => {
                const items = snap.docs.map(mapDocToItem);
                setWardrobe(items);

                // Welcome message with wardrobe summary
                const welcomeText = items.length === 0
                    ? "Hi! I'm your personal stylist ✨ Your wardrobe seems empty — add some items and I'll start suggesting outfits!"
                    : `Hey there! 👋 I've loaded your wardrobe — **${items.length} items** across ${new Set(items.map(i => i.category)).size} categories. Ask me anything about styling them!`;

                setMessages([{
                    id:        'welcome',
                    role:      'assistant',
                    text:      welcomeText,
                    timestamp: new Date(),
                }]);
            })
            .catch(() => {
                setMessages([{
                    id:        'welcome-error',
                    role:      'assistant',
                    text:      "Hi! Couldn't load your wardrobe right now. Try again in a moment.",
                    timestamp: new Date(),
                }]);
            })
            .finally(() => setWardrobeLoading(false));
    }, [user?.uid]);

    // ── Scroll to bottom on new messages ─────────────────────────────────────
    const scrollToBottom = useCallback(() => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages.length]);

    // ── System prompt (memoised) ──────────────────────────────────────────────
    const systemPrompt = useMemo(() => buildSystemPrompt(wardrobe), [wardrobe]);

    // ── Send message ──────────────────────────────────────────────────────────
    const sendMessage = useCallback(async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isThinking) return;

        if (!apiKey) {
            setMessages(prev => [...prev, {
                id:        `key-error-${Date.now()}`,
                role:      'assistant' as ChatRole,
                text:      "⚠️ AI key not configured. Add your Anthropic key to Firestore at config/keys → anthropicKey.",
                timestamp: new Date(),
            }]);
            return;
        }

        Keyboard.dismiss();
        setInputText('');

        // Add user message
        const userMsg: Message = {
            id:        `user-${Date.now()}`,
            role:      'user',
            text:      trimmed,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);

        // Add loading placeholder
        const loadingId = `loading-${Date.now()}`;
        setMessages(prev => [...prev, {
            id:        loadingId,
            role:      'assistant',
            text:      '',
            isLoading: true,
            timestamp: new Date(),
        }]);
        setIsThinking(true);

        try {
            const aiResponse = await callAI(apiKey, systemPrompt, historyRef.current, trimmed);

            // Build wardrobe lookup map
            const wardrobeMap = new Map(wardrobe.map(i => [i.id, i]));

            // Resolve outfit items
            const resolvedOutfits: SuggestedOutfit[] | undefined = aiResponse.outfits?.map(o => ({
                name:     o.name,
                occasion: o.occasion,
                items:    o.itemIds
                    .map(id => wardrobeMap.get(id))
                    .filter(Boolean) as WardrobeItem[],
            })).filter(o => o.items.length > 0);

            // Build assistant message
            const assistantMsg: Message = {
                id:        `assistant-${Date.now()}`,
                role:      'assistant',
                text:      aiResponse.text,
                outfits:   resolvedOutfits,
                timestamp: new Date(),
            };

historyRef.current = [
    ...historyRef.current,
    { role: 'user' as const,      content: trimmed },
    { role: 'assistant' as const, content: aiResponse.text },
].slice(-20);

            // Replace loading with real message
            setMessages(prev => prev.filter(m => m.id !== loadingId).concat(assistantMsg));
        } catch (err) {
            const errorMsg: Message = {
                id:        `error-${Date.now()}`,
                role:      'assistant',
                text:      "Sorry, something went wrong. Please check your connection and try again.",
                timestamp: new Date(),
            };
            setMessages(prev => prev.filter(m => m.id !== loadingId).concat(errorMsg));
        } finally {
            setIsThinking(false);
        }
    }, [isThinking, systemPrompt, wardrobe]);

    // ── Clear conversation ────────────────────────────────────────────────────
    const clearChat = useCallback(() => {
        historyRef.current = [];
        setMessages(prev => prev.slice(0, 1)); // Keep welcome message
    }, []);

    // ─── Render ───────────────────────────────────────────────────────────────

    const showQuickPrompts = messages.length <= 1;

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.headerAvatarWrap}>
                        <Sparkles size={16} color="#F4C430" />
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Style AI</Text>
                        <Text style={styles.headerSub}>
                            {wardrobeLoading
                                ? 'Loading wardrobe…'
                                : `${wardrobe.length} items ready`}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.clearBtn} onPress={clearChat}>
                    <RefreshCw size={16} color="#999" />
                </TouchableOpacity>
            </View>

            {/* Wardrobe loading bar */}
            {wardrobeLoading && (
                <View style={styles.wardrobeLoadingBar}>
                    <ActivityIndicator size="small" color="#C9960A" />
                    <Text style={styles.wardrobeLoadingText}>Syncing your wardrobe…</Text>
                </View>
            )}

            {/* API key error banner */}
            {keyError && (
                <View style={styles.keyErrorBar}>
                    <Text style={styles.keyErrorText}>
                        ⚠️  Add Anthropic key in Firestore: <Text style={styles.keyErrorPath}>config / keys → anthropicKey</Text>
                    </Text>
                </View>
            )}

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                {/* Messages list */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={m => m.id}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={scrollToBottom}
                    renderItem={({ item }) => (
                        <MessageBubble message={item} wardrobe={wardrobe} />
                    )}
                    ListFooterComponent={
                        showQuickPrompts && !wardrobeLoading ? (
                            <View style={styles.quickPromptsWrap}>
                                <Text style={styles.quickPromptsLabel}>Try asking…</Text>
                                <View style={styles.quickPromptsGrid}>
                                    {QUICK_PROMPTS.map(p => (
                                        <PromptChip
                                            key={p}
                                            label={p}
                                            onPress={() => sendMessage(p)}
                                        />
                                    ))}
                                </View>
                            </View>
                        ) : null
                    }
                />

                {/* Input bar */}
                <SafeAreaView edges={['bottom']} style={styles.inputSafeArea}>
                    <View style={styles.inputBar}>
                        <View style={styles.inputWrap}>
                            <TextInput
                                style={styles.input}
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="Ask your stylist…"
                                placeholderTextColor="#BBBBBB"
                                multiline
                                maxLength={500}
                                returnKeyType="send"
                                onSubmitEditing={() => sendMessage(inputText)}
                            />
                        </View>
                        <TouchableOpacity
                            style={[styles.sendBtn, (!inputText.trim() || isThinking) && styles.sendBtnDisabled]}
                            onPress={() => sendMessage(inputText)}
                            disabled={!inputText.trim() || isThinking}
                            activeOpacity={0.8}
                        >
                            {isThinking
                                ? <ActivityIndicator size="small" color="#0a0a0a" />
                                : <Send size={18} color="#0a0a0a" strokeWidth={2.5} />
                            }
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AIChatScreen;