import { AppColors } from "@/constants/theme";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useProtocol } from "../../context/ProtcolStorageContext";

type SessionSettings = {
  id: string;
  name: string;
  timeMin: number;
  timeSec: number;
  sessionDurationMin: number;
  activeZones: number[];
};

type ZoneDisplay = {
  zoneId: number;
  isActive: boolean;
  powerLevel: number;
  frequencyHz: number;
};

export default function RunPage() {
  const { protocol, saveProtocol, editingProtocolId } = useProtocol();
  const { width, height } = useWindowDimensions();
  const baseWidth = 390;
  const baseHeight = 844;
  const globalScale = Math.max(
    0.65,
    Math.min(1, Math.min(width / baseWidth, height / baseHeight)),
  );
  const bottomControlsHeight = Math.round(84 * globalScale);
  const bottomOffset = Platform.OS === "android" ? 28 : 16;
  const isEditing = editingProtocolId != null;

  useEffect(() => {
    console.log("RunPage protocol:", JSON.stringify(protocol, null, 2));
  }, [protocol]);

  const helmetValues: SessionSettings = useMemo(() => {
    if (!protocol) {
      return {
        id: "local-default",
        name: "Quick Session",
        timeMin: 15,
        timeSec: 0,
        sessionDurationMin: 15,
        activeZones: [1, 2, 3, 4],
      };
    }

    const zoneIds = Object.keys(protocol.Zones).map((n) => Number(n));

    return {
      id: (protocol.id ?? -1).toString(),
      name: protocol.name,
      timeMin: protocol.timeMin,
      timeSec: protocol.timeSec,
      sessionDurationMin: protocol.timeMin,
      activeZones: zoneIds,
    };
  }, [protocol]);

  const zoneDisplays: ZoneDisplay[] = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const zoneId = i + 1;
      const cfg = protocol?.Zones?.[zoneId];

      return {
        zoneId,
        isActive: !!cfg,
        powerLevel: cfg?.powerLevel ?? 0,
        frequencyHz: cfg?.frequencyHz ?? 0,
      };
    });
  }, [protocol]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initialTotalSeconds = helmetValues.timeMin * 60 + helmetValues.timeSec;
  const [remaining, setRemaining] = useState<number>(initialTotalSeconds);
  const [running, setRunning] = useState<boolean>(false);
  const [stopped, setStopped] = useState<boolean>(false);

  useEffect(() => {
    setRemaining(helmetValues.timeMin * 60 + helmetValues.timeSec);
    setRunning(false);
    setStopped(false);
    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }
  }, [helmetValues.timeMin, helmetValues.timeSec]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current as any);
        timerRef.current = null;
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    if (running) return;
    if (remaining <= 0) return;

    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }
    setRunning(true);
    setStopped(false);

    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current as any);
            timerRef.current = null;
          }
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }, [running, remaining]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }
    setRunning(false);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }
    setRunning(false);
    setRemaining(initialTotalSeconds);
    setStopped(true);
  }, [initialTotalSeconds]);

  const mm = useMemo(() => pad2(Math.floor(remaining / 60)), [remaining]);
  const ss = useMemo(() => pad2(remaining % 60), [remaining]);

  const isComplete = remaining === 0;
  const isAtInitial = remaining === initialTotalSeconds;

  const primaryTitle = running
    ? "Pause"
    : isComplete
      ? "Start"
      : isAtInitial
        ? "Start"
        : "Resume";
  const primaryOnPress = running
    ? pauseTimer
    : isComplete
      ? undefined
      : startTimer;

  let statusText = "";
  let statusDotStyle = s.statusPaused;
  if (isAtInitial && !running) {
    statusDotStyle = s.statusIdle;
    statusText = "Idle";
  } else if (isComplete) {
    statusText = "Complete";
    statusDotStyle = s.statusComplete;
  } else if (running) {
    statusText = "Running";
    statusDotStyle = s.statusRunning;
  } else {
    statusText = "Paused";
    statusDotStyle = s.statusPaused;
  }

  const handleSaveProtocol = useCallback(async () => {
    try {
      const id = await saveProtocol();
      console.log("Protocol saved with id:", id);
      Alert.alert(
        isEditing ? "Updated" : "Saved",
        isEditing
          ? `Protocol ${id} updated successfully.`
          : `Protocol saved with id ${id}`,
      );
    } catch (e) {
      console.error("Failed to save protocol", e);
      Alert.alert(
        "Error",
        isEditing
          ? "Could not update protocol. Please try again."
          : "Could not save protocol. Please try again.",
      );
    }
  }, [saveProtocol, isEditing]);

  return (
    <SafeAreaView style={s.screen}>
      <View style={s.topBar}>
        <Text style={s.title} accessibilityRole="header" testID="hdr-session">
          Your Session
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          { paddingHorizontal: 20, paddingTop: 8 },
          { paddingBottom: bottomControlsHeight + bottomOffset + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Row>
          <InfoCard value={mm} label="Minutes" testID="card-minutes" />
          <InfoCard value={ss} label="Seconds" testID="card-seconds" />
        </Row>

        <View style={s.statusWrap} testID="status-wrap">
          <View style={[s.statusDot, statusDotStyle]} />
          <Text style={s.statusText} testID="status-text">
            {statusText}
          </Text>
        </View>

        <View style={s.zonesWrap}>
          <Text style={s.zonesTitle} testID="lbl-zones">
            Zone Settings
          </Text>

          <ZoneSettingsGrid zones={zoneDisplays} />
        </View>

        <View style={{ marginVertical: 8 * globalScale, width: "100%" }}>
          <Pressable
            onPress={handleSaveProtocol}
            testID="btn-save"
            style={({ pressed }) => [s.saveBtn, pressed && s.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel={
              isEditing ? "Update Protocol" : "Save as Protocol"
            }
            hitSlop={8}
          >
            <Text
              style={[s.saveBtnTxt, { fontSize: Math.round(22 * globalScale) }]}
            >
              {isEditing ? "Update Protocol" : "Save as Protocol"}
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View
        style={[
          s.bottomRowFixed,
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: bottomOffset,
            paddingVertical: Math.round(10 * globalScale),
            paddingHorizontal: Math.round(20 * globalScale),
          },
        ]}
      >
        <PrimaryButton
          title={primaryTitle}
          onPress={primaryOnPress}
          testID="btn-start-pause"
        />
        <SecondaryButton title="Stop" onPress={stopTimer} testID="btn-stop" />
      </View>
    </SafeAreaView>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={s.row}>{children}</View>;
}

function InfoCard({
  value,
  label,
  large,
  testID,
}: {
  value: string | number;
  label: string;
  large?: boolean;
  testID?: string;
}) {
  const { width, height } = useWindowDimensions();
  const baseW = 390;
  const baseH = 844;
  const scale = Math.max(
    0.65,
    Math.min(1, Math.min(width / baseW, height / baseH)),
  );

  return (
    <View
      style={[
        s.card,
        {
          paddingVertical: Math.round(18 * scale),
          paddingHorizontal: Math.round(16 * scale),
        },
      ]}
      testID={testID}
      accessibilityLabel={`${label} card`}
    >
      <Text
        style={[
          s.cardValue,
          large && s.cardValueLg,
          { fontSize: Math.round((large ? 36 : 34) * scale) },
        ]}
      >
        {value}
      </Text>
      <Text style={[s.cardLabel, { fontSize: Math.round(14 * scale) }]}>
        {label}
      </Text>
    </View>
  );
}

function ZoneSettingsGrid({ zones }: { zones: ZoneDisplay[] }) {
  return (
    <View style={s.zoneGrid}>
      {zones.map((zone) => (
        <View
          key={zone.zoneId}
          style={[s.zoneCard, zone.isActive ? s.zoneCardOn : s.zoneCardOff]}
        >
          <Text style={[s.zoneCardTitle, !zone.isActive && s.zoneCardTitleOff]}>
            Zone {zone.zoneId}
          </Text>

          {zone.isActive ? (
            <>
              <Text style={s.zoneCardValue}>{zone.powerLevel}%</Text>
              <Text style={s.zoneCardLabel}>Power</Text>

              <Text style={[s.zoneCardValue, { marginTop: 6 }]}>
                {zone.frequencyHz} Hz
              </Text>
              <Text style={s.zoneCardLabel}>Frequency</Text>
            </>
          ) : (
            <>
              <Text style={s.zoneCardInactive}>Off</Text>
              <Text style={s.zoneCardInactiveSub}>Not selected</Text>
            </>
          )}
        </View>
      ))}
    </View>
  );
}

function PrimaryButton({
  title,
  onPress,
  testID,
  style,
  textStyle,
}: {
  title: string;
  onPress?: () => void;
  testID?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        s.btnPrimary,
        (!onPress || pressed) && s.btnPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
      testID={testID}
      hitSlop={8}
    >
      <Text style={[s.btnPrimaryTxt, textStyle]}>{title}</Text>
    </Pressable>
  );
}

function SecondaryButton({
  title,
  onPress,
  testID,
}: {
  title: string;
  onPress?: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.btnSecondary, pressed && s.btnPressed]}
      accessibilityRole="button"
      accessibilityLabel={title}
      testID={testID}
      hitSlop={8}
    >
      <Text style={s.btnSecondaryTxt}>{title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  topBar: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 26,
    marginBottom: 20,
  },
  title: {
    color: AppColors.text,
    fontSize: 30,
    fontWeight: "800",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 1,
  },
  row: { flexDirection: "row", gap: 18, marginBottom: 14 },
  card: {
    flex: 1,
    backgroundColor: AppColors.card,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    alignItems: "center",
  },
  cardValue: {
    color: AppColors.text,
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },
  cardValueLg: { fontSize: 36 },
  cardLabel: {
    color: AppColors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  zonesWrap: {
    marginTop: 4,
    marginBottom: 12,
    width: "100%",
  },
  zonesTitle: {
    color: AppColors.text,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
    width: "100%",
  },
  zoneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  zoneCard: {
    width: "48%",
    height: 104,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  zoneCardOn: {
    backgroundColor: AppColors.card,
    borderColor: AppColors.zoneBorderOn,
  },
  zoneCardOff: {
    backgroundColor: AppColors.zoneOff,
    borderColor: AppColors.border,
    opacity: 0.82,
  },
  zoneCardTitle: {
    color: AppColors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 1,
    textAlign: "center",
  },
  zoneCardTitleOff: {
    color: AppColors.textMuted,
  },
  zoneCardValue: {
    color: AppColors.text,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 18,
  },
  zoneCardLabel: {
    color: AppColors.textMuted,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 10,
  },
  zoneCardInactive: {
    color: AppColors.textMuted,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 0,
    textAlign: "center",
  },
  zoneCardInactiveSub: {
    color: AppColors.textMuted,
    fontSize: 9,
    fontWeight: "500",
    marginTop: 0,
    textAlign: "center",
  },
  saveBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.primary,
  },
  saveBtnTxt: {
    fontSize: 22,
    color: AppColors.text,
    fontWeight: "900",
  },
  statusWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AppColors.zoneBorder,
  },
  statusRunning: { backgroundColor: AppColors.statusRunning },
  statusIdle: { backgroundColor: AppColors.statusIdle },
  statusPaused: { backgroundColor: AppColors.statusPaused },
  statusComplete: { backgroundColor: AppColors.button },
  statusText: {
    color: AppColors.textMuted,
    fontSize: 16,
    fontWeight: "700",
  },
  bottomRowFixed: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 28,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: AppColors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: AppColors.button,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryTxt: {
    color: AppColors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  btnSecondaryTxt: {
    color: AppColors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  btnPressed: {
    opacity: 0.9,
    backgroundColor: AppColors.primaryPressed,
  },
});

function pad2(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}
