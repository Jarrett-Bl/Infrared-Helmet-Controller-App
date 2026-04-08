import { AppColors } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProtocol } from "../../context/ProtcolStorageContext";
import { styles } from "../../styles/sharedStyles";

const zoneStyles = StyleSheet.create({
  main: {
    flex: 1,
    minHeight: 0,
  },
  gridCenter: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
  },
  zoneButton: {
    width: "47%",
    marginBottom: 12,
    minHeight: 72,
    paddingVertical: 20,
    paddingHorizontal: 22,
    borderRadius: 14,
    backgroundColor: AppColors.card,
    borderWidth: 2,
    borderColor: AppColors.border,
    elevation: 3,
    shadowColor: AppColors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: "center",
  },
  zoneNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: AppColors.text,
    flex: 1,
    textAlign: "center",
  },
  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: AppColors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: AppColors.selected,
  },
});

export default function FunctionsScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { protocol, initProtocol, setZonesFromSelection } = useProtocol();
  const [selectedZones, setSelectedZones] = useState<number[]>([]);

  useEffect(() => {
    const isFresh = params.fresh === "1";

    if (isFresh) {
      setSelectedZones([]);
      if (!protocol || protocol.editorType !== "simple") {
        initProtocol("simple");
      }
      return;
    }

    if (!protocol) {
      initProtocol("simple");
      return;
    }

    if (protocol.editorType === "simple") {
      const existingZoneIds = Object.keys(protocol.Zones || {})
        .map(Number)
        .sort((a, b) => a - b);

      setSelectedZones(existingZoneIds);
    }
  }, [params.fresh, protocol, initProtocol]);

  const zones = Array.from({ length: 12 }, (_, i) => i + 1);

  const toggleZone = useCallback((zoneNumber: number) => {
    setSelectedZones((prev) =>
      prev.includes(zoneNumber)
        ? prev.filter((z) => z !== zoneNumber)
        : [...prev, zoneNumber],
    );
  }, []);

  const handleNext = () => {
    setZonesFromSelection(selectedZones);
    const isFresh = params.fresh === "1";
    if (isFresh) {
      router.push({
        pathname: "/frequencyPage",
        params: { fresh: "1" },
      });
    } else {
      router.push("/frequencyPage");
    }
  };

  const isSelected = (zoneNumber: number): boolean =>
    Array.isArray(selectedZones) && selectedZones.includes(zoneNumber);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <Pressable
        onPress={() => router.push("/bluetoothDevicePairing")}
        style={{
          position: "absolute",
          left: 20,
          top: 35,
          width: 48,
          height: 48,
          justifyContent: "center",
          alignItems: "flex-start",
          zIndex: 2,
        }}
        hitSlop={10}
      >
        <Text
          style={{
            color: AppColors.text,
            fontSize: 28,
            fontWeight: "800",
          }}
        >
          {"<"}
        </Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Zone Selection</Text>
      </View>

      <View style={zoneStyles.main}>
        <View style={zoneStyles.gridCenter}>
          <View style={zoneStyles.grid}>
            {zones.map((zoneNumber, index) => {
              const selected = isSelected(zoneNumber);
              const isRightItem = (index + 1) % 2 === 0;

              return (
                <TouchableOpacity
                  key={zoneNumber}
                  style={[
                    zoneStyles.zoneButton,
                    selected && styles.zoneButtonSelected,
                    !isRightItem && { marginRight: 16 },
                  ]}
                  onPress={() => toggleZone(zoneNumber)}
                  activeOpacity={0.7}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`Zone ${zoneNumber}`}
                  accessibilityState={{ checked: selected }}
                >
                  <View style={styles.zoneContent}>
                    <View style={styles.radioContainer}>
                      <View
                        style={[
                          zoneStyles.radioOuter,
                          selected && styles.radioSelected,
                        ]}
                      >
                        {selected && <View style={zoneStyles.radioInner} />}
                      </View>
                    </View>

                    <Text style={zoneStyles.zoneNumber}>{zoneNumber}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.selectedContainer,
            {
              marginTop: 12,
              marginBottom: Math.max(insets.bottom, 12),
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.selectedText}>
            {selectedZones.length > 0
              ? `Selected Zones: ${selectedZones.sort((a, b) => a - b).join(", ")}`
              : "No zones selected"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
