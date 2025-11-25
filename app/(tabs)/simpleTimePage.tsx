import HomeButton from "@/components/ui/HomeButton";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProtocol } from '../../context/ProtcolStorageContext';
import { styles } from "../../styles/sharedStyles";

export default function SimpleTimePage() {
  const [minutes, setMinutes] = useState(15);
  const { setTime} = useProtocol();

  const handleNext = async () => {
    
    setTime(minutes, 0);

    try {
      
      router.push("/runPage");
    } catch (e) {
      console.error("Nav Failed", e);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" backgroundColor="#0E1418" />
      <Text style={styles.title}>Select Your Session Time</Text>
      <HomeButton />

      <View style={lStyles.body}>
        <View style={[styles.card, lStyles.cardGrow]}>
          {/* Range header */}
          <View style={lStyles.rangeRow}>
            <Text style={styles.cardSub}>1 – 30</Text>
            <Text style={lStyles.valueText}>{minutes} min</Text>
          </View>

          {/* Slider */}
          <Slider
            style={lStyles.slider}
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={minutes}
            onValueChange={(v) => setMinutes(Math.round(v))}
            minimumTrackTintColor="#AEB7BF"
            maximumTrackTintColor="#22303A"
            thumbTintColor="#FFFFFF"
          />

          {/* Quick-pick tiles */}
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

        {/* Next button */}
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
  headerStyle: { backgroundColor: "#0E1418" },
  headerTintColor: "#FFFFFF",
  contentStyle: { backgroundColor: "#0E1418" },
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
  valueText: { color: "white", fontSize: 18, fontWeight: "700" },
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
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#333333",
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  tileSelected: {
    borderColor: "#00FF00",
  },
  tileText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  footer: { marginTop: 16, marginBottom: 24 },
});