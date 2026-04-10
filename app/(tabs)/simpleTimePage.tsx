import BackButton from "@/components/BackButton";
import { AppColors } from "@/constants/theme";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProtocol } from "../../context/ProtcolStorageContext";
import { styles } from "../../styles/sharedStyles";
export default function SimpleTimePage() {
  const [minutes, setMinutes] = useState(15);
  const { protocol, initProtocol, setTime } = useProtocol();

  useEffect(() => {
    if (!protocol || protocol.editorType !== "simple") return;

    if (typeof protocol.timeMin === "number") {
      setMinutes(protocol.timeMin);
    }
  }, [protocol]);

  const handleNext = () => {
    if (!protocol) {
      initProtocol("simple");
    }

    setTime(minutes, 0);
    router.push({
      pathname: "/runPage",
      params: { flow: "simple" },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" backgroundColor={AppColors.background} />
      <BackButton />
      <Text style={styles.title}>Select Your Session Time</Text>

      <Pressable
        onPress={() => router.push("/frequencyPage")}
        style={{
          position: "absolute",
          left: 20,
          top: 35,
          width: 48,
          height: 48,
          justifyContent: "center",
          alignItems: "flex-start",
          zIndex: 2,
        }}
        hitSlop={10}
      >
        <Text
          style={{
            color: AppColors.text,
            fontSize: 28,
            fontWeight: "800",
          }}
        >
          {"<"}
        </Text>
      </Pressable>

      <View style={lStyles.body}>
        <View style={[styles.card, lStyles.cardGrow]}>
          <View style={lStyles.rangeRow}>
            <Text style={styles.cardSub}>1 – 30</Text>
            <Text style={lStyles.valueText}>{minutes} min</Text>
          </View>

          <Slider
            style={lStyles.slider}
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={minutes}
            onValueChange={(v) => setMinutes(Math.round(v))}
            minimumTrackTintColor={AppColors.textMuted}
            maximumTrackTintColor={AppColors.border}
            thumbTintColor={AppColors.text}
          />

          <View style={lStyles.grid}>
            <View style={lStyles.col}>
              <Pressable
                onPress={() => setMinutes(5)}
                style={[lStyles.tile, minutes === 5 && lStyles.tileSelected]}
              >
                <Text style={lStyles.tileText}>5 minutes</Text>
              </Pressable>

              <Pressable
                onPress={() => setMinutes(15)}
                style={[lStyles.tile, minutes === 15 && lStyles.tileSelected]}
              >
                <Text style={lStyles.tileText}>15 minutes</Text>
              </Pressable>
            </View>

            <View style={lStyles.col}>
              <Pressable
                onPress={() => setMinutes(10)}
                style={[lStyles.tile, minutes === 10 && lStyles.tileSelected]}
              >
                <Text style={lStyles.tileText}>10 minutes</Text>
              </Pressable>

              <Pressable
                onPress={() => setMinutes(30)}
                style={[lStyles.tile, minutes === 30 && lStyles.tileSelected]}
              >
                <Text style={lStyles.tileText}>30 minutes</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={lStyles.footer}>
          <Pressable
            style={[styles.loadBtn, styles.loadBtnFull]}
            onPress={handleNext}
          >
            <Text style={styles.loadBtnText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export const options = {
  title: "Time Selection Basic User",
  headerStyle: { backgroundColor: AppColors.background },
  headerTintColor: AppColors.text,
  contentStyle: { backgroundColor: AppColors.background },
};

const lStyles = StyleSheet.create({
  body: { flex: 1, justifyContent: "space-between" },
  cardGrow: { flex: 1 },
  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  valueText: { color: AppColors.text, fontSize: 18, fontWeight: "700" },
  slider: {
    height: 40,
    transform: [{ scaleY: 1.2 }],
    marginTop: 6,
    marginBottom: 12,
  },
  grid: {
    flex: 1,
    flexDirection: "row",
    marginTop: 8,
  },
  col: {
    flex: 1,
    minHeight: 0,
  },
  tile: {
    flex: 1,
    backgroundColor: AppColors.card,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: AppColors.border,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  tileSelected: {
    borderColor: AppColors.selected,
  },
  tileText: {
    color: AppColors.text,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  footer: { marginTop: 16, marginBottom: 24 },
});
