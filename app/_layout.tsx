import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ProtocolProvider } from '../context/ProtcolStorageContext';
import { initDb } from '../databaseLib/DB';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  //const colorScheme = useColorScheme();
    const colorScheme = 'dark';


    useEffect(() => {
    (async () => {
      try {
        await initDb();
        //await seedProtocols();
        console.log('SQLite database initialized');
      } catch (error) {
        console.error('DB initialization failed:', error);
      }
    })();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ProtocolProvider> 
      <Stack initialRouteName="newStart" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="newStart" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      </ProtocolProvider>
    </ThemeProvider>
  );
}
