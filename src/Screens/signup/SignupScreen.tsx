



import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';
import { getApp } from '@react-native-firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@react-native-firebase/auth';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <View>
    {visible
      ? <Eye color={'#717C82'} size={22} />
      : <EyeOff color={'#717C82'} size={22} />}
  </View>
);

const SignupScreen = ({ navigation }: any) => {
  const { hasAccount } = useAuth(); // ← age account check korbe

  const [fullName,         setFullName]         = useState('');
  const [email,            setEmail]            = useState('');
  const [password,         setPassword]         = useState('');
  const [confirmPassword,  setConfirmPassword]  = useState('');
  const [showPassword,     setShowPassword]     = useState(false);
  const [showConfirm,      setShowConfirm]      = useState(false);
  const [loading,          setLoading]          = useState(false);

  const validate = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const app          = getApp();
      const authInstance = getAuth(app);
      const db           = getFirestore(app);

      const userCredential = await createUserWithEmailAndPassword(
        authInstance,
        email.trim(),
        password
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(collection(db, 'users'), uid), {
        fullName:  fullName.trim(),
        email:     email.trim().toLowerCase(),
        createdAt: serverTimestamp(),
      });

      await updateProfile(userCredential.user, {
        displayName: fullName.trim(),
      });

      //  navigate() nai — onAuthStateChanged → AppStack → Home

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Already have an account? Sign in');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Please enter a valid email address');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Error', 'Please choose a strong password');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Start building your digital wardrobe today.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Sarah Johnson"
                  placeholderTextColor="#b0b8c8"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

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

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="••••••••"
                  placeholderTextColor="#b0b8c8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirm(!showConfirm)}
                  activeOpacity={0.7}
                >
                  <EyeIcon visible={showConfirm} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.spacer} />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.nextButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.85}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.nextButtonText}>Create Account</Text>
              }
            </TouchableOpacity>

                       <Text style={styles.termsText2}>
               By creating an account, you agree to our{' '}          
                 <Text style={styles.termsLink}>Terms of Service</Text> and Privacy
              Policy.
           </Text>

                       {/* Sign in */}
            <Text style={styles.termsText}>
              Already have an account?{' '}
              <Text
                style={styles.termsLink}
                onPress={() => navigation.navigate('signin')}
              >
                Sign In
              </Text>
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;