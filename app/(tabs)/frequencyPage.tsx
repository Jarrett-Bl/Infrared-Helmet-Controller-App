import {
  FREQ_DEFAULT,
  FREQ_MAX,
  FREQ_MIN,
  FREQ_STEP,
  FrequencySliderInput,
  POWER_DEFAULT,
  POWER_MAX,
  POWER_MIN,
} from "@/components/FreqPageComponents";
import PowerLevelSection from "@/components/powerLevelComponent";
import { AppColors } from "@/constants/theme";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProtocol } from "../../context/ProtcolStorageContext";

export default function FrequencyPage() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { protocol, setFrequencyForAllZones, setPowerForAllZones } =
    useProtocol();
  const [frequency, setFrequency] = useState(FREQ_DEFAULT);
  const [power, setPower] = useState(POWER_DEFAULT);

  useFocusEffect(
    useCallback(() => {
      const isFresh = params.fresh === "1";
      if (isFresh) {
        setFrequency(FREQ_DEFAULT);
        setPower(POWER_DEFAULT);
        return;
      }

      if (!protocol || protocol.editorType !== "simple") return;

      const zoneIds = Object.keys(protocol.Zones || {}).map(Number);
      if (!zoneIds.length) {
        setFrequency(FREQ_DEFAULT);
        setPower(POWER_DEFAULT);
        return;
      }

      const firstZoneId = zoneIds[0];
      const existingFrequency = protocol.Zones[firstZoneId]?.frequencyHz;
      const existingPower = protocol.Zones[firstZoneId]?.powerLevel;

      if (typeof existingFrequency === "number") {
        setFrequency(existingFrequency);
      } else {
        setFrequency(FREQ_DEFAULT);
      }

      if (
        typeof existingPower === "number" &&
        existingPower >= POWER_MIN &&
        existingPower <= POWER_MAX
      ) {
        setPower(existingPower);
      } else {
        setPower(POWER_DEFAULT);
      }
    }, [params.fresh, protocol?.editorType]),
  );

  const handlePowerChange = useCallback((value: number) => {
    setPower(value);
  }, []);

  const handleNext = () => {
    if (frequency < FREQ_MIN || frequency > FREQ_MAX) {
      console.warn("Enter a valid frequency in Hz (0–140)");
      return;
    }
    if (power < POWER_MIN || power > POWER_MAX) {
      console.warn("Enter a valid power level (0–100%)");
      return;
    }
    setFrequencyForAllZones(frequency);
    setPowerForAllZones(power);
    const isFresh = params.fresh === "1";
    if (isFresh) {
      router.push({
        pathname: "/simpleTimePage",
        params: { fresh: "1" },
      });
    } else {
      router.push("/simpleTimePage");
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: AppColors.background }]}>
      <StatusBar style="light" backgroundColor={AppColors.background} />
      <Pressable
        onPress={() => router.push("/zoneSelection")}
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.split}>
          <View style={styles.topHalf}>
            <Text style={[styles.title, { color: AppColors.text, marginTop: 16 }]}>
              Frequency (Hz)
            </Text>

            <FrequencySliderInput
              value={frequency}
              onChange={setFrequency}
              min={FREQ_MIN}
              max={FREQ_MAX}
              step={FREQ_STEP}
            />

            <View style={styles.grid}>
              <View style={styles.col}>
                <Pressable
                  onPress={() => setFrequency(20)}
                  style={[styles.tile, frequency === 20 && styles.tileSelected]}
                >
                  <Text style={styles.tileText}>20 Hz</Text>
                </Pressable>
                <Pressable
                  onPress={() => setFrequency(80)}
                  style={[styles.tile, frequency === 80 && styles.tileSelected]}
                >
                  <Text style={styles.tileText}>80 Hz</Text>
                </Pressable>
              </View>
              <View style={styles.col}>
                <Pressable
                  onPress={() => setFrequency(50)}
                  style={[styles.tile, frequency === 50 && styles.tileSelected]}
                >
                  <Text style={styles.tileText}>50 Hz</Text>
                </Pressable>
                <Pressable
                  onPress={() => setFrequency(140)}
                  style={[styles.tile, frequency === 140 && styles.tileSelected]}
                >
                  <Text style={styles.tileText}>140 Hz</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.bottomHalf}>
            <PowerLevelSection power={power} onPowerChange={handlePowerChange} />
          </View>

          <View style={styles.nextButtonWrap}>
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [
                styles.nextButton,
                { opacity: pressed ? 0.85 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Next"
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  split: { flex: 1, flexDirection: "column" },
  topHalf: { flex: 1, minHeight: 0 },
  bottomHalf: { flex: 1, minHeight: 0 },
  title: { fontSize: 24, fontWeight: "600", textAlign: "center", padding: 10 },
  grid: {
    flexDirection: "row",
    flex: 1,
    marginTop: 8,
    marginBottom: 12,
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
  nextButtonWrap: { paddingHorizontal: 16, marginTop: 20, marginBottom: 8 },
  nextButton: {
    width: "100%",
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: AppColors.text,
    fontSize: 22,
    fontWeight: "800",
  },
});
