import HomeButton from '@/components/ui/HomeButton';
import { AppColors } from '@/constants/theme';
import { Link } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { useState } from 'react';
import { ActivityIndicator, Button, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BlueToothConnectionPage1() {
  const [isLoading, setIsLoading] = useState(false);
  const [text, onChangeText] = useState('Helmet Paired: Not connected');

  const handlePress = async () => {
    onChangeText('Helmet Paired: Searching');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsLoading(false);
    onChangeText('Helmet Paired: Connected');
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: AppColors.background }]}>
      <StatusBar style={"light"} backgroundColor={AppColors.background} />
      <Text style={[styles.title, { color: AppColors.text, marginTop: 16 }]}>
        Pair your device
      </Text>
      <HomeButton />
      <Text style={[styles.header, { color: AppColors.text, marginTop: 30 }]}>
        To begin, ensure your device is turned on and within range.
      </Text>
      <View style={styles.center}>
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: AppColors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={AppColors.text} />
          ) : (
            <Text style={[styles.buttonLabel, { color: AppColors.text }]}>
              Pair Helmet
            </Text>
          )}
        </Pressable>
      </View>
      <Text style={[styles.header, { color: AppColors.text }]}>
        {text}
      </Text>
      <Link href="../bluetoothDevicePairing" asChild>
        <Button title="Next" />
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "600", textAlign: "center" },
  header: { fontSize: 17, fontWeight: "200", textAlign: "center", marginBottom: 220 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  button: {
    minWidth: 240,
    minHeight: 100,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"

  },
  buttonLabel: { fontSize: 24, fontWeight: "bold" },
});