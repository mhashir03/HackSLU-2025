import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Platform, Dimensions } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SpeechScreen from '../screens/SpeechScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack navigators for screens that need headers
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
};

const SpeechStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="SpeechMain" 
        component={SpeechScreen} 
        options={{ 
          title: 'Voice Assistant',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="SettingsMain" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

export default function AppNavigator() {
  const { theme } = useTheme();
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Speech') {
            iconName = 'mic';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Feather name={iconName} size={isMobile ? 28 : 24} color={color} />;
        },
        tabBarActiveTintColor: theme.accentColor,
        tabBarInactiveTintColor: theme.secondaryTextColor,
        tabBarStyle: {
          height: isMobile ? 90 : 70,
          paddingBottom: isMobile ? 15 : 10,
          paddingTop: isMobile ? 10 : 5,
          backgroundColor: theme.backgroundColor,
          borderTopWidth: 1,
          borderTopColor: theme.borderColor,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowColor: '#000',
          shadowOffset: { height: -2, width: 0 },
        },
        tabBarLabelStyle: {
          fontSize: isMobile ? 14 : 12,
          fontWeight: '500',
          marginTop: isMobile ? 2 : 0,
          paddingBottom: isMobile ? 5 : 3,
        },
        tabBarIconStyle: {
          marginTop: isMobile ? 5 : 3,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Speech" component={SpeechStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}