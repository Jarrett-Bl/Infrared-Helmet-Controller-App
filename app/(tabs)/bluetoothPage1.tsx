//import { NavigationProp } from "@react-navigation/native";
//import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BluetoothConnectionPage1() {
   
    const colors = dark;

    return (
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.bg }]}>
            <StatusBar style={"light"} backgroundColor="#000000" />

            <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>
               Pair your device
            </Text>
            <Text style={[styles.header, { color: colors.text, marginTop: 30 }]}>
               To begin, ensure your device is turned on and within range.
            </Text>
            <View style={styles.center}>
                <Pressable
                    onPress={() => console.log("pair button pressed")}
                    style={({ pressed }) => [
                        styles.button,
                        { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
                    ]}
                >
                    <Text style={[styles.buttonLabel, { color: colors.buttonText }]}>
                        Pair Helmet
                    </Text>
                </Pressable>
            </View>
            <Text style={[styles.header, { color: colors.text }]}>
               Helmet Paired: Not connected
            </Text>
        </SafeAreaView>
    );
}



const dark = {
    bg: "#000000",     
    text: "#E5E7EB",
    primary: "#3B82F6",
    buttonText: "#0B1220",
};

const styles = StyleSheet.create({
    screen: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "600", textAlign: "center"},
    header: { fontSize: 17, fontWeight: "200", textAlign: "center"},
    subheader: { fontSize: 10, fontWeight: "100", textAlign: "center"},
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
