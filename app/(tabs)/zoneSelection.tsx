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
  const [selectedZones, setSelectedZones] = useState<number[]>([]);

  const zones = Array.from({ length: 12 }, (_, i) => i + 1);

  const toggleZone = useCallback((zoneNumber: number) => {
    setSelectedZones((prev: number[]) => {
      
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.includes(zoneNumber)
        ? safePrev.filter((z) => z !== zoneNumber)
        : [...safePrev, zoneNumber];
    });
  }, []);

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

        {/* Selected Zones Display */}
        
          {/* <View style={styles.selectedContainer}>
            <Text style={styles.selectedText}>
              Selected Zones: {selectedZones.sort((a, b) => a - b).join(', ')}
            </Text>
          </View> */}
          <Pressable
  onPress={() =>
    router.push({
      pathname: '/powerLevelPage',
      params: { zones: JSON.stringify(selectedZones.sort((a, b) => a - b)) },
    })
  }
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000000',
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFF',
//     textAlign: 'center',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-start',
//   },
//   zoneButton: {
//     width: '47%',
//     backgroundColor: '#1A1A1A',
//     borderRadius: 12,
//     padding: 20,
//     marginBottom: 15,
//     borderWidth: 2,
//     borderColor: '#333333',
//     elevation: 3,
//     shadowColor: '#FFFFFF',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   zoneButtonSelected: {
//     borderColor: '#00FF00',
//   },
//   zoneContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   radioContainer: {
//     marginRight: 15,
//   },
//   radioOuter: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   radioSelected: {
//     borderColor: '#00FF00',
//   },
//   radioInner: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: '#00FF00',
//   },
//   zoneNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     flex: 1,
//     textAlign: 'center',
//   },
//   selectedContainer: {
//     marginTop: 30,
//     padding: 20,
//     backgroundColor: '#1A1A1A',
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#00FF00',
//     alignItems: 'center',
//   },
//   selectedText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#00FF00',
//   },
// });
