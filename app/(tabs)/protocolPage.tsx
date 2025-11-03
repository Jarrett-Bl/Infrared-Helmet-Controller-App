// protocolPage.tsx
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import { styles } from "../../styles/sharedStyles";


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
    if (!q) return protocolsList; // query empty
    return protocolsList.filter((p) => {
      const inName = p.name.toLowerCase().includes(q);
      const inId = p.id.toLowerCase().includes(q);
      return inName || inId;
    });
  }, [query]);

  // Set up load button will add functionality later
  const onLoad = (p: Protocol) => {
    router.push("../protocolRunPage");
  };

  // Rendering each protocol card in the list
  const renderItem = ({ item }: { item: Protocol }) => (
    <Card item={item} onLoad={onLoad} />
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

function Card({
  item,
  onLoad,
}: {
  item: Protocol;
  onLoad: (p: Protocol) => void;
}) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 410; // magic number currently Changeable

  return (
    <View
      style={[
        styles.card,
        isNarrow ? styles.cardColumn : styles.cardRow,
        Platform.select({
          android: styles.cardElevated, 
          ios: undefined,
        }),
      ]}
    >
      <View style={[styles.cardBody, isNarrow && { marginBottom: 12 }]}>
        <Text style={styles.cardTitle}>
          Protocol {item.id}: {item.name}
        </Text>
        <Text style={styles.cardSub}>
          Power: {item.powerLevel}%  •  {item.frequencyHz}Hz
          {item.sessionDurationMin ? `  •  ${item.sessionDurationMin} min` : ""}
        </Text>
        <ZoneGrid selected={item.activeZones} />
      </View>

      <TouchableOpacity
        style={[styles.loadBtn, isNarrow && styles.loadBtnFull]}
        onPress={() => onLoad(item)}
        activeOpacity={0.85}
      >
        <Text style={styles.loadBtnText}>Load</Text>
      </TouchableOpacity>
    </View>
  );
}

// Grid to show the active zones on each protocol card
function ZoneGrid({ selected }: { selected: number[] }) {
  const { width } = useWindowDimensions();
  const base = 390;
  const scale = Math.max(0.75, Math.min(1.25, width / base));
  const size = Math.max(22, Math.min(46, Math.round(32 * scale)));
  const cellStyle = {
    width: size,
    height: size,
    borderRadius: Math.round(size * 0.25),
    marginRight: 8,
    marginBottom: 8,
  } as const;

  return (
    <View style={styles.zoneGrid}>
      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
        const on = selected.includes(n);
        return (
          <View
            key={n}
            style={[
              styles.zoneCell,
              cellStyle,
              on ? styles.zoneOn : styles.zoneOff,
            ]}
          >
            <Text
              style={
                on
                  ? [styles.zoneTextOn, { fontSize: Math.round(13 * scale) }]
                  : [styles.zoneTextOff, { fontSize: Math.round(13 * scale) }]
              }
            >
              {n}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

