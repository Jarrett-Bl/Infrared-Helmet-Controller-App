import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { styles } from "../../styles/sharedStyles";

import {
  ProtocolJsonImportButton,
  shareProtocolJsonFile,
} from "@/components/protocolJsonTransfer";
import { AppColors } from "@/constants/theme";
import { renameProtocolSaving } from "@/lib/protocolRename";
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
  const { loadProtocol, deleteProtocol, startEditingProtocol } = useProtocol();

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

  const handleRenameProtocol = useCallback(
    async (id: number, protocol: DbProtocol, newName: string) => {
      const ok = await renameProtocolSaving(id, protocol, newName);
      if (ok) await refreshProtocols();
      return ok;
    },
    [refreshProtocols],
  );

  const onEdit = (card: ProtocolCard) => {
    const full = dbProtocols.find((p) => String(p.id) === card.id);
    if (!full) {
      console.warn("Protocol not found for id", card.id);
      return;
    }

    startEditingProtocol(full);

    if (full.editorType === "simple") {
      router.push("/zoneSelection");
    } else {
      router.push("/complexZoneSelection");
    }
  };

  const onLoad = (card: ProtocolCard) => {
    const full = dbProtocols.find((p) => String(p.id) === card.id);
    if (!full) {
      console.warn("Protocol not found for id", card.id);
      return;
    }

    loadProtocol(full);
    router.push("/protocolRunPage");
  };

  const renderItem = ({ item }: { item: ProtocolCard }) => {
    const full = dbProtocols.find((p) => String(p.id) === item.id);
    return (
      <Card
        item={item}
        protocolForExport={full}
        onLoad={onLoad}
        onEdit={onEdit}
        onDelete={handleDeleteProtocol}
        onRename={handleRenameProtocol}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View style={{ minWidth: 44 }} />
        <Text style={[styles.title, { flex: 1, marginBottom: 0 }]}>
          Protocols
        </Text>
        <ProtocolJsonImportButton onImported={() => refreshProtocols()} />
      </View>

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

const OVERFLOW_MENU_WIDTH = 216;
const OVERFLOW_MENU_EST_HEIGHT = 220;

function Card({
  item,
  protocolForExport,
  onLoad,
  onEdit,
  onDelete,
  onRename,
}: {
  item: ProtocolCard;
  protocolForExport?: DbProtocol;
  onLoad: (p: ProtocolCard) => void;
  onEdit: (p: ProtocolCard) => void;
  onDelete: (id: number, name: string) => void;
  onRename: (
    id: number,
    protocol: DbProtocol,
    newName: string,
  ) => boolean | Promise<boolean>;
}) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isNarrow = windowWidth < 410;
  const protocolId = Number(item.id);

  const overflowAnchorRef = useRef<View>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0 });
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameDraft, setRenameDraft] = useState("");

  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const openOverflowMenu = useCallback(() => {
    overflowAnchorRef.current?.measureInWindow((x, y, w, h) => {
      const rightAlignedLeft = Math.max(
        8,
        Math.min(x + w - OVERFLOW_MENU_WIDTH, windowWidth - OVERFLOW_MENU_WIDTH - 8),
      );
      let top = y + h + 4;
      if (top + OVERFLOW_MENU_EST_HEIGHT > windowHeight - 8) {
        top = Math.max(8, y - OVERFLOW_MENU_EST_HEIGHT - 4);
      }
      setMenuPos({ left: rightAlignedLeft, top });
      setMenuVisible(true);
    });
  }, [windowWidth, windowHeight]);

  const openRenameModal = useCallback(() => {
    if (!protocolForExport) return;
    setRenameDraft(protocolForExport.name);
    setRenameModalVisible(true);
  }, [protocolForExport]);

  const submitRename = useCallback(async () => {
    if (!protocolForExport) return;
    const ok = await onRename(protocolId, protocolForExport, renameDraft);
    if (ok) setRenameModalVisible(false);
  }, [renameDraft, protocolForExport, protocolId, onRename]);

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
          <View ref={overflowAnchorRef} collapsable={false}>
            <Pressable
              onPress={openOverflowMenu}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="More actions for protocol"
              testID={`btn-protocol-overflow-${item.id}`}
              style={{
                padding: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={22}
                color={AppColors.statusIdle}
              />
            </Pressable>
          </View>
        ) : null}
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <View style={StyleSheet.absoluteFillObject}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={closeMenu}
            accessibilityLabel="Dismiss menu"
          />
          <View
            style={[
              overflowMenuStyles.panel,
              {
                left: menuPos.left,
                top: menuPos.top,
                width: OVERFLOW_MENU_WIDTH,
              },
            ]}
          >
            <Pressable
              testID={`btn-edit-protocol-${item.id}`}
              accessibilityRole="button"
              accessibilityLabel="Edit protocol"
              style={overflowMenuStyles.row}
              onPress={() => {
                closeMenu();
                onEdit(item);
              }}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={AppColors.statusIdle}
              />
              <Text style={overflowMenuStyles.rowLabel}>Edit</Text>
            </Pressable>

            {protocolForExport ? (
              <Pressable
                testID={`btn-rename-protocol-${item.id}`}
                accessibilityRole="button"
                accessibilityLabel="Rename protocol"
                style={overflowMenuStyles.row}
                onPress={() => {
                  closeMenu();
                  openRenameModal();
                }}
              >
                <Ionicons
                  name="pencil-outline"
                  size={22}
                  color={AppColors.statusIdle}
                />
                <Text style={overflowMenuStyles.rowLabel}>Rename</Text>
              </Pressable>
            ) : null}

            {protocolForExport ? (
              <Pressable
                testID={`btn-export-protocol-json-${protocolForExport.id ?? "new"}`}
                accessibilityRole="button"
                accessibilityLabel="Export protocol to JSON"
                style={overflowMenuStyles.row}
                onPress={() => {
                  closeMenu();
                  void shareProtocolJsonFile(protocolForExport);
                }}
              >
                <Ionicons
                  name="share-outline"
                  size={22}
                  color={AppColors.statusIdle}
                />
                <Text style={overflowMenuStyles.rowLabel}>Export</Text>
              </Pressable>
            ) : null}

            <Pressable
              testID={`btn-delete-protocol-${item.id}`}
              accessibilityRole="button"
              accessibilityLabel="Delete protocol"
              style={overflowMenuStyles.row}
              onPress={() => {
                closeMenu();
                onDelete(protocolId, item.name);
              }}
            >
              <Ionicons
                name="trash-outline"
                size={22}
                color={AppColors.statusIdle}
              />
              <Text
                style={[overflowMenuStyles.rowLabel, overflowMenuStyles.destructiveLabel]}
              >
                Delete
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={renameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRenameModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={renameModalStyles.keyboardRoot}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={renameModalStyles.centerWrap}>
            <Pressable
              style={renameModalStyles.backdrop}
              onPress={() => setRenameModalVisible(false)}
              accessibilityLabel="Dismiss rename"
            />
            <View style={renameModalStyles.sheet} accessibilityViewIsModal>
              <Text style={renameModalStyles.sheetTitle}>Rename protocol</Text>
              <TextInput
                value={renameDraft}
                onChangeText={setRenameDraft}
                placeholder="Protocol name"
                placeholderTextColor={AppColors.textMuted}
                autoFocus
                selectTextOnFocus
                style={renameModalStyles.input}
                autoCorrect={false}
                accessibilityLabel="New protocol name"
              />
              <View style={renameModalStyles.sheetActions}>
                <Pressable
                  onPress={() => setRenameModalVisible(false)}
                  style={renameModalStyles.sheetBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel rename"
                >
                  <Text style={renameModalStyles.sheetBtnTextMuted}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => void submitRename()}
                  style={renameModalStyles.sheetBtnPrimary}
                  accessibilityRole="button"
                  accessibilityLabel="Save protocol name"
                >
                  <Text style={renameModalStyles.sheetBtnTextPrimary}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const renameModalStyles = StyleSheet.create({
  keyboardRoot: {
    flex: 1,
  },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    zIndex: 1,
    borderRadius: 14,
    padding: 20,
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
    ...Platform.select({
      android: { elevation: 12 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      default: {},
    }),
  },
  sheetTitle: {
    color: AppColors.text,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: AppColors.text,
    backgroundColor: AppColors.button,
    marginBottom: 18,
  },
  sheetActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  sheetBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  sheetBtnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
  },
  sheetBtnTextMuted: {
    color: AppColors.textMuted,
    fontSize: 16,
    fontWeight: "500",
  },
  sheetBtnTextPrimary: {
    color: AppColors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});

const overflowMenuStyles = StyleSheet.create({
  panel: {
    position: "absolute",
    backgroundColor: AppColors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    paddingVertical: 4,
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      default: {},
    }),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  rowLabel: {
    color: AppColors.text,
    fontSize: 16,
  },
  destructiveLabel: {
    color: AppColors.statusIdle,
  },
});

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
