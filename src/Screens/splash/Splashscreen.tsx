import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish?.();
        }, 2000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A73E8" />

            {/* Logo */}
            <Image source={require('../../../assets/images/logo.png')} style={styles.logo} />
            {/* Tagline */}
            <Text style={styles.tagline}>Your stylist in your pocket.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        zIndex: 999,
    },
    tagline: {
        fontSize: 18,
        color: '#000000',
        fontWeight: '500',
        textAlign: 'center',
        fontFamily: 'InterMedium',
        width: '100%'
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
});

export default SplashScreen;