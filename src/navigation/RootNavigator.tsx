import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnBoardingScreen from '../Screens/Onbording/OnBordingScreen'
import SignupScreen from '../Screens/signup/SignupScreen'
import SignInScreen from '../Screens/signin/SignInScreen'
import HomeScreen from '../Screens/Home/HomeScreen'


const Stack = createNativeStackNavigator()

export default function App() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" component={OnBoardingScreen} />
            <Stack.Screen name="signup" component={SignupScreen} />
            <Stack.Screen name="signin" component={SignInScreen} />
            <Stack.Screen name="home" component={HomeScreen} />
        </Stack.Navigator>
    )
}