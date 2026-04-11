import React, { useState } from 'react'
import {
    ImageBackground,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { styles } from './style'

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
        title: 'Build outfits fast',
        subtitle: 'Mix and match your pieces for daily wear or special events.',
        image: require('../../../assets/images/onboarding3.png'),
    },
]

type RootStackParamList = {
    onboarding: undefined
    signup: undefined
    Home: undefined
}

export default function OnBoardingScreen() {
    const [currentStep, setCurrentStep] = useState(0)
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const isLastStep = currentStep === STEPS.length - 1
    const { title, subtitle, image } = STEPS[currentStep]

    const handleNext = () => {
        if (isLastStep) {
            navigation.replace('signup')
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
                    onPress={() => navigation.replace('signup')}
                >
                    <Text style={styles.loginText}>I Already Have An Account</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}
