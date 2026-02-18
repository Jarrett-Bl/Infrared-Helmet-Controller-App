import { POWER_DEFAULT, POWER_MAX, POWER_MIN, POWER_STEP, PowerSliderInput } from '@/components/FreqPageComponents';
import { AppColors } from '@/constants/theme';
import { router } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useProtocol } from '../../context/ProtcolStorageContext';

export default function PowerLevelPage() {
  const { setPowerForAllZones } = useProtocol();
  const [power, setPower] = useState(POWER_DEFAULT);

  const handleNext = () => {
    if (power < POWER_MIN || power > POWER_MAX) {
      console.warn("Enter a valid power level (25–100%)");
      return;
    }
    setPowerForAllZones(power);
    router.push("/frequencyPage");
  };

  return (
    <View style={[styles.screen, { backgroundColor: AppColors.background }]}>
      <StatusBar style="light" backgroundColor={AppColors.background} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={[styles.title, { color: AppColors.text, marginTop: 16 }]}>
          Power Level (%)
        </Text>

        

        <PowerSliderInput
          value={power}
          onChange={setPower}
          min={POWER_MIN}
          max={POWER_MAX}
          step={POWER_STEP}
        />

        <View style={styles.grid}>
          <View style={styles.col}>
            <Pressable
              onPress={() => setPower(25)}
              style={[styles.tile, power === 25 && styles.tileSelected]}
            >
              <Text style={styles.tileText}>25%</Text>
            </Pressable>
            <Pressable
              onPress={() => setPower(75)}
              style={[styles.tile, power === 75 && styles.tileSelected]}
            >
              <Text style={styles.tileText}>75%</Text>
            </Pressable>
          </View>
          <View style={styles.col}>
            <Pressable
              onPress={() => setPower(50)}
              style={[styles.tile, power === 50 && styles.tileSelected]}
            >
              <Text style={styles.tileText}>50%</Text>
            </Pressable>
            <Pressable
              onPress={() => setPower(100)}
              style={[styles.tile, power === 100 && styles.tileSelected]}
            >
              <Text style={styles.tileText}>100%</Text>
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
