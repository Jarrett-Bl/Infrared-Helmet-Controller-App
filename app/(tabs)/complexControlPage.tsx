import HomeButton from "@/components/ui/HomeButton";
import { AppColors } from "@/constants/theme";
import { Link, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useProtocol } from "../../context/ProtcolStorageContext";

export default function ComplexControlPage() {
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
      <Text
        style={[
          styles.title,
          {
            color: zoneGroupColor ? zoneGroupColor : AppColors.text,
            marginTop: 16,
          },
        ]}
      >
        Power Level
      </Text>

      <HomeButton />
      <StatusBar style={"light"} backgroundColor={AppColors.background} />

      <View
        style={[styles.container, { backgroundColor: AppColors.background }]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            selectedItemPower === 0 && styles.selectedButton,
          ]}
          onPress={() => handlePressPower(0)}
        >
          <Text style={styles.buttonLabel}>25%</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedItemPower === 50 && styles.selectedButton,
          ]}
          onPress={() => handlePressPower(50)}
        >
          <Text style={styles.buttonLabel}>50%</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedItemPower === 75 && styles.selectedButton,
          ]}
          onPress={() => handlePressPower(75)}
        >
          <Text style={styles.buttonLabel}>75%</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedItemPower === 100 && styles.selectedButton,
          ]}
          onPress={() => handlePressPower(100)}
        >
          <Text style={styles.buttonLabel}>100%</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.title,
          { color: zoneGroupColor ? zoneGroupColor : AppColors.text },
        ]}
      >
        Frequency (Hz)
      </Text>

      <TextInput
        multiline={false}
        style={styles.input}
        placeholder="0 - 20,000"
        placeholderTextColor="gray"
        onChangeText={(newText) => onChangeText(newText)}
        value={text}
        keyboardType="numeric"
      />

      <View
        style={[styles.container, { backgroundColor: AppColors.background }]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            selectedItemFreq === 0 && styles.selectedButton,
          ]}
          onPress={() => handlePressFreq(0)}
        >
          <Text style={styles.buttonLabel}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedItemFreq === 50 && styles.selectedButton,
          ]}
          onPress={() => handlePressFreq(50)}
        >
          <Text style={styles.buttonLabel}>50</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedItemFreq === 75 && styles.selectedButton,
          ]}
          onPress={() => handlePressFreq(75)}
        >
          <Text style={styles.buttonLabel}>75</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            selectedItemFreq === 100 && styles.selectedButton,
          ]}
          onPress={() => handlePressFreq(100)}
        >
          <Text style={styles.buttonLabel}>100</Text>
        </TouchableOpacity>
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
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "600", textAlign: "center", padding: 10 },
  header: {
    fontSize: 17,
    fontWeight: "200",
    textAlign: "center",
    marginBottom: 20,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    paddingBottom: 20,
  },
  button: {
    aspectRatio: 2,
    height: 150,
    backgroundColor: AppColors.button,
    borderColor: AppColors.text,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    borderRadius: 24,
  },
  selectedButton: {
    backgroundColor: AppColors.success,
  },
  buttonLabel: {
    fontSize: 25,
    fontWeight: 700,
    color: AppColors.text,
  },
  input: {
    height: 40,
    margin: 80,
    borderWidth: 1,
    padding: 10,
    backgroundColor: AppColors.button,
    borderRadius: 10,
    color: AppColors.text,
  },
});
