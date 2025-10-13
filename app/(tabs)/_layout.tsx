import { Stack, Tabs } from 'expo-router';
import React from 'react';
//import { TextSizeProvider } from './context/TextSizeContext';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createContext, useState } from 'react';


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
            <Stack.Screen name="Home" />
            <Stack.Screen name="Explore" />
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
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: {color: string}) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }: {color:string}) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
