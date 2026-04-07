import { AppColors } from "@/constants/theme";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useProtocol } from "../../context/ProtcolStorageContext";
import { styles } from "../../styles/sharedStyles";

type ZoneGroup = { id: number; zones: number[]; color: string };

export default function ComplexZoneSelectionPage() {
  const params = useLocalSearchParams();
  const { protocol, initProtocol, removeZonesFromProtocol } = useProtocol();

  const groupColors = [
    "#04D9FF",
    "#BC13FE",
    "#FE019A",
    "#FFA500",
    "#CFFF04",
    "#ff073a",
    "#40E0D0",
    "#FFC0CB",
    "#8B4513",
    "#000000",
    "#FE4164",
    "#7B68EE",
  ];

  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [groupedZones, setGroupedZones] = useState<number[]>([]);
  const [groups, setGroups] = useState<ZoneGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // 🔥 NEW: rebuild groups from saved protocol (for edit)
  const rebuildGroupsFromProtocol = useCallback(() => {
    if (!protocol || protocol.editorType !== "complex") return;

    const entries = Object.entries(protocol.Zones ?? {});
    if (!entries.length) {
      setGroups([]);
      setGroupedZones([]);
      setSelectedZones([]);
      setSelectedGroupId(null);
      return;
    }

    const groupedMap = new Map<string, number[]>();

    entries.forEach(([zoneIdStr, cfg]) => {
      const zoneId = Number(zoneIdStr);
      const key = `${cfg.powerLevel}-${cfg.frequencyHz}`;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, []);
      }

      groupedMap.get(key)!.push(zoneId);
    });

    const rebuiltGroups: ZoneGroup[] = Array.from(groupedMap.entries()).map(
      ([, zones], index) => ({
        id: index + 1,
        zones: zones.sort((a, b) => a - b),
        color: groupColors[index % groupColors.length],
      }),
    );

    setGroups(rebuiltGroups);
    setGroupedZones(
      rebuiltGroups.flatMap((g) => g.zones).sort((a, b) => a - b),
    );
    setSelectedZones([]);
    setSelectedGroupId(null);
  }, [protocol, groupColors]);

  useFocusEffect(
    useCallback(() => {
      const isFresh = params.fresh === "1";

      if (isFresh) {
        setSelectedZones([]);
        setGroupedZones([]);
        setGroups([]);
        setSelectedGroupId(null);

        if (!protocol) {
          initProtocol("complex");
        }
        return;
      }

      if (!protocol) {
        initProtocol("complex");
        return;
      }

      if (protocol.editorType === "complex") {
        rebuildGroupsFromProtocol();
      }
    }, [params.fresh, protocol, initProtocol, rebuildGroupsFromProtocol]),
  );

  const zones = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const isSelected = useCallback(
    (zoneNumber: number) =>
      Array.isArray(selectedZones) && selectedZones.includes(zoneNumber),
    [selectedZones],
  );

  const isGrouped = useCallback(
    (zoneNumber: number) => groupedZones.includes(zoneNumber),
    [groupedZones],
  );

  const getGroupForZone = useCallback(
    (zoneNumber: number) => groups.find((g) => g.zones.includes(zoneNumber)),
    [groups],
  );

  const getGroupColor = useCallback(
    (zoneNumber: number) => getGroupForZone(zoneNumber)?.color ?? "white",
    [getGroupForZone],
  );

  const toggleZone = useCallback((zoneNumber: number) => {
    setSelectedZones((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.includes(zoneNumber)
        ? safePrev.filter((z) => z !== zoneNumber)
        : [...safePrev, zoneNumber];
    });
  }, []);

  const pickNextColor = useCallback((): string => {
    const used = new Set(groups.map((g) => g.color));
    return (
      groupColors.find((c) => !used.has(c)) ??
      groupColors[groups.length % groupColors.length]
    );
  }, [groups, groupColors]);

  const createGroup = useCallback(() => {
    if (selectedZones.length === 0) return;

    const overlaps = selectedZones.some((z) => groupedZones.includes(z));
    if (overlaps) return;

    const newGroupId =
      (groups.reduce((max, g) => Math.max(max, g.id), 0) || 0) + 1;
    const newColor = pickNextColor();

    setGroups((prev) => [
      ...prev,
      { id: newGroupId, zones: [...selectedZones], color: newColor },
    ]);
    setGroupedZones((prev) => Array.from(new Set([...prev, ...selectedZones])));

    setSelectedGroupId(null);
    setSelectedZones([]);
  }, [selectedZones, groupedZones, groups, pickNextColor]);

  const deleteGroup = useCallback(() => {
    if (selectedZones.length === 0 && selectedGroupId == null) return;

    const groupToDelete =
      (selectedGroupId != null
        ? groups.find((g) => g.id === selectedGroupId)
        : undefined) || groups.find((g) => g.zones.includes(selectedZones[0]));

    if (!groupToDelete) return;

    setGroups((prev) => prev.filter((g) => g.id !== groupToDelete.id));
    setGroupedZones((prev) =>
      prev.filter((z) => !groupToDelete.zones.includes(z)),
    );

    removeZonesFromProtocol(groupToDelete.zones);

    setSelectedGroupId(null);
    setSelectedZones([]);
  }, [selectedZones, groups, selectedGroupId, removeZonesFromProtocol]);

  const canOpenControls = useMemo(
    () => selectedGroupId != null,
    [selectedGroupId],
  );

  const canGoNext = useMemo(() => {
    return !!protocol && Object.keys(protocol.Zones ?? {}).length > 0;
  }, [protocol]);

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

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {zones.map((zoneNumber, index) => {
            const selected = isSelected(zoneNumber);
            const grouped = isGrouped(zoneNumber);
            const isRightItem = (index + 1) % 2 === 0;
            const group = getGroupForZone(zoneNumber);

            return (
              <TouchableOpacity
                key={zoneNumber}
                style={[
                  styles.zoneButton,
                  selected && styles.zoneButtonSelected,
                  grouped && { borderColor: getGroupColor(zoneNumber) },
                  !isRightItem && { marginRight: 15 },
                ]}
                onPress={() => {
                  const tappedGroup = group;

                  if (tappedGroup) {
                    if (selectedGroupId === tappedGroup.id) {
                      setSelectedGroupId(null);
                      setSelectedZones([]);
                      return;
                    }

                    setSelectedGroupId(tappedGroup.id);
                    setSelectedZones(tappedGroup.zones);
                    return;
                  }

                  if (selectedGroupId !== null) {
                    setSelectedGroupId(null);
                    setSelectedZones([zoneNumber]);
                    return;
                  }

                  toggleZone(zoneNumber);
                }}
                activeOpacity={0.7}
                accessibilityRole="checkbox"
                accessibilityLabel={`Zone ${zoneNumber}`}
                accessibilityState={{ checked: selected }}
              >
                <View style={styles.zoneContent}>
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.radioSelected,
                      ]}
                    >
                      {selected && <View style={styles.radioInner} />}
                    </View>
                  </View>

                  <Text style={styles.zoneNumber}>{zoneNumber}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Pressable
          onPress={createGroup}
          disabled={
            selectedZones.length === 0 ||
            selectedZones.some((z) => groupedZones.includes(z))
          }
          style={({ pressed }) => [
            styles.selectedContainer,
            { opacity: pressed ? 0.8 : 1 },
            (selectedZones.length === 0 ||
              selectedZones.some((z) => groupedZones.includes(z))) && {
              opacity: 0.35,
            },
          ]}
        >
          <Text style={styles.selectedText}>Set Group</Text>
        </Pressable>

        <Pressable
          onPress={deleteGroup}
          disabled={selectedGroupId == null}
          style={({ pressed }) => [
            styles.selectedContainer,
            { opacity: pressed ? 0.8 : 1 },
            selectedGroupId == null && { opacity: 0.35 },
          ]}
        >
          <Text style={styles.selectedText}>Delete Group</Text>
        </Pressable>

        <Pressable
          disabled={!canOpenControls}
          onPress={() => {
            const selectedGroup = groups.find((g) => g.id === selectedGroupId);
            if (!selectedGroup) return;

            router.push({
              pathname: "/complexControlPage",
              params: {
                zoneGroup: selectedGroup.color,
                zoneIds: selectedGroup.zones.join(","),
              },
            });
          }}
          style={({ pressed }) => [
            styles.selectedContainer,
            { opacity: pressed ? 0.8 : 1 },
            !canOpenControls && { opacity: 0.35 },
          ]}
        >
          <Text style={styles.selectedText}>Controls</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push({ pathname: "/complexTimePage" })}
          disabled={!canGoNext}
          style={({ pressed }) => [
            styles.selectedContainer,
            { opacity: pressed ? 0.8 : 1 },
            !canGoNext && { opacity: 0.35 },
          ]}
        >
          <Text style={styles.selectedText}>Next</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
