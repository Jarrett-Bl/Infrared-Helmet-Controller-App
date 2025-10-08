


import React, { createContext, userState, useState, ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from "react-native"; // Import ScrollView and Switch
import { StatusBar } from "expo-status-bar";

interface TextSizeContextType {fontSize: number;
    setFontSize: (size: number) => void;
    };


const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined);
export const TextSizeProvider = ({ children }: { children: ReactNode}) => {
    const [fontSize, setFontSize] = useState(16);

    return (
        <TextSizeContext.Provider value= {{ fontSize, setFontSize}}>
        {children}
        </TextSizeContext.Provider>
        );

};

export const useTextSize = () => {
    const context = useContext(TextSizeContext);
    if(context == undefined) {
        throw new Error("TextSize invalid")}
    return context;
    }

const colors = {
    bg: "#0B1220",
    text: "#E5E7EB",
    textMuted: "#9CA3AF",
    primary: "#3B82F6",
    rowBg: "#1F2937",
    rowPressed: "#374151",
};

const SettingsRow = ({ label, onPress }) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.settingsRow,
            { backgroundColor: pressed ? colors.rowPressed : colors.rowBg }
        ]}
    >
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>›</Text>
    </Pressable>
);

const SettingsToggle = ({ label, value, onValueChange }) => (
    <View style={styles.settingsRow}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={"#f4f3f4"}
        />
    </View>
);

const SectionHeader = ({ title }) => (
    <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>{title}</Text>
);

// Main Screen
export default function Settings_Page() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar style={"light"} backgroundColor={colors.bg} />
            <Text style={[styles.title, { color: colors.text }]}>
                Settings
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* --- General Settings Section --- */}
                <SectionHeader title="Text Size" />
                <SettingsToggle
                    label="Text Size"
                    value={isDarkMode}
                    onValueChange={setIsDarkMode}
                />
                <SettingsRow
                    label="Notifications"
                    onPress={() => console.log("Navigate to Notifications screen")}
                />

                {/* --- Device Settings Section --- */}
                <SectionHeader title="Device" />
                <SettingsRow
                    label="Device Information"
                    onPress={() => console.log("Navigate to Device Info screen")}
                />
                <SettingsRow
                    label="Check for Updates"
                    onPress={() => console.log("Checking for updates...")}
                />
                <SettingsRow
                    label="Disconnect Helmet"
                    onPress={() => console.log("Disconnecting...")}
                />

                 {/* --- About Section --- */}
                 <SectionHeader title="About" />
                 <SettingsRow
                    label="Privacy Policy"
                    onPress={() => console.log("Navigate to Privacy Policy")}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: 16,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: "600",
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 12,
        textTransform: 'uppercase',
    },
    settingsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.rowBg,
        paddingHorizontal: 16,
        minHeight: 50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#374151",
    },
    rowLabel: {
        fontSize: 17,
        color: colors.text,
    },
});
