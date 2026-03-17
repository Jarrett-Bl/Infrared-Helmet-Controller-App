import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { styles } from "../../styles/sharedStyles";

import { useProtocol } from "../../context/ProtcolStorageContext";
import {
  getProtocols,
  type Protocol as DbProtocol,
} from "../../databaseLib/DB";

type ZoneLine = {
  zoneId: number;
  powerLevel: number;
  frequencyHz: number;
};

type ProtocolCard = {
  id: string;
  name: string;
  timeMin: number;
  timeSec: number;

  sessionDurationMin: number;
  activeZones: number[];
  zoneLines: ZoneLine[];
};

export default function ProtocolsPage() {
  const [dbProtocols, setDbProtocols] = useState<DbProtocol[]>([]);
  const [cards, setCards] = useState<ProtocolCard[]>([]);
  const { loadProtocol } = useProtocol();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      (async () => {
        try {
          const protocols = await getProtocols();
          if (!isActive) return;

          console.log("Protocols in DB on ProtocolsPage focus:", protocols);

          setDbProtocols(protocols);

          // Force ASC order in case DB query changes later
          const sorted = [...protocols].sort(
            (a, b) => (a.id ?? 0) - (b.id ?? 0),
          );

          const mapped: ProtocolCard[] = sorted.map((p) => {
            const zoneIds = Object.keys(p.Zones || {})
              .map(Number)
              .sort((a, b) => a - b);

            const zoneLines: ZoneLine[] = zoneIds.map((z) => {
              const cfg = p.Zones?.[z];
              return {
                zoneId: z,
                powerLevel: cfg?.powerLevel ?? 0,
                frequencyHz: cfg?.frequencyHz ?? 0,
              };
            });

            return {
              id: String(p.id ?? ""),
              name: p.name,
              timeMin: p.timeMin,
              timeSec: p.timeSec,
              sessionDurationMin: p.timeMin,
              activeZones: zoneIds,
              zoneLines,
            };
          });

          setCards(mapped);
        } catch (e) {
          console.warn("Failed to load protocols from DB:", e);
        }
      })();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const onLoad = (card: ProtocolCard) => {
    const full = dbProtocols.find((p) => String(p.id) === card.id);
    if (!full) {
      console.warn("Protocol not found for id", card.id);
      return;
    }

    loadProtocol(full);
    router.push("/protocolRunPage");
  };

  const renderItem = ({ item }: { item: ProtocolCard }) => (
    <Card item={item} onLoad={onLoad} />
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Protocols</Text>

      <FlatList
        data={cards}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      />

      {cards.length === 0 && (
        <Text style={styles.emptyText}>No protocols saved yet.</Text>
      )}
    </View>
  );
}

function Card({
  item,
  onLoad,
}: {
  item: ProtocolCard;
  onLoad: (p: ProtocolCard) => void;
}) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 410;

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

        {/* Time shown ONCE (outside per-zone configs) */}
        <Text style={styles.cardSub}>
          {item.sessionDurationMin ? `${item.sessionDurationMin} min` : ""}
        </Text>

        {/* Zone on/off grid (visual) */}
        <ZoneGrid selected={item.activeZones} />

        {/* Per-zone power/freq list */}
        <ZoneConfigGrid zoneLines={item.zoneLines} />
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

/**
 * Renders each active zone with its own power/frequency.
 * Uses wrap so it stays compact.
 */
function ZoneConfigGrid({ zoneLines }: { zoneLines: ZoneLine[] }) {
  const { width } = useWindowDimensions();
  const base = 390;
  const scale = Math.max(0.75, Math.min(1.25, width / base));

  const chipPadV = Math.max(8, Math.round(10 * scale));
  const chipPadH = Math.max(10, Math.round(12 * scale));
  const titleSize = Math.max(12, Math.round(13 * scale));
  const subSize = Math.max(11, Math.round(12 * scale));

  if (!zoneLines.length) {
    return (
      <Text style={[styles.cardSub, { marginTop: 6 }]}>
        No zones configured.
      </Text>
    );
  }

  return (
    <View style={{ marginTop: 8 }}>
      <Text style={[styles.cardSub, { marginBottom: 6 }]}>Zone settings:</Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {zoneLines.map((z) => (
          <View
            key={z.zoneId}
            style={[
              styles.zoneCell,
              {
                paddingVertical: chipPadV,
                paddingHorizontal: chipPadH,
                borderRadius: 12,
                marginRight: 8,
                marginBottom: 8,
                alignItems: "flex-start",
              },
              styles.zoneOn, // active zones only in this list
            ]}
          >
            <Text style={[styles.zoneTextOn, { fontSize: titleSize }]}>
              Z{z.zoneId}
            </Text>
            <Text
              style={[styles.zoneTextOn, { fontSize: subSize, opacity: 0.9 }]}
            >
              {z.powerLevel}% • {z.frequencyHz}Hz
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
