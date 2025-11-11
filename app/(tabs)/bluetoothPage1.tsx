import { Link } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import { useState } from 'react';
import { ActivityIndicator, Button, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function BlueToothConnectionPage1() {
   
    const colors = dark;
    const [isLoading, setIsLoading] = useState(false);
    const [text, onChangeText] = useState('Helmet Paired: Not connected');  
        const handlePress = async () => {
        onChangeText('Helmet Paired: Searching')
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsLoading(false);
        onChangeText('Helmet Paired: Connected')
        };


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
                   onPress={handlePress}
                   style={({ pressed }) => [
                       styles.button,
                       { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
                   ]}
                   disabled={isLoading}
               >
                   {isLoading ? (
                       <ActivityIndicator size="large" color="#ffffff" />
                   ) : (
                       <Text style={[styles.buttonLabel, { color: colors.buttonText }]}>
                           Pair Helmet
                       </Text>
                   )}
               </Pressable>
           </View>
           <Text style={[styles.header, { color: colors.text }]}>
              {text}
           </Text>
           <Link href="../bluetoothDevicePairing" asChild>
              <Button title="Next" />
            </Link>
       </SafeAreaView>
   );
}



const dark = {
    bg: "#0F1519",     
    text: "#E5E7EB",
    primary: "#2196F3",
    buttonText: "#E5E7EB",
};

const styles = StyleSheet.create({
    screen: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "600", textAlign: "center"},
    header: { fontSize: 17, fontWeight: "200", textAlign: "center", marginBottom: 220},
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    button: {
        minWidth: 240,
        minHeight: 100,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
      
    },
    buttonLabel: { fontSize: 24, fontWeight: "bold" },
});