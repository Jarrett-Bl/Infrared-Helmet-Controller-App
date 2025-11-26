import HomeButton from '@/components/ui/HomeButton';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from "../../styles/sharedStyles";

export default function FunctionsScreen() {
  const groupColors = ["#4C9AFF", "#FF8C42", "#C85EC7", "#FFD700", "#50D890"];
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [groupedZones, setGroupedZones] = useState<number[]>([]);
  const [groups, setGroups] = useState<
    { id: number; zones: number[]; color: string }[]
  >([]);

  const zones = Array.from({ length: 12 }, (_, i) => i + 1);

  const toggleZone = useCallback((zoneNumber: number) => {
    setSelectedZones((prev: number[]) => {
      
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.includes(zoneNumber)
        ? safePrev.filter((z) => z !== zoneNumber)
        : [...safePrev, zoneNumber];
    });
  }, []);

  const setGroup = useCallback(() => {
    if (selectedZones.length === 0) return;
    
    const existingGroup = groups.find((g) =>
      g.zones.some((z) => selectedZones.includes(z))
    );

    if (existingGroup) {
      setGroups((prevGroups) =>
        prevGroups.map((g) =>
          g.id === existingGroup.id
            ? { ...g, zones: Array.from(new Set([...g.zones, ...selectedZones])) }
            : g
        )
      );

      setGroupedZones((prev) =>
        Array.from(new Set([...prev, ...selectedZones]))
      );
    } else {
      const newGroupId = groups.length + 1;
      const newColor = groupColors[(newGroupId - 1) % groupColors.length];

      setGroups((prev) => [
        ...prev,
        { id: newGroupId, zones: selectedZones, color: newColor },
      ]);

      setGroupedZones((prev) => [...new Set([...prev, ...selectedZones])]);
    }

    setSelectedZones([]);
  }, [selectedZones, groups]);


  const isSelected = (zoneNumber: number): boolean =>
    Array.isArray(selectedZones) && selectedZones.includes(zoneNumber);

  const isGrouped = (zoneNumber: number): boolean =>
    groupedZones.includes(zoneNumber);

  const createGroup = useCallback(() => {
    setGroupedZones((prev) => [...new Set([...prev, ...selectedZones])]);
    
    const newGroupId = groups.length + 1;
    const newColor = groupColors[(newGroupId - 1) % groupColors.length];

    setGroups((prev) => [
      ...prev,
      { id: newGroupId, zones: selectedZones, color: newColor },
    ]);

    console.log(groups);
    console.log(groupedZones);

    setSelectedZones([]); // clear after grouping
  }, [selectedZones, groups]);


  const getGroupColor = (zone: number) => {
    const found = groups.find((g) => g.zones.includes(zone));
    return (found ? found.color : "white");
  };

  const deleteGroup = useCallback(() => {
    const groupToDelete = groups.find((g) => g.zones.includes(selectedZones[0]));

    if (!groupToDelete) {
      console.log("Selected zones are not part of any group");
      return;
    }

    setGroups((prevGroups) =>
      prevGroups.filter((g) => g.id !== groupToDelete.id)
    );

    setGroupedZones((prevGrouped) =>
      prevGrouped.filter((z) => !groupToDelete.zones.includes(z))
    );

    setSelectedZones([]);
  }, [selectedZones, groups]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Zone Selection</Text>
      </View>

      <HomeButton
        onPress={() => console.log('Navigating from Zone Selection to Home')}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Zone Grid */}
        <View style={styles.gridContainer}>
          {zones.map((zoneNumber, index) => {
            const selected = isSelected(zoneNumber);
            const grouped = isGrouped(zoneNumber);
            const isRightItem = (index + 1) % 2 === 0;
            const group = groups.find((g) => g.zones.includes(zoneNumber));
            
            return (
              <TouchableOpacity
                key={zoneNumber}
                style={[
                  styles.zoneButton,
                  selected && styles.zoneButtonSelected,
                  grouped && { borderColor: getGroupColor(zoneNumber) },
                  !isRightItem && { marginRight: 15 },
                ]}
                onPress={() => 
                  group ? 
                    setSelectedZones(group.zones) :
                    toggleZone(zoneNumber)}
                activeOpacity={0.7}
                accessibilityRole="checkbox"
                accessibilityLabel={`Zone ${zoneNumber}`}
                accessibilityState={{ checked: selected }}
              >
                <View style={styles.zoneContent}>
                  {/* Radio/Checkbox Visual */}
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
        
        style={({ pressed }) => [
          styles.selectedContainer,
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={styles.selectedText}>Set Group</Text>
      </Pressable>

      <Pressable
        onPress={deleteGroup}
        
        style={({ pressed }) => [
          styles.selectedContainer,
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={styles.selectedText}>Delete Group</Text>
      </Pressable>

      <Pressable
        onPress={() =>
          router.push({
            pathname: '/complexControlPage',
          params: { zoneGroup: groups.find((g) => g.zones.includes(selectedZones[0]))?.color }
          })
        }
        style={({ pressed }) => [
          styles.selectedContainer,
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={styles.selectedText}>Controls</Text>
      </Pressable>

      <Pressable
        onPress={() =>
          router.push({
            pathname: '/powerLevelPage'
          })
        }
        style={({ pressed }) => [
          styles.selectedContainer,
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Text style={styles.selectedText}>
          Next
        </Text>
      </Pressable>
        
      </ScrollView>
    </SafeAreaView>
  );
}