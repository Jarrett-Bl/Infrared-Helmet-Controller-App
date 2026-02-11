import { AppColors } from "@/constants/theme";
import Slider from "@react-native-community/slider";
import { StyleSheet, TextInput, View } from "react-native";

export const FREQ_MIN = 0;
export const FREQ_DEFAULT = 10;
export const FREQ_MAX = 140;
export const FREQ_STEP = 10;

type FrequencySliderInputProps = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
};

function snapToStep(val: number, min: number, max: number, step: number): number {
    const clamped = Math.max(min, Math.min(max, val));
    const stepped = Math.round((clamped - min) / step) * step + min;
    return Math.max(min, Math.min(max, stepped));
}

export function FrequencySliderInput({
    value,
    onChange,
    min = FREQ_MIN,
    max = FREQ_MAX,
    step = FREQ_STEP,
}: FrequencySliderInputProps) {
    const handleTextChange = (text: string) => {
        const parsed = Number(text);
        if (!Number.isFinite(parsed)) return;
        const snapped = snapToStep(parsed, min, max, step);
        onChange(snapped);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={String(value)}
                onChangeText={handleTextChange}
                keyboardType="numeric"
                placeholder={`${min} – ${max}`}
                placeholderTextColor="gray"
            />
            <Slider
                style={styles.slider}
                minimumValue={min}
                maximumValue={max}
                step={step}
                value={value}
                onValueChange={(v) => onChange(Math.round(v))}
                minimumTrackTintColor={AppColors.textMuted}
                maximumTrackTintColor={AppColors.border}
                thumbTintColor={AppColors.text}
            />
        </View>
    );
}

export const POWER_MIN = 25;
export const POWER_DEFAULT = 50;
export const POWER_MAX = 100;
export const POWER_STEP = 25;

type PowerSliderInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function PowerSliderInput({
  value,
  onChange,
  min = POWER_MIN,
  max = POWER_MAX,
  step = POWER_STEP,
}: PowerSliderInputProps) {
  const handleTextChange = (text: string) => {
    const parsed = Number(text);
    if (!Number.isFinite(parsed)) return;
    const snapped = snapToStep(parsed, min, max, step);
    onChange(snapped);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={String(value)}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        placeholder={`${min} – ${max} %`}
        placeholderTextColor="gray"
      />
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={(v) => onChange(Math.round(v))}
        minimumTrackTintColor={AppColors.textMuted}
        maximumTrackTintColor={AppColors.border}
        thumbTintColor={AppColors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    input: {
        height: 40,
        marginBottom: 16,
        borderWidth: 1,
        padding: 10,
        backgroundColor: AppColors.button,
        borderRadius: 10,
        color: AppColors.text,
    },
    slider: {
        width: "100%",
        height: 40,
    },
});
