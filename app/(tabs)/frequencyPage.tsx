import { FREQ_DEFAULT, FREQ_MAX, FREQ_MIN, FREQ_STEP, FrequencySliderInput } from '@/components/FreqPageComponents';
import HomeButton from '@/components/ui/HomeButton';
import { router } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useProtocol } from '../../context/ProtcolStorageContext';

const dark = {
  bg: "#0E1418",
  text: "#E6EDF3",
};


export default function FrequencyPage() {
  const colors = dark;
  const { setFrequencyForAllZones } = useProtocol();
  const [frequency, setFrequency] = useState(FREQ_DEFAULT);

  const handleNext = () => {
    if (frequency < FREQ_MIN || frequency > FREQ_MAX) {
      console.warn("Enter a valid frequency in Hz (0–140)");
      return;
    }
    setFrequencyForAllZones(frequency);
    router.push("/simpleTimePage");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <StatusBar style={"light"} backgroundColor="#000000" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>
          Frequency (Hz)
        </Text>

        <HomeButton />

        <FrequencySliderInput
          value={frequency}
          onChange={setFrequency}
          min={FREQ_MIN}
          max={FREQ_MAX}
          step={FREQ_STEP}
        />

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
  nextButtonWrap: { paddingHorizontal: 16, marginBottom: 24 },
});
