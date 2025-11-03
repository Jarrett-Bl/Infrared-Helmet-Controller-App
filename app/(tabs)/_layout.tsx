import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, Tabs } from 'expo-router';
import React, { createContext, useState } from 'react';


type TextSize = 'sm' | 'md' | 'lg';
type Ctx = { size: TextSize; setSize: (s: TextSize) => void };

const TextSizeContext = createContext<Ctx | undefined>(undefined);

export const TextSizeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [size, setSize] = useState<TextSize>('md');
  return (
    <TextSizeContext.Provider value={{ size, setSize }}>
      {children}
    </TextSizeContext.Provider>
  );
};


export function RootLayout() {
    return (
        <TextSizeProvider>
        <Stack screenOptions ={{ headerShown: false}}>
            <Stack.Screen name="Helmet Control" />
            <Stack.Screen name="Settings" />
            <Stack.Screen name= "Protocols" />
        </Stack>
        </TextSizeProvider>
        );
    }
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
        <Tabs.Screen
        name="homeScreen"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
        />

        <Tabs.Screen
        name="bluetoothPage1"
        options={{
          title: "Helmet Control",
          tabBarIcon: ({ color }) => (
            <Ionicons name="phone-portrait-outline" size={22} color={color} />
          ),
        }}
        />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="protocolPage"
        options={{
          title: "Protocols",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="index"   options={{ href: null }} /> 
    </Tabs>
  );
}
