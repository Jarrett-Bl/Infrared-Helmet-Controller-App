import Slider from "@react-native-community/slider";
import { StyleSheet, TextInput, View } from "react-native";

export const FREQ_MIN = 5;
export const FREQ_MAX = 25;
export const FREQ_STEP = 5;

const dark = {
    button: "#2B3640",
    text: "#E6EDF3",
};

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
                minimumTrackTintColor="#AEB7BF"
                maximumTrackTintColor="#22303A"
                thumbTintColor="#FFFFFF"
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
        backgroundColor: dark.button,
        borderRadius: 10,
        color: dark.text,
    },
    slider: {
        width: "100%",
        height: 40,
    },
});
