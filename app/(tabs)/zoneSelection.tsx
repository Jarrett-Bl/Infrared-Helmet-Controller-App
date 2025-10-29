import HomeButton from '@/components/ui/HomeButton';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FunctionsScreen() {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const zones = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleZoneSelect = (zoneNumber: number) => {
    setSelectedZone(zoneNumber);
    console.log(`Zone Selection: Zone number: ${zoneNumber} selected`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Zone Selection</Text>
      </View>

      {/* Zone Grid */}
      <HomeButton
        onPress={() => console.log('Navigating from Zone Selection to Home')}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {zones.map((zoneNumber) => (
            <TouchableOpacity
              key={zoneNumber}
              style={styles.zoneButton}
              onPress={() => handleZoneSelect(zoneNumber)}
              activeOpacity={0.7}
            >
              <View style={styles.zoneContent}>
                {/* Radio Button */}
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioOuter,
                    selectedZone === zoneNumber && styles.radioSelected
                  ]}>
                    {selectedZone === zoneNumber && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </View>
                
                {/* Zone Number */}
                <Text style={styles.zoneNumber}>{zoneNumber}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Zone Display */}
        {selectedZone && (
          <View style={styles.selectedContainer}>
            <TouchableOpacity
            />
            <Text style={styles.selectedText}>
              Selected Zone: {selectedZone}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  zoneButton: {
    width: '45%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#333333',
    elevation: 3,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  zoneContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioContainer: {
    marginRight: 15,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#00FF00',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF00',
  },
  zoneNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  selectedContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00FF00',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00FF00',
  },
});