import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function SimpleTimePage() {
  const [minutes, setMinutes] = useState(15);
  const quick = [5, 10, 15, 30];

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar style="light" backgroundColor="#000" />

      <View style={s.body}>
        <Text style={s.title}>Session Time (Minutes)</Text>

        <View style={[s.card, { backgroundColor: "#000" }]}>
          <View style={s.rangeRow}>
            <Text style={s.subText}>1 - 30</Text>
            <Text style={s.subText}>{minutes}</Text>
          </View>

          <Slider
            style={s.slider}
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={minutes}
            onValueChange={(v) => setMinutes(Math.round(v))}
            minimumTrackTintColor="#E5E7EB" 
            maximumTrackTintColor="#374151"
            thumbTintColor="#E5E7EB"
          />

          <View style={s.chipsWrap}>
            {quick.map((m) => (
              <Pressable
                key={m}
                onPress={() => setMinutes(m)}
                style={[s.chip, minutes === m && s.chipSelected]}
              >
                <Text style={s.chipText}>{m} minutes</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={s.footer}>
          <Pressable
            style={s.nextBtn}
            onPress={() => router.push("../frequencyPage")}
          >
            <Text style={s.nextLabel}>Next</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export const options = {
  title: "Simple Time",
  headerStyle: { backgroundColor: "#000" },
  headerTintColor: "#E5E7EB",
  contentStyle: { backgroundColor: "#000" },
};

const s = StyleSheet.create({

  screen: { flex: 1, backgroundColor: "#000" },

  body: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },


  title: { fontSize: 20, fontWeight: "700", color: "#E5E7EB", marginBottom: 12 },

  card: {
    flex: 1, 
    backgroundColor: "#111827", 
    borderRadius: 12,
    padding: 16,
    justifyContent: "flex-start",
  },

  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  subText: { color: "#9CA3AF", fontSize: 12 },


  chipsWrap: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  chip: {
    width: "48%",
    height: 64,
    borderRadius: 14,
    backgroundColor: "#2F3843", 
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#2B3340",
  },
  chipSelected: { borderColor: "#A3AED0" },
  chipText: { color: "#E5E7EB", fontSize: 14, fontWeight: "700" },

 
  footer: { flex: 1, justifyContent: "flex-end", paddingBottom: 24 },
  nextBtn: {
    backgroundColor: "#60A5FA", 
    borderRadius: 12,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  nextLabel: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  slider: {
    height: 40,           
    transform: [{ scaleY: 1.4 }], 
    marginTop: 6,
    marginBottom: 20,      
  },
});


