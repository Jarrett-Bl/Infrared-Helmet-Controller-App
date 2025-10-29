// protocolPage.tsx
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";

// Data structure for a protocol
type Protocol = {
  id: string;
  name: string;
  timeMin: number;
  timeSec: number;
  powerLevel: number;
  frequencyHz: number;
  sessionDurationMin: number;
  activeZones: number[];
};

// Protocols - with sample data for now
const protocolsList: Protocol[] = [
  { id: "1", name: "Memory Boost", timeMin: 30, timeSec: 0, powerLevel: 50, frequencyHz: 10, sessionDurationMin: 15, activeZones: [1,2,3,4] },
  { id: "2", name: "Relaxation", timeMin: 30, timeSec: 0, powerLevel: 35, frequencyHz: 8,  sessionDurationMin: 20, activeZones: [5,6,7] },
  { id: "3", name: "Energy Uplift", timeMin: 30, timeSec: 0, powerLevel: 60, frequencyHz: 12, sessionDurationMin: 10, activeZones: [2,8,9,10] },
  { id: "4", name: "Deep Focus", timeMin: 30, timeSec: 0, powerLevel: 55, frequencyHz: 9,  sessionDurationMin: 25, activeZones: [1,3,11,12] },
];

export default function ProtocolsPage() {
    const [query, setQuery] = useState(""); // Search query state

    // Filter protocols based on search query
    const filteredProtocols = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return protocolsList; //query empty

        return protocolsList.filter((p) => {
            const inName = p.name.toLowerCase().includes(q);
            const inId = p.id.toLowerCase().includes(q);
            return inName || inId;
        });
    }, [query]);

    //Set up load button will add functionality later
    const onLoad = (p: Protocol) => {
        router.push("../protocolRunPage");
    };

    // Rendering each protocol card in the list
    const renderItem = ({ item }: { item: Protocol }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>Protocol {item.id}: {item.name}</Text>
        <Text style={styles.cardSub}>
          Power: {item.powerLevel}%  •  {item.frequencyHz}Hz
          {item.sessionDurationMin ? `  •  ${item.sessionDurationMin} min` : ""}
        </Text>
        <ZoneGrid selected={item.activeZones} />
      </View>
      <TouchableOpacity style={styles.loadBtn} onPress={() => onLoad(item)} activeOpacity={0.85}>
        <Text style={styles.loadBtnText}>Load</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Protocols</Text>

      <TextInput
        placeholder="⌕ Search by name or id"
        placeholderTextColor="#9AA1A9"
        value={query}
        onChangeText={setQuery}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      <FlatList
        data={filteredProtocols}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      />

      {filteredProtocols.length === 0 && (
        <Text style={styles.emptyText}>No protocols match “{query}”.</Text>
      )}
    </View>
  );
}

// Grid to show the active zones on each protocol card
function ZoneGrid({ selected }: { selected: number[] }) {
  const { width } = useWindowDimensions();
  const base = 390;
  const scale = Math.max(0.75, Math.min(1.25, width / base));
  const size = Math.max(20, Math.min(48, Math.round(32 * scale)));
  return (
    <View style={[styles.zoneGrid, { flexWrap: "wrap" }]}> 
      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
        const on = selected.includes(n);
        return (
          <View key={n} style={[styles.zoneCell, { width: size, height: size, borderRadius: Math.round(size * 0.25) }, on ? styles.zoneOn : styles.zoneOff]}>
            <Text style={on ? [styles.zoneTextOn, { fontSize: Math.round(13 * scale) }] : [styles.zoneTextOff, { fontSize: Math.round(13 * scale) }]}>{n}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0E1418", paddingHorizontal: 20, paddingTop: 24 },
  title: { color: "white", fontSize: 26, fontWeight: "800", textAlign: "center", marginBottom: 16 },
  searchInput: {
    backgroundColor: "#252D34", color: "white", paddingHorizontal: 16, paddingVertical: 22,
    borderRadius: 14, fontSize: 40, marginBottom: 14,
  },
  card: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#151B20",
    borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#22303A",
  },
  cardTitle: { color: "white", fontSize: 28, fontWeight: "700", marginBottom: 6 },
  cardSub: { color: "#AEB7BF", fontSize: 18, marginBottom: 10 },
  zoneGrid: { flexDirection: "row", flexWrap: "nowrap", gap: 8, maxWidth: 260 },
  zoneCell: {
    width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", borderWidth: 1,
  },
  zoneOn: { backgroundColor: "#009520ff", borderColor: "#3C4A56" },
  zoneOff: { backgroundColor: "#0F1519", borderColor: "#1E2A33" },
  zoneTextOn: { color: "white", fontWeight: "700", fontSize: 13 },
  zoneTextOff: { color: "#6C7A86", fontWeight: "600", fontSize: 13 },
  loadBtn: { backgroundColor: "#2B3640", paddingHorizontal: 62, paddingVertical: 42, borderRadius: 34, marginLeft: 22 },
  loadBtnText: { color: "white", fontSize: 22, fontWeight: "700" },
  emptyText: { color: "#8B97A1", textAlign: "center", marginTop: 16, fontSize: 14 },
});