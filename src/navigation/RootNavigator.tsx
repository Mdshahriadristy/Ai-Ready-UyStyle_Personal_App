import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnBoardingScreen from '../Screens/Onbording/OnBordingScreen'
import HomeScreen from '../Screens/Home/HomeScreen'


const Stack = createNativeStackNavigator()

export default function App() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={OnBoardingScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    )
}