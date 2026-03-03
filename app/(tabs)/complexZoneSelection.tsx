import HomeButton from "@/components/ui/HomeButton";
import { router } from "expo-router";
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
  const { initProtocol, setZonesFromSelection } = useProtocol();

  const groupColors = [
    "#04D9FF", // cyan
    "#BC13FE", // purple
    "#FE019A", // pink
    "#FFA500", // orange
    "#CFFF04", // lime-yellow
    "#ff073a", // red
    "#40E0D0", // turquoise
    "#FFC0CB", // soft pink
    "#8B4513", // brown
    "#000000", // dark green (fine — not selection green)
    "#FE4164",
    "#7B68EE", // slate blue (extra safety color)
  ];

  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [groupedZones, setGroupedZones] = useState<number[]>([]);
  const [groups, setGroups] = useState<ZoneGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

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

  // choose the first unused color from the palette (prevents duplicates after deletions)
  const pickNextColor = useCallback((): string => {
    const used = new Set(groups.map((g) => g.color));
    return (
      groupColors.find((c) => !used.has(c)) ??
      groupColors[groups.length % groupColors.length]
    );
  }, [groups, groupColors]);

  const createGroup = useCallback(() => {
    if (selectedZones.length === 0) return;

    // disallow overlaps: if any selected zone is already grouped, do nothing
    const overlaps = selectedZones.some((z) => groupedZones.includes(z));
    if (overlaps) return;

    const newGroupId =
      (groups.reduce((max, g) => Math.max(max, g.id), 0) || 0) + 1;
    const newColor = pickNextColor();

    setGroups((prev) => [
      ...prev,
      { id: newGroupId, zones: selectedZones, color: newColor },
    ]);
    setGroupedZones((prev) => Array.from(new Set([...prev, ...selectedZones])));

    // clear selection after grouping
    setSelectedGroupId(null);
    setSelectedZones([]);
  }, [selectedZones, groupedZones, groups, pickNextColor]);

  const deleteGroup = useCallback(() => {
    if (selectedZones.length === 0) return;

    // if a group is selected, delete that; otherwise if user tapped one grouped zone, delete its group
    const groupToDelete =
      (selectedGroupId != null
        ? groups.find((g) => g.id === selectedGroupId)
        : undefined) || groups.find((g) => g.zones.includes(selectedZones[0]));

    if (!groupToDelete) return;

    setGroups((prev) => prev.filter((g) => g.id !== groupToDelete.id));
    setGroupedZones((prev) =>
      prev.filter((z) => !groupToDelete.zones.includes(z)),
    );

    // clear selection after deletion
    setSelectedGroupId(null);
    setSelectedZones([]);
  }, [selectedZones, groups, selectedGroupId]);

  const canOpenControls = useMemo(
    () => selectedGroupId != null,
    [selectedGroupId],
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Zone Selection</Text>
      </View>

      <HomeButton
        onPress={() => console.log("Navigating from Zone Selection to Home")}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Zone Grid */}
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

                  // Tap on grouped zone: select/unselect whole group
                  if (tappedGroup) {
                    if (selectedGroupId === tappedGroup.id) {
                      // unselect group
                      setSelectedGroupId(null);
                      setSelectedZones([]);
                      return;
                    }
                    // select this group
                    setSelectedGroupId(tappedGroup.id);
                    setSelectedZones(tappedGroup.zones);
                    return;
                  }

                  // Tap on ungrouped zone:
                  // If a group is selected, clear it and start a new selection
                  if (selectedGroupId !== null) {
                    setSelectedGroupId(null);
                    setSelectedZones([zoneNumber]);
                    return;
                  }

                  // Otherwise normal multi-select
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

        {/* Set Group */}
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

        {/* Delete Group */}
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

        {/* Controls (ONLY for a selected group) */}
        <Pressable
          disabled={!canOpenControls}
          onPress={() => {
            const selectedGroup = groups.find((g) => g.id === selectedGroupId);
            if (!selectedGroup) return;

            // ensure protocol exists + zones set for this group
            initProtocol();
            setZonesFromSelection(selectedGroup.zones);

            router.push({
              pathname: "/complexControlPage",
              params: {
                zoneGroup: selectedGroup.color,
                zoneIds: selectedGroup.zones.join(","), // optional if your control page wants it later
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

        {/* Next */}
        <Pressable
          onPress={() => router.push({ pathname: "/simpleTimePage" })}
          style={({ pressed }) => [
            styles.selectedContainer,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text style={styles.selectedText}>Next</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
