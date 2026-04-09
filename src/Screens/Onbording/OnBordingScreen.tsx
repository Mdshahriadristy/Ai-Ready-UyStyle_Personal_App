import React, { useState } from 'react'
import {
    ImageBackground,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

const STEPS = [
    {
        title: 'Your Digital Closet',
        subtitle: 'Get quick outfit suggestions based on your day.',
        image: require('../../../assets/images/onboardin.png'),
    },
    {
        title: 'Plan Your Week',
        subtitle: 'Schedule outfits ahead so mornings are effortless.',
        image: require('../../../assets/images/onboardin.png'),
    },
    {
        title: 'Look Your Best',
        subtitle: 'Get personalized style tips just for you.',
        image: require('../../../assets/images/onboardin.png'),
    },
]

type RootStackParamList = {
    Onboarding: undefined
    Home: undefined
}

export default function OnBoardingScreen() {
    const [currentStep, setCurrentStep] = useState(0)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const isLastStep = currentStep === STEPS.length - 1
    const { title, subtitle, image } = STEPS[currentStep]

    const handleNext = () => {
        if (isLastStep) {
            navigation.replace('Home')
        } else {
            setCurrentStep(prev => prev + 1)
        }
    }

    return (
        <ImageBackground
            source={require('../../../assets/images/bg-onboarding.png')}
            style={styles.background}
            resizeMode="cover"
        >
            {/* Main content */}
            <View style={styles.container}>
                <Image source={image} />
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            {/* Bottom bar */}
            <View style={styles.bottomBar}>
                {/* Pagination dots */}
                <View style={styles.dotsContainer}>
                    {STEPS.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentStep
                                    ? styles.dotActive
                                    : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>

                {/* Next / Get Started button */}
                <TouchableOpacity
                    style={styles.nextButton}
                    activeOpacity={0.85}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>
                        {isLastStep ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>

                {/* Already have account */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.replace('Home')}
                >
                    <Text style={styles.loginText}>I Already Have An Account</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: { flex: 1 },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '800',
        marginTop: 16,
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 8,
    },
    bottomBar: {
        backgroundColor: '#1E293B',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 36,
        alignItems: 'center',
        gap: 16,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    dot: {
        height: 10,
        borderRadius: 5,
    },
    dotActive: {
        width: 28,
        backgroundColor: '#4a90e2',
    },
    dotInactive: {
        width: 10,
        backgroundColor: 'rgba(255,255,255,0.35)',
    },
    nextButton: {
        width: '100%',
        backgroundColor: '#4a90e2',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    loginText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: '500',
    },
})