import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { styles } from "../../styles/sharedStyles";

import { AppColors } from "@/constants/theme";
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

function mapDbProtocolsToCards(protocols: DbProtocol[]): ProtocolCard[] {
  const sorted = [...protocols].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

  return sorted.map((p) => {
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
}

export default function ProtocolsPage() {
  const [dbProtocols, setDbProtocols] = useState<DbProtocol[]>([]);
  const [cards, setCards] = useState<ProtocolCard[]>([]);
  const { loadProtocol, deleteProtocol } = useProtocol();

  const refreshProtocols = useCallback(
    async (opts?: { isActive?: () => boolean }) => {
      try {
        const protocols = await getProtocols();
        if (opts?.isActive && !opts.isActive()) return;

        console.log("Protocols in DB on ProtocolsPage focus:", protocols);

        setDbProtocols(protocols);
        setCards(mapDbProtocolsToCards(protocols));
      } catch (e) {
        if (!opts?.isActive || opts.isActive()) {
          console.warn("Failed to load protocols from DB:", e);
        }
      }
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      refreshProtocols({ isActive: () => isActive });

      return () => {
        isActive = false;
      };
    }, [refreshProtocols]),
  );

  const handleDeleteProtocol = useCallback(
    (id: number, name: string) => {
      Alert.alert(
        "Delete protocol",
        `Remove "${name}" from saved protocols? This cannot be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteProtocol(id);
                await refreshProtocols();
              } catch (e) {
                console.warn("Failed to delete protocol:", e);
                Alert.alert(
                  "Error",
                  e instanceof Error ? e.message : "Could not delete protocol.",
                );
              }
            },
          },
        ],
      );
    },
    [deleteProtocol, refreshProtocols],
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
    <Card item={item} onLoad={onLoad} onDelete={handleDeleteProtocol} />
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
  onDelete,
}: {
  item: ProtocolCard;
  onLoad: (p: ProtocolCard) => void;
  onDelete: (id: number, name: string) => void;
}) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 410;
  const protocolId = Number(item.id);

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
          {item.sessionDurationMin ? `${item.sessionDurationMin} min` : ""}
        </Text>

        <ZoneGrid selected={item.activeZones} />

        <ZoneConfigGrid zoneLines={item.zoneLines} />
      </View>

      <View
        style={
          isNarrow
            ? {
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 8,
                alignSelf: "stretch",
              }
            : {
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginLeft: 16,
                alignSelf: "center",
              }
        }
      >
        <TouchableOpacity
          style={[
            styles.loadBtn,
            isNarrow
              ? {
                  flex: 1,
                  marginLeft: 0,
                  marginTop: 0,
                  alignSelf: "stretch",
                  alignItems: "center",
                }
              : { marginLeft: 0 },
          ]}
          onPress={() => onLoad(item)}
          activeOpacity={0.85}
        >
          <Text style={styles.loadBtnText}>Load</Text>
        </TouchableOpacity>

        {item.id ? (
          <Pressable
            onPress={() => onDelete(protocolId, item.name)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Delete protocol"
            testID={`btn-delete-protocol-${item.id}`}
            style={{
              padding: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color={AppColors.statusIdle}
            />
          </Pressable>
        ) : null}
      </View>
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
              styles.zoneOn,
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
