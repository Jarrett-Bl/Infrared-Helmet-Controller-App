
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BlueToothConnectionPage2() {
   
    const colors = dark;

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
            <StatusBar style={"light"} backgroundColor="#000000" />

            <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>
               Press start to begin designing protocol 
            </Text>

            <View style={styles.center}>
                <Pressable
                    onPress={() => router.push("/zoneSelection")}
                    style={({ pressed }) => [
                        styles.button,
                        { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
                    ]}
                >
                    <Text style={[styles.buttonLabel, { color: colors.buttonText }]}>
                        Start
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}



const dark = {
    bg: "#000000",     
    text: "#E5E7EB",
    primary: "#3B82F6",
    buttonText: "#0B1220",
};

export const styles = StyleSheet.create({
    screen: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "600" },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    button: {
        minWidth: 240,
        minHeight: 100,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center"
      
    },
    buttonLabel: { fontSize: 24, fontWeight: "bold" },
});
