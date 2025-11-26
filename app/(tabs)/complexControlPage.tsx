import HomeButton from '@/components/ui/HomeButton';
import { Link, useLocalSearchParams } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function ComplexControlPage() {
   
    const colors = dark;
    const zoneGroup  = useLocalSearchParams();
    const [selectedItemPower, setSelectedItemPower] = useState(null); 
    const [text, onChangeText] = React.useState('');
    const [selectedItemFreq, setSelectedItemFreq] = useState(null); 
       
    const handlePressPower = (itemIdentifier: any) => {
        setSelectedItemPower(itemIdentifier);
        console.log(zoneGroup)
    };
    
    const handlePressFreq = (itemIdentifier: any) => {
        setSelectedItemFreq(itemIdentifier);
      };

    return (
        <View style={[styles.screen, { backgroundColor: colors.bg }]}>
            <Text style={[styles.title, { color: zoneGroup ? String(zoneGroup.zoneGroup) : colors.text, marginTop: 16 }]}>
                Power Level
            </Text>
            <HomeButton/>
            <StatusBar style={"light"} backgroundColor="#000000" />
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                <TouchableOpacity
                    style={[styles.button, selectedItemPower === '0' && styles.selectedButton]}
                    onPress={() => handlePressPower('0')}>
                        <Text style={ styles.buttonLabel }>25%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, selectedItemPower === '50' && styles.selectedButton]}
                    onPress={() => handlePressPower('50')}>
                        <Text style={ styles.buttonLabel }>50%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, selectedItemPower === '75' && styles.selectedButton]}
                    onPress={() => handlePressPower('75')}>
                        <Text style={ styles.buttonLabel }>75%</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, selectedItemPower === '100' && styles.selectedButton]}
                    onPress={() => handlePressPower('100')}>
                        <Text style={ styles.buttonLabel }>100%</Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.title, { color: zoneGroup ? String(zoneGroup.zoneGroup) : colors.text }]}>
                Frequency (Hz)
            </Text>
            <TextInput multiline={false}
                style={styles.input}
                placeholder="0 - 20,000"
                placeholderTextColor="gray"
                onChangeText={newText => onChangeText(newText)}
                value={text}
            />
            <View style={[styles.container, { backgroundColor: colors.bg }]}>
                <TouchableOpacity
                    style={[styles.button, selectedItemFreq === '0' && styles.selectedButton]}
                    onPress={() => handlePressFreq('0')}>
                        <Text style={ styles.buttonLabel }>25%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, selectedItemFreq === '50' && styles.selectedButton]}
                    onPress={() => handlePressFreq('50')}>
                        <Text style={ styles.buttonLabel }>50%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, selectedItemFreq === '75' && styles.selectedButton]}
                    onPress={() => handlePressFreq('75')}>
                        <Text style={ styles.buttonLabel }>75%</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, selectedItemFreq === '100' && styles.selectedButton]}
                    onPress={() => handlePressFreq('100')}>
                        <Text style={ styles.buttonLabel }>100%</Text>
                </TouchableOpacity>
            </View>
            <Link href="/complexZoneSelection" asChild>
                <Button title="Back" />
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
    header: { fontSize: 17, fontWeight: "200", textAlign: "center", marginBottom: 20},
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around', 
        alignItems: 'center',
        padding: 10,
        paddingBottom: 20
    },
    button: {
        aspectRatio: 2, 
        height: 150,
        backgroundColor: dark.button,
        borderColor: dark.buttonText,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20, 
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