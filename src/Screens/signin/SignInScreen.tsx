import { ChevronLeft, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StatusBar,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../signup/style';

const EyeIcon = ({ visible }: { visible: boolean }) => (
    <View>{visible ? <Eye color={'#717C82'} size={22} /> : <EyeOff color={'#717C82'} size={22} />}</View>
);

const SignInScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleBack = () => {
        navigation?.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <KeyboardAvoidingView
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleBack}
                        activeOpacity={0.7}
                    >
                        <ChevronLeft color={'#000'} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome back</Text>
                        <Text style={styles.subtitle}>
                            Sign in to access your closet and saved outfits.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>

                        {/* Email */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="you@example.com"
                                    placeholderTextColor="#b0b8c8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={[styles.input, styles.inputWithIcon]}
                                    placeholder="••••••••"
                                    placeholderTextColor="#b0b8c8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                    activeOpacity={0.7}
                                >
                                    <EyeIcon visible={showPassword} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Spacer */}
                    <View style={styles.spacer} />

                    {/* Footer */}
                    <View style={[styles.footer, styles.signinfooter]}>
                        <TouchableOpacity
                            style={styles.nextButton}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('home')}
                        >
                            <Text style={styles.nextButtonText}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.termsText}>
                            Don't have an account? <Text style={styles.termsLink} onPress={() => navigation.navigate('signup')}>Sign Up</Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};



export default SignInScreen;

