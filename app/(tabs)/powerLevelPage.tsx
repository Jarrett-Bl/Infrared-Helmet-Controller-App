import HomeButton from '@/components/ui/HomeButton';
import { AppColors } from '@/constants/theme';
import { router } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProtocol } from '../../context/ProtcolStorageContext';

export default function PowerLevelPage() {
  const { setPowerForAllZones } = useProtocol();
  const [selectedPower, setSelectedPower] = useState<number | null>(null);

  const handlePress = (value: number) => {
    setSelectedPower(value);
  };

  const handleNext = () => {
    if (selectedPower === null) {
      console.warn("Choose a power level first");
      return;
    }

    setPowerForAllZones(selectedPower);
    router.push("/frequencyPage");
  };

  return (
    <View style={[styles.screen, { backgroundColor: AppColors.background }]}>
      <StatusBar style={"light"} backgroundColor={AppColors.background} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={[styles.title, { color: AppColors.text, marginTop: 16 }]}>
          Power Level
        </Text>

        <HomeButton />

        <SafeAreaView style={[styles.container, { backgroundColor: AppColors.background }]}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedPower === 25 && styles.selectedButton,
            ]}
            onPress={() => handlePress(25)}
          >
            <Text style={styles.buttonLabel}>25%</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              selectedPower === 50 && styles.selectedButton,
            ]}
            onPress={() => handlePress(50)}
          >
            <Text style={styles.buttonLabel}>50%</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              selectedPower === 75 && styles.selectedButton,
            ]}
            onPress={() => handlePress(75)}
          >
            <Text style={styles.buttonLabel}>75%</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              selectedPower === 100 && styles.selectedButton,
            ]}
            onPress={() => handlePress(100)}
          >
            <Text style={styles.buttonLabel}>100%</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Next button */}
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
  header: { fontSize: 17, fontWeight: "200", textAlign: "center", marginBottom: 220 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 24,
  },
  nextButtonWrap: { paddingHorizontal: 16, marginBottom: 24 },
  button: {
    aspectRatio: 2,
    height: 150,
    backgroundColor: AppColors.button,
    borderColor: AppColors.text,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    borderRadius: 24,
  },
  selectedButton: {
    backgroundColor: AppColors.success,
  },
  buttonLabel: {
    fontSize: 25,
    fontWeight: "700",
    color: AppColors.text,
  },
});
