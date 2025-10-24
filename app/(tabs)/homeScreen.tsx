//import { NavigationProp } from "@react-navigation/native";
//import { useNavigation } from "expo-router";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function titleScreen() {

    const colors = dark;

    return (
        <SafeAreaView>
            <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>
                IR Helmet Controller
            </Text>
            <Image
                source={require("../../assets/images/helmet-icon.png")}
                style={{ width: 300, height: 300, margin: 60}}
                />
            
            <View style={styles.center}>
                <Pressable
                    onPress={() => router.push("/bluetoothPage1")}
                    style={({ pressed }) => [
                        styles.button,
                        { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
                    ]}
                >
                    <Text style={[styles.buttonLabel, { color: colors.buttonText }]}>
                        Tap Here to Begin
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

const styles = StyleSheet.create({
    screen: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "600", textAlign: "center"},
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