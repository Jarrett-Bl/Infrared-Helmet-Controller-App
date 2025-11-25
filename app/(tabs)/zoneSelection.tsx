import HomeButton from '@/components/ui/HomeButton';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useProtocol } from '../../context/ProtcolStorageContext';
import { styles } from "../../styles/sharedStyles";

export default function FunctionsScreen() {
  const { protocol, initProtocol, setZonesFromSelection } = useProtocol();
  const [selectedZones, setSelectedZones] = useState<number[]>([]);

  useEffect(() => {
    initProtocol();
  },[initProtocol]);

  const zones = Array.from({ length: 12 }, (_, i) => i + 1);

 
  const toggleZone = useCallback((zoneNumber: number) => {
    setSelectedZones((prev) =>
      prev.includes(zoneNumber)
        ? prev.filter((z) => z !== zoneNumber)
        : [...prev, zoneNumber]
    );
  }, []);

  const handleNext = () => {
    setZonesFromSelection(selectedZones);
    router.push("/powerLevelPage");
  };

  const isSelected = (zoneNumber: number): boolean =>
    Array.isArray(selectedZones) && selectedZones.includes(zoneNumber);


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
            const isRightItem = (index + 1) % 2 === 0;

            return (
              <TouchableOpacity
                key={zoneNumber}
                style={[
                  styles.zoneButton,
                  selected && styles.zoneButtonSelected,
                  !isRightItem && { marginRight: 15 },
                ]}
                onPress={() => toggleZone(zoneNumber)}
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
  onPress={handleNext}
  style={({ pressed }) => [
    styles.selectedContainer,
    { opacity: pressed ? 0.8 : 1 },
  ]}
>
  <Text style={styles.selectedText}>
    {selectedZones.length > 0
      ? `Selected Zones: ${selectedZones.sort((a, b) => a - b).join(', ')}`
      : 'No zones selected'}
  </Text>
</Pressable>
        
      </ScrollView>
    </SafeAreaView>
  );
}

