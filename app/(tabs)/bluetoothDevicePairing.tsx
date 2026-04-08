import { AppColors } from "@/constants/theme";
import { useProtocol } from "@/context/ProtcolStorageContext";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles as sharedStyles } from "@/styles/sharedStyles";

export default function BlueToothConnectionPage2() {
  const { clearProtocol } = useProtocol();

  return (
    <SafeAreaView style={sharedStyles.screen} edges={["top", "left", "right"]}>
      <StatusBar style="light" backgroundColor={AppColors.background} />

      <Text style={[sharedStyles.title, { marginTop: 8, fontSize: 28 }]}>
        Begin designing a simple or complex protocol
      </Text>

      <Text
        style={[
          sharedStyles.cardSub,
          {
            textAlign: "center",
            marginBottom: 8,
            alignSelf: "center",
            fontSize: 18,
          },
        ]}
      >
        Choose an editor type to continue
      </Text>

      <View style={localStyles.centerBlock}>
        <View style={localStyles.row}>
          <Pressable
            onPress={() => {
              clearProtocol();
              router.push({
                pathname: "/zoneSelection",
                params: { fresh: "1" },
              });
            }}
            style={({ pressed }) => [
              localStyles.box,
              pressed && { opacity: 0.88 },
            ]}
          >
            <Text style={localStyles.boxTitle}>Simple</Text>
            <Text style={localStyles.boxSub}>One setting per step</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              clearProtocol();
              router.push({
                pathname: "/complexZoneSelection",
                params: { fresh: "1" },
              });
            }}
            style={({ pressed }) => [
              localStyles.box,
              pressed && { opacity: 0.88 },
            ]}
          >
            <Text style={localStyles.boxTitle}>Complex</Text>
            <Text style={localStyles.boxSub}>Per-zone control</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  centerBlock: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  row: {
    flexDirection: "row",
    gap: 18,
    width: "100%",
    maxWidth: 760,
    paddingHorizontal: 8,
  },
  box: {
    flex: 1,
    minWidth: 0,
    minHeight: 152,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.14,
        shadowRadius: 6,
      },
      default: {},
    }),
  },
  boxTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: AppColors.text,
    textAlign: "center",
  },
  boxSub: {
    marginTop: 10,
    fontSize: 16,
    color: AppColors.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
});
