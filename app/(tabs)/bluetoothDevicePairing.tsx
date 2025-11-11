import HomeButton from '@/components/ui/HomeButton';
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/sharedStyles";

export default function BlueToothConnectionPage2() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" backgroundColor="#0E1418" />

      <Text style={[styles.title, { marginTop: 8 }]}>
        Press Start to begin designing a protocol
      </Text>
      <HomeButton/>

      <View style={styles.center}>
        <Pressable
          onPress={() => router.push("/zoneSelection")}
          style={({ pressed }) => [
            lStyles.startBtn,
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={lStyles.startLabel}>Start</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const lStyles = StyleSheet.create({
  startBtn: {
    minWidth: 260,
    minHeight: 100,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",   
    borderWidth: 1,
    borderColor: "#22303A",       
    ...Platform.select({
      android: { elevation: 2 },
      ios: { shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
    }),
  },
  startLabel: {
    color: "white",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
