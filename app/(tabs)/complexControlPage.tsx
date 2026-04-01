import {
  FREQ_MAX,
  FREQ_MIN,
  FREQ_STEP,
  FrequencySliderInput,
  POWER_MAX, POWER_MIN, POWER_STEP, PowerSliderInput
} from "@/components/FreqPageComponents";
import { AppColors } from "@/constants/theme";
import { Link, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProtocol } from "../../context/ProtcolStorageContext";

export default function ComplexControlPage() {
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams();
  const { setZoneConfigForZones } = useProtocol();

  // existing param you were using for UI color
  const zoneGroupColor =
    typeof params.zoneGroup === "string" ? params.zoneGroup : undefined;

  // NEW: zones this control page should apply to (passed from ComplexZoneSelectionPage)
  const zoneIds = useMemo(() => {
    const raw = params.zoneIds;
    if (typeof raw !== "string") return [];
    return raw
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
  }, [params.zoneIds]);

  // keep your UI the same, just make these numbers so we can store cleanly
  const [selectedItemPower, setSelectedItemPower] = useState<number | null>(
    null,
  );
  const [text, onChangeText] = useState("");
  const [selectedItemFreq, setSelectedItemFreq] = useState<number | null>(null);

  const handlePressPower = (val: number) => {
    setSelectedItemPower(val);
    console.log(params);
  };

  const handlePressFreq = (val: number) => {
    setSelectedItemFreq(val);
  };

  // NEW: write the chosen power/freq into context for the selected zones
  const applyToGroup = useCallback(() => {
    if (zoneIds.length === 0) {
      console.warn(
        "ComplexControlPage: no zoneIds were passed in params.zoneIds",
      );
      router.push("/complexZoneSelection");
      return;
    }

    const powerLevel = selectedItemPower ?? 0;

    const fromText = text.trim() ? Number(text) : NaN;
    const frequencyHz =
    selectedItemFreq ?? (Number.isFinite(fromText) ? fromText : 0);

    setZoneConfigForZones(zoneIds, { powerLevel, frequencyHz });

    // go back to zone selection after applying
    router.push("/complexZoneSelection");
  }, [
    zoneIds,
    selectedItemPower,
    selectedItemFreq,
    text,
    setZoneConfigForZones,
  ]);
  

  return (
    <View style={[styles.screen, { backgroundColor: AppColors.background }]}>
      <StatusBar style="light" backgroundColor={AppColors.background} />
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
            <Text style={[styles.title, { color: zoneGroupColor ? zoneGroupColor : AppColors.text, marginTop: 16 }]}>
              Frequency (Hz)
            </Text>    
            <FrequencySliderInput
              value={selectedItemFreq ?? 0}
              onChange={handlePressFreq}
              min={FREQ_MIN}
              max={FREQ_MAX}
              step={FREQ_STEP}
            />    
            <View style={styles.grid}>
              <View style={styles.col}>
                <Pressable
                  onPress={() => handlePressFreq(20)}
                  style={[styles.tile, selectedItemFreq === 20 && styles.tileSelected]}
                >
                  <Text style={styles.tileText}>20 Hz</Text>
                </Pressable>
                <Pressable
                  onPress={() => handlePressFreq(80)}
                  style={[styles.tile, selectedItemFreq === 80 && styles.tileSelected]}
                >
                  <Text style={styles.tileText}>80 Hz</Text>
                </Pressable>
              </View>
              <View style={styles.col}>
                <Pressable
                  onPress={() => handlePressFreq(50)}
                  style={[styles.tile, selectedItemFreq === 50 && styles.tileSelected]}
                >
                  <Text style={styles.tileText}>50 Hz</Text>
                </Pressable>
                <Pressable
                  onPress={() => handlePressFreq(140)}
                  style={[styles.tile, selectedItemFreq === 140 && styles.tileSelected]}
                >
                  <Text style={styles.tileText}>140 Hz</Text>
                </Pressable>
              </View>
            </View>
          </View>    
          <View style={styles.bottomHalf}>
            <View style={styles.section}>
              <Text style={[styles.title, { color: zoneGroupColor ? zoneGroupColor : AppColors.text }]}>
                Power Level (%)
              </Text>
        
              <PowerSliderInput
                value={selectedItemPower ?? 0}
                onChange={handlePressPower}
                min={POWER_MIN}
                max={POWER_MAX}
                step={POWER_STEP}
              />
            
                <View style={styles.grid}>
                  <View style={styles.col}>
                    <Pressable
                      onPress={() => handlePressPower(25)}
                      style={[styles.tile, selectedItemPower === 25 && styles.tileSelected]}
                    >
                      <Text style={styles.tileText}>25%</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handlePressPower(75)}
                      style={[styles.tile, selectedItemPower === 75 && styles.tileSelected]}
                    >
                      <Text style={styles.tileText}>75%</Text>
                    </Pressable>
                  </View>
                  <View style={styles.col}>
                    <Pressable
                      onPress={() => handlePressPower(50)}
                      style={[styles.tile, selectedItemPower === 50 && styles.tileSelected]}
                    >
                      <Text style={styles.tileText}>50%</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handlePressPower(100)}
                      style={[styles.tile, selectedItemPower === 100 && styles.tileSelected]}
                    >
                      <Text style={styles.tileText}>100%</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
          </View>    
        
        {/* NEW: Apply button */}
        <View style={{ marginTop: 8 }}>
          <Button title="Apply to Group" onPress={applyToGroup} />
        </View>
              
        {/* Keep your Back button */}
        <Link href="/complexZoneSelection" asChild>
          <Button title="Back" />
        </Link>
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
  section: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
});
