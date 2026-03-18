import { AppColors } from "@/constants/theme";
import { useProtocol } from "@/context/ProtcolStorageContext";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/sharedStyles";

export default function BlueToothConnectionPage2() {
  const { clearProtocol } = useProtocol();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" backgroundColor={AppColors.background} />

      <Text style={[styles.title, { marginTop: 8 }]}>
        Begin designing a simple or complex protocol
      </Text>

      <View style={styles.center}>
        <Pressable
          onPress={() => {
            clearProtocol();
            router.push("/zoneSelection");
          }}
          style={({ pressed }) => [
            lStyles.startBtn,
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={lStyles.startLabel}>Simple</Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <Pressable
          onPress={() => router.push("/complexZoneSelection")}
          style={({ pressed }) => [
            lStyles.startBtn,
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={lStyles.startLabel}>Complex</Text>
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
    backgroundColor: AppColors.primary,
    borderWidth: 1,
    borderColor: AppColors.border,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
  startLabel: {
    color: AppColors.text,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
