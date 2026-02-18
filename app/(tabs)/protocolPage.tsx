import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from "react-native";
import { styles } from "../../styles/sharedStyles";

import { useProtocol } from "../../context/ProtcolStorageContext";
import { getProtocols, type Protocol as DbProtocol } from "../../databaseLib/DB";


type ProtocolCard = {
  id: string;
  name: string;
  timeMin: number;
  timeSec: number;
  powerLevel: number;
  frequencyHz: number;
  sessionDurationMin: number;
  activeZones: number[];
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

          const mapped: ProtocolCard[] = protocols.map((p) => {
            const zoneIds = Object.keys(p.Zones || {}).map(Number);
            const firstZoneId = zoneIds[0];
            const firstCfg =
              firstZoneId != null ? p.Zones[firstZoneId] : undefined;

            return {
              id: String(p.id ?? ""),
              name: p.name,
              timeMin: p.timeMin,
              timeSec: p.timeSec,
              powerLevel: firstCfg?.powerLevel ?? 0,
              frequencyHz: firstCfg?.frequencyHz ?? 0,
              sessionDurationMin: p.timeMin,
              activeZones: zoneIds,
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
    }, [])
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
