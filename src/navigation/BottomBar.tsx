import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CirclePlus, Grid3x3, House, Layers, User } from 'lucide-react-native';
import HomeScreen from '../Screens/Home/HomeScreen';

export type BottomTabParamList = {
    Home: undefined;
    Closet: undefined;
    Add: undefined;
    Outfits: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.50)',
                tabBarStyle: {
                    backgroundColor: '#0F1729',
                    borderTopWidth: 0,
                    borderRadius: 16,
                    marginHorizontal: 16,
                    marginBottom: 35,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                    position: 'absolute',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'InterMedium',
                    fontWeight: '500',
                    marginTop: 2,
                },
                tabBarIcon: ({ color }) => {
                    const icons: Record<string, React.ReactNode> = {
                        Home: <House color={color} size={22} />,
                        Closet: <Grid3x3 color={color} size={22} />,
                        Add: <CirclePlus color={color} size={22} />,
                        Outfits: <Layers color={color} size={22} />,
                        Profile: <User color={color} size={22} />,
                    };
                    return icons[route.name];
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Closet" component={HomeScreen} />
            <Tab.Screen name="Add" component={HomeScreen} />
            <Tab.Screen name="Outfits" component={HomeScreen} />
            <Tab.Screen name="Profile" component={HomeScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabs;