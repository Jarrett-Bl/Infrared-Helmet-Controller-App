import { POWER_DEFAULT, POWER_MAX, POWER_MIN, POWER_STEP, PowerSliderInput } from '@/components/FreqPageComponents';
import { AppColors } from '@/constants/theme';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useProtocol } from '../context/ProtcolStorageContext';

export default function PowerLevelSection() {
  const { setPowerForAllZones } = useProtocol();
  const [power, setPower] = useState(POWER_DEFAULT);

  const handleSetPower = (value: number) => {
    if (value < POWER_MIN || value > POWER_MAX) {
      console.warn('Enter a valid power level (25–100%)');
      return;
    }

    setPower(value);
    setPowerForAllZones(value);
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: AppColors.text, marginTop: 16 }]}>
        Power Level (%)
      </Text>

      <PowerSliderInput
        value={power}
        onChange={handleSetPower}
        min={POWER_MIN}
        max={POWER_MAX}
        step={POWER_STEP}
      />

      <View style={styles.grid}>
        <View style={styles.col}>
          <Pressable
            onPress={() => handleSetPower(25)}
            style={[styles.tile, power === 25 && styles.tileSelected]}
          >
            <Text style={styles.tileText}>25%</Text>
          </Pressable>
          <Pressable
            onPress={() => handleSetPower(75)}
            style={[styles.tile, power === 75 && styles.tileSelected]}
          >
            <Text style={styles.tileText}>75%</Text>
          </Pressable>
        </View>
        <View style={styles.col}>
          <Pressable
            onPress={() => handleSetPower(50)}
            style={[styles.tile, power === 50 && styles.tileSelected]}
          >
            <Text style={styles.tileText}>50%</Text>
          </Pressable>
          <Pressable
            onPress={() => handleSetPower(100)}
            style={[styles.tile, power === 100 && styles.tileSelected]}
          >
            <Text style={styles.tileText}>100%</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center', padding: 10 },
  grid: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 16,
  },
  col: {
    flex: 1,
    minHeight: 0,
  },
  tile: {
    flex: 1,
    backgroundColor: AppColors.card,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: AppColors.border,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  tileSelected: {
    borderColor: AppColors.selected,
  },
  tileText: {
    color: AppColors.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
});
