import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView, StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

const baseColors = {
  dark: { background:'#0D1117', card:'#161B22', text:'#E6EDF3', textMuted:'#8B949E', border:'#30363D', primary:'#58A6FF', rowPressed:'#21262D' },
  light:{ background:'#FFFFFF', card:'#F5F7FA', text:'#0B0F16', textMuted:'#6B7280', border:'#E5E7EB', primary:'#2563EB', rowPressed:'#E5E7EB' },
};
const colorBlindOverrides = { primary:'#EE9900' };

function makeTheme({ theme, colorBlindMode}) {
  const c = { ...(theme === 'dark' ? baseColors.dark : baseColors.light) };
  if (colorBlindMode) c.primary = colorBlindOverrides.primary;
  return c;
}

function makeStyles(themeColors: any, fontScale: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.background },
    header: { paddingHorizontal: 16, paddingVertical: 16 },
    title: { color: themeColors.text, fontSize: 44 * fontScale, fontWeight: 'bold' },
    scrollViewContent: { paddingHorizontal: 16, paddingBottom: 32 },
    sectionHeader: {
      color: themeColors.textMuted, fontSize: 14 * fontScale, fontWeight: '600',
      textTransform: 'uppercase', marginTop: 24, marginBottom: 8,
    },
    card: {
      backgroundColor: themeColors.card, borderRadius: 24, overflow: 'hidden',
      borderWidth: 1, borderColor: themeColors.border,
    },
    row: {
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
      borderBottomWidth: 1, borderBottomColor: themeColors.border,
    },
    rowLabel: { flex: 1, color: themeColors.text, fontSize: 17 * fontScale, marginLeft: 12 },
    rowIcon: { fontSize: 20 * fontScale, width: 24 },
    rowChevron: { color: themeColors.textMuted, fontSize: 30 * fontScale },
    sliderContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingTop: 20, paddingBottom: 20 },
    sliderText: { color: themeColors.textMuted, fontSize: 16 * fontScale, fontWeight: '600' },
    sliderTrack: { flex: 1, height: 10, backgroundColor: themeColors.border, borderRadius: 5, marginHorizontal: 12, justifyContent: 'center' },
    sliderThumb: { width: 40, height: 40, backgroundColor: themeColors.primary, borderRadius: 40 },
  });
}

const SectionHeader = ({ title, s }) => <Text style={s.sectionHeader}>{title}</Text>;

const SettingsRow = ({ label, icon, onPress, s, themeColors }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [s.row, { backgroundColor: pressed ? themeColors.rowPressed : themeColors.card }]}
  >
    <Text style={s.rowIcon}>{icon}</Text>
    <Text style={s.rowLabel}>{label}</Text>
    <Text style={s.rowChevron}>›</Text>
  </Pressable>
);

const SettingsToggle = ({ label, icon, value, onChange, s, themeColors }) => (
  <View style={[s.row, { backgroundColor: themeColors.card }]}>
    <Text style={s.rowIcon}>{icon}</Text>
    <Text style={s.rowLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: '#767577', true: themeColors.primary }}
      thumbColor={'#f4f3f4'}
    />
  </View>
);

const SettingsSlider = ({ label, icon, value, setValue, s, themeColors }) => (
  <View style={[s.row, { backgroundColor: themeColors.card, flexDirection: 'column', alignItems: 'stretch', paddingTop: 16 }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <Text style={s.rowIcon}>{icon}</Text>
      <Text style={s.rowLabel}>{label} ({value.toFixed(2)}x)</Text>
    </View>
    <View style={s.sliderContainer}>
      <Text style={s.sliderText}>A</Text>
      <View style={s.sliderTrack}>
        <Pressable onPress={() => setValue(v => Math.max(0.8, +(v - 0.05).toFixed(2)))} style={[StyleSheet.absoluteFill, { width: '50%' }]} />
        <Pressable onPress={() => setValue(v => Math.min(2.0, +(v + 0.05).toFixed(2)))} style={[StyleSheet.absoluteFill, { left: '50%', width: '50%' }]} />
        <View style={[s.sliderThumb, { transform: [{ translateX: ((value - 0.8) / (2.0 - 0.8)) * 140 - 20 }] }]} />
      </View>
      <Text style={[s.sliderText, { fontSize: 24 * value }]}>A</Text>
    </View>
  </View>
);

export default function SettingsPageMockup() {
  const [theme, setTheme] = React.useState('dark');
  const [fontScale, setFontScale] = React.useState(1.0);
  const [colorBlindMode, setColorBlindMode] = React.useState(false);

  const themeColors = React.useMemo(() => makeTheme({ theme, colorBlindMode }), [theme, colorBlindMode]);
  const s = React.useMemo(() => makeStyles(themeColors, fontScale), [themeColors, fontScale]);

  return (
    <SafeAreaView style={s.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={themeColors.background} />
      <View style={s.header}><Text style={s.title}>Settings</Text></View>

      <ScrollView contentContainerStyle={s.scrollViewContent}>
        <SectionHeader title="Appearance (Local Only)" s={s} />
        <View style={s.card}>
          <SettingsToggle label="Dark Mode (local)" value={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} s={s} themeColors={themeColors} icon={undefined}/>
          <SettingsToggle label="Color-blind Accent (local)" value={colorBlindMode} onChange={setColorBlindMode} s={s} themeColors={themeColors} icon={undefined} />
        </View>

        <SectionHeader title="Accessibility (Local Only)" s={s} />
        <View style={s.card}>
          <SettingsSlider label="Text Size" icon="🇦" value={fontScale} setValue={setFontScale} s={s} themeColors={themeColors} />
        </View>

        <SectionHeader title="About" s={s} />
        <View style={s.card}>
          <SettingsRow label="Privacy Policy" s={s} themeColors={themeColors} icon={undefined} onPress={undefined} />
          <SettingsRow label="Terms of Service" s={s} themeColors={themeColors} icon={undefined} onPress={undefined} />
          <SettingsRow label="App Version" s={s} themeColors={themeColors} icon={undefined} onPress={undefined} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
