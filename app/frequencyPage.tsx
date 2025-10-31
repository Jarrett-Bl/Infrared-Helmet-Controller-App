import { Link } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function BlueToothConnectionPage1() {
   
    const colors = dark;
    const [text, onChangeText] = React.useState('');
    const [selectedItem, setSelectedItem] = useState(null); 
        
    const handlePress = (itemIdentifier: any) => {
        setSelectedItem(itemIdentifier);
    };

    return (
        <View style={[styles.screen, { backgroundColor: colors.bg }]}>
            <Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>
                Frequency (Hz)
            </Text>
            <StatusBar style={"light"} backgroundColor="#000000" />
            <TextInput multiline={false}
                style={styles.input}
                placeholder="0 - 20,000"
                placeholderTextColor="gray"
                onChangeText={newText => onChangeText(newText)}
                value={text}
            />
            <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
                <TouchableOpacity
                    style={[styles.button, selectedItem === '0' && styles.selectedButton]}
                    onPress={() => handlePress('0')}>
                        <Text style={ styles.buttonLabel }>25%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, selectedItem === '50' && styles.selectedButton]}
                    onPress={() => handlePress('50')}>
                        <Text style={ styles.buttonLabel }>50%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, selectedItem === '75' && styles.selectedButton]}
                    onPress={() => handlePress('75')}>
                        <Text style={ styles.buttonLabel }>75%</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, selectedItem === '100' && styles.selectedButton]}
                    onPress={() => handlePress('100')}>
                        <Text style={ styles.buttonLabel }>100%</Text>
                </TouchableOpacity>
            </SafeAreaView>
            <Link href="/bluetoothDevicePairing" asChild>
                <Button title="Next" />
            </Link>
        </View>
   );
}



const dark = {
    bg: "#0E1418", 
    button:'#2B3640',    
    text: "#E6EDF3",
    primary: "#2196F3",
    buttonText: "#E5E7EB",
    pressed: "#21262D",
};


const styles = StyleSheet.create({
    screen: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "600", textAlign: "center", padding: 10},
    header: { fontSize: 17, fontWeight: "200", textAlign: "center", marginBottom: 220},
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around', 
        alignItems: 'center',
        padding: 10,
        paddingBottom: 320
    },
    button: {
        aspectRatio: 2, 
        height: 150,
        backgroundColor: dark.button,
        borderColor: dark.buttonText,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30, 
        borderRadius: 24
    },
    selectedButton: {
        backgroundColor: 'green',
    },
    buttonLabel: { 
        fontSize: 25, 
        fontWeight: 700,
        color: dark.buttonText
    },
    input: {
        height: 40,
        margin: 80,
        borderWidth: 1,
        padding: 10,
        backgroundColor: dark.button,
        borderRadius: 10,
        color: dark.text
    }
});