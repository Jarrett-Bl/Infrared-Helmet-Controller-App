import { View, Text, StyleSheet } from "react-native";

export default function BlueToothConnectionPage2() {
    return (
        <View style={styles.textStyle}>
            <Text >BlueToothConnectionPage2 Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    textStyle: { flex: 1, alignItems: "flex-start", justifyContent: "flex-start", padding: 16 },
});