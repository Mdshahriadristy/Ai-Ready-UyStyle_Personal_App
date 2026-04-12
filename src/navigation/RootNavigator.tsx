import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnBoardingScreen from '../Screens/Onbording/OnBordingScreen'
import SignupScreen from '../Screens/signup/SignupScreen'
import SignInScreen from '../Screens/signin/SignInScreen'
import BottomBar from './BottomBar'
import ProfileEditScreen from '../Screens/profile/Profileeditscreen'
import StylePreferenceScreen from '../Screens/profile/StylePreferenceScreen'
import CombineScreen from '../Screens/combin/Combinescreen'
import SaveSuccessScreen from '../Screens/combin/SaveSuccessScreen'
import PreviewScreen from '../Screens/combin/PreviewScreen'
import NotificationScreen from '../settings/NotificationScreen'
import AccountSettingsScreen from '../settings/AccountSettingsScreen'
import PrivacyPolicyScreen from '../settings/PrivacyPolicyScreen'
import HelpScreen from '../settings/HelpScreen'



const Stack = createNativeStackNavigator()


export default function App() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" component={OnBoardingScreen} />
            <Stack.Screen name="signup" component={SignupScreen} />
            <Stack.Screen name="signin" component={SignInScreen} />
            <Stack.Screen name="profileedit" component={ProfileEditScreen} />
            <Stack.Screen name="notification" component={NotificationScreen} />
            <Stack.Screen name="accountsettings" component={AccountSettingsScreen} />
            <Stack.Screen name="privacypolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="help" component={HelpScreen} />
            <Stack.Screen name="preference" component={StylePreferenceScreen} />
            <Stack.Screen name="combine" component={CombineScreen} />
            <Stack.Screen name="preview" component={PreviewScreen} />
            <Stack.Screen name="saveSuccess" component={SaveSuccessScreen} />
            <Stack.Screen name="bottombar" component={BottomBar} />
        </Stack.Navigator>
    )
}