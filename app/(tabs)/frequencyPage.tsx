import HomeButton from '@/components/ui/HomeButton';
import { router } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProtocol } from '../ProtcolStorageContext';

const dark = {
  bg: "#0E1418",
  button:'#2B3640',
  text: "#E6EDF3",
  primary: "#2196F3",
  buttonText: "#E5E7EB",
  pressed: "#21262D",
};

export default function FrequencyPage() {
  const colors = dark;
  const { setFrequencyForAllZones } = useProtocol();

  const [text, setText] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handlePreset = (value: string) => {
    setSelectedItem(value);
    setText(value); // keep text input in sync with button
  };

  const handleNext = () => {
    const freq = Number(text);
    if (!Number.isFinite(freq) || freq < 0) {
      console.warn("Enter a valid frequency in Hz");
      return;
    }

    setFrequencyForAllZones(freq);
    router.push("/simpleTimePage");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>
        Frequency (Hz)
      </Text>

      <HomeButton />
      <StatusBar style={"light"} backgroundColor="#000000" />

      <TextInput
        multiline={false}
        style={styles.input}
        placeholder="0 - 20,000"
        placeholderTextColor="gray"
        onChangeText={setText}
        value={text}
        keyboardType="numeric"
      />

      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <TouchableOpacity
          style={[styles.button, selectedItem === '5' && styles.selectedButton]}
          onPress={() => handlePreset('5')}
        >
          <Text style={styles.buttonLabel}>5 Hz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, selectedItem === '10' && styles.selectedButton]}
          onPress={() => handlePreset('10')}
        >
          <Text style={styles.buttonLabel}>10 Hz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, selectedItem === '15' && styles.selectedButton]}
          onPress={() => handlePreset('15')}
        >
          <Text style={styles.buttonLabel}>15 Hz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, selectedItem === '20' && styles.selectedButton]}
          onPress={() => handlePreset('20')}
        >
          <Text style={styles.buttonLabel}>20 Hz</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <Button title="Next" onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "600", textAlign: "center", padding: 10},
  header: { fontSize: 17, fontWeight: "200", textAlign: "center", marginBottom: 220},
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 320
  },
  button: {
    aspectRatio: 2,
    height: 150,
    backgroundColor: dark.button,
    borderColor: dark.buttonText,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    borderRadius: 24
  },
  selectedButton: {
    backgroundColor: 'green',
  },
  buttonLabel: {
    fontSize: 25,
    fontWeight: "700",
    color: dark.buttonText
  },
  input: {
    height: 40,
    margin: 80,
    borderWidth: 1,
    padding: 10,
    backgroundColor: dark.button,
    borderRadius: 10,
    color: dark.text
  }
});
