import HomeButton from "@/components/ui/HomeButton";
import { AppColors } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useProtocol } from "../../context/ProtcolStorageContext";

export default function ComplexControlPage() {
  const params = useLocalSearchParams();
  const { protocol, setZoneConfigForZones } = useProtocol();
  const { width, height } = useWindowDimensions();

  const baseWidth = 390;
  const baseHeight = 844;
  const scale = Math.max(
    0.7,
    Math.min(1, Math.min(width / baseWidth, height / baseHeight)),
  );

  const zoneIds = useMemo(() => {
    const raw = params.zoneIds;
    if (typeof raw !== "string") return [];
    return raw
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
  }, [params.zoneIds]);

  const [selectedItemPower, setSelectedItemPower] = useState<number | null>(
    null,
  );
  const [text, onChangeText] = useState("");
  const [selectedItemFreq, setSelectedItemFreq] = useState<number | null>(null);

  useEffect(() => {
    if (!protocol || zoneIds.length === 0) {
      setSelectedItemPower(null);
      setSelectedItemFreq(null);
      onChangeText("");
      return;
    }

    const configs = zoneIds.map((id) => protocol.Zones?.[id]).filter(Boolean);

    if (configs.length !== zoneIds.length) {
      setSelectedItemPower(null);
      setSelectedItemFreq(null);
      onChangeText("");
      return;
    }

    const first = configs[0];
    if (!first) {
      setSelectedItemPower(null);
      setSelectedItemFreq(null);
      onChangeText("");
      return;
    }

    const allMatch = configs.every(
      (cfg) =>
        cfg?.powerLevel === first.powerLevel &&
        cfg?.frequencyHz === first.frequencyHz,
    );

    const hasSavedValues = first.powerLevel > 0;

    if (allMatch && hasSavedValues) {
      setSelectedItemPower(first.powerLevel);
      setSelectedItemFreq(first.frequencyHz);
      onChangeText(String(first.frequencyHz));
    } else {
      setSelectedItemPower(null);
      setSelectedItemFreq(null);
      onChangeText("");
    }
  }, [protocol, zoneIds]);

  const handlePressPower = (val: number) => {
    setSelectedItemPower(val);
    console.log(params);
  };

  const handlePressFreq = (val: number) => {
    setSelectedItemFreq(val);
    onChangeText(String(val));
  };

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
    router.push("/complexZoneSelection");
  }, [
    zoneIds,
    selectedItemPower,
    selectedItemFreq,
    text,
    setZoneConfigForZones,
  ]);

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: AppColors.background }]}
    >
      <StatusBar style="light" backgroundColor={AppColors.background} />

      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.push("/complexZoneSelection")}
          style={styles.headerBack}
          hitSlop={10}
        >
          <Text style={styles.backText}>{"<"}</Text>
        </Pressable>

        <View style={styles.headerSpacer} />
        <Text style={[styles.title, { fontSize: Math.round(24 * scale) }]}>
          Power Level
        </Text>
        <View style={styles.headerHome}>
          <HomeButton />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.round(20 * scale) },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: AppColors.background,
              paddingHorizontal: Math.round(8 * scale),
              paddingBottom: Math.round(10 * scale),
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                height: Math.round(120 * scale),
                borderRadius: Math.round(24 * scale),
                marginVertical: Math.round(10 * scale),
              },
              selectedItemPower === 25 && styles.selectedButton,
            ]}
            onPress={() => handlePressPower(25)}
          >
            <Text
              style={[styles.buttonLabel, { fontSize: Math.round(25 * scale) }]}
            >
              25%
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                height: Math.round(120 * scale),
                borderRadius: Math.round(24 * scale),
                marginVertical: Math.round(10 * scale),
              },
              selectedItemPower === 50 && styles.selectedButton,
            ]}
            onPress={() => handlePressPower(50)}
          >
            <Text
              style={[styles.buttonLabel, { fontSize: Math.round(25 * scale) }]}
            >
              50%
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                height: Math.round(120 * scale),
                borderRadius: Math.round(24 * scale),
                marginVertical: Math.round(10 * scale),
              },
              selectedItemPower === 75 && styles.selectedButton,
            ]}
            onPress={() => handlePressPower(75)}
          >
            <Text
              style={[styles.buttonLabel, { fontSize: Math.round(25 * scale) }]}
            >
              75%
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                height: Math.round(120 * scale),
                borderRadius: Math.round(24 * scale),
                marginVertical: Math.round(10 * scale),
              },
              selectedItemPower === 100 && styles.selectedButton,
            ]}
            onPress={() => handlePressPower(100)}
          >
            <Text
              style={[styles.buttonLabel, { fontSize: Math.round(25 * scale) }]}
            >
              100%
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.title,
            {
              fontSize: Math.round(24 * scale),
              marginTop: Math.round(8 * scale),
              marginBottom: Math.round(8 * scale),
            },
          ]}
        >
          Frequency (Hz)
        </Text>

        <TextInput
          multiline={false}
          style={[
            styles.input,
            {
              marginHorizontal: Math.round(24 * scale),
              marginVertical: Math.round(16 * scale),
              height: Math.round(44 * scale),
              fontSize: Math.round(18 * scale),
            },
          ]}
          placeholder="0 - 20,000"
          placeholderTextColor="gray"
          onChangeText={(newText) => {
            onChangeText(newText);
            const parsed = Number(newText);
            setSelectedItemFreq(Number.isFinite(parsed) ? parsed : null);
          }}
          value={text}
          keyboardType="numeric"
        />

        <View
          style={[
            styles.container,
            {
              backgroundColor: AppColors.background,
              paddingHorizontal: Math.round(8 * scale),
              paddingBottom: Math.round(8 * scale),
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                height: Math.round(120 * scale),
                borderRadius: Math.round(24 * scale),
                marginVertical: Math.round(10 * scale),
              },
              selectedItemFreq === 0 && styles.selectedButton,
            ]}
            onPress={() => handlePressFreq(0)}
          >
            <Text
              style={[styles.buttonLabel, { fontSize: Math.round(25 * scale) }]}
            >
              0
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                height: Math.round(120 * scale),
                borderRadius: Math.round(24 * scale),
                marginVertical: Math.round(10 * scale),
              },
              selectedItemFreq === 50 && styles.selectedButton,
            ]}
            onPress={() => handlePressFreq(50)}
          >
            <Text
              style={[styles.buttonLabel, { fontSize: Math.round(25 * scale) }]}
            >
              50
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                height: Math.round(120 * scale),
                borderRadius: Math.round(24 * scale),
                marginVertical: Math.round(10 * scale),
              },
              selectedItemFreq === 75 && styles.selectedButton,
            ]}
            onPress={() => handlePressFreq(75)}
          >
            <Text
              style={[styles.buttonLabel, { fontSize: Math.round(25 * scale) }]}
            >
              75
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              {
                height: Math.round(120 * scale),
                borderRadius: Math.round(24 * scale),
                marginVertical: Math.round(10 * scale),
              },
              selectedItemFreq === 100 && styles.selectedButton,
            ]}
            onPress={() => handlePressFreq(100)}
          >
            <Text
              style={[styles.buttonLabel, { fontSize: Math.round(25 * scale) }]}
            >
              100
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.bottomButtonsWrap,
            { marginTop: Math.round(8 * scale), gap: Math.round(10 * scale) },
          ]}
        >
          <Pressable
            onPress={applyToGroup}
            style={({ pressed }) => [
              styles.actionBtn,
              { paddingVertical: Math.round(14 * scale) },
              pressed && styles.actionBtnPressed,
            ]}
          >
            <Text
              style={[
                styles.actionBtnText,
                { fontSize: Math.round(18 * scale) },
              ]}
            >
              Apply to Group
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16 },
  scrollContent: {
    paddingTop: 6,
  },
  headerRow: {
    position: "relative",
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 6,
  },
  headerBack: {
    position: "absolute",
    left: 0,
    top: 35,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 2,
  },
  backText: {
    fontSize: 28,
    color: AppColors.text,
    fontWeight: "700",
    lineHeight: 28,
  },
  headerSpacer: {
    width: 48,
    height: 48,
  },
  headerHome: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  title: {
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 8,
    color: AppColors.text,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    width: "47%",
    aspectRatio: 2,
    backgroundColor: AppColors.button,
    borderColor: AppColors.text,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: AppColors.success,
  },
  buttonLabel: {
    fontWeight: "700",
    color: AppColors.text,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    backgroundColor: AppColors.button,
    borderRadius: 10,
    color: AppColors.text,
  },
  bottomButtonsWrap: {
    width: "100%",
    marginBottom: 8,
  },
  actionBtn: {
    width: "100%",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.primary,
  },
  actionBtnText: {
    color: AppColors.text,
    fontWeight: "800",
  },
  actionBtnPressed: {
    opacity: 0.9,
  },
});
