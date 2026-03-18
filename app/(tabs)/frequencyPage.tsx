import {
  FREQ_DEFAULT,
  FREQ_MAX,
  FREQ_MIN,
  FREQ_STEP,
  FrequencySliderInput,
} from "@/components/FreqPageComponents";
import PowerLevelSection from "@/components/powerLevelComponent";
import { AppColors } from "@/constants/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useProtocol } from "../../context/ProtcolStorageContext";

export default function FrequencyPage() {
  const { protocol, setFrequencyForAllZones } = useProtocol();
  const [frequency, setFrequency] = useState(FREQ_DEFAULT);
  const didInitFromProtocol = useRef(false);

  useEffect(() => {
    if (didInitFromProtocol.current) return;
    if (!protocol || protocol.editorType !== "simple") return;

    const zoneIds = Object.keys(protocol.Zones || {}).map(Number);
    if (!zoneIds.length) {
      didInitFromProtocol.current = true;
      return;
    }

    const firstZoneId = zoneIds[0];
    const existingFrequency = protocol.Zones[firstZoneId]?.frequencyHz;

    if (typeof existingFrequency === "number") {
      setFrequency(existingFrequency);
    }

    didInitFromProtocol.current = true;
  }, [protocol]);

  const handleNext = () => {
    if (frequency < FREQ_MIN || frequency > FREQ_MAX) {
      console.warn("Enter a valid frequency in Hz (0–140)");
      return;
    }
    setFrequencyForAllZones(frequency);
    router.push("/simpleTimePage");
  };

  return (
    <View style={[styles.screen, { backgroundColor: AppColors.background }]}>
      <StatusBar style="light" backgroundColor={AppColors.background} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <PowerLevelSection />

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

        <View style={styles.nextButtonWrap}>
          <Button title="Next" onPress={handleNext} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: "600", textAlign: "center", padding: 10 },
  grid: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 16,
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
  nextButtonWrap: { paddingHorizontal: 16, marginBottom: 24 },
});
