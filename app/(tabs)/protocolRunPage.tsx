import { AppColors } from '@/constants/theme';
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useProtocol } from "../../context/ProtcolStorageContext";

// Data structure for protocol settings - built through previous selection screens
type protocolSettings = {
  id: string;
  name: string;
  timeMin: number;
  timeSec: number;
  powerLevel: number;
  frequencyHz: number;
  sessionDurationMin: number;
  activeZones: number[];
};


export type RunSessionScreenProps = {
  helmetValues: protocolSettings;

  onSaveProtocol?: () => void;
  onStart?: () => void;
  onStop?: () => void;

  // Styling
  contentStyle?: ViewStyle;
};

export default function RunSessionScreen() {
  const { protocol } = useProtocol();
  const { width } = useWindowDimensions();
  const base = 390;
  const scale = Math.max(0.8, Math.min(1.25, width / base));
  const bottomControlsHeight = Math.round(84 * scale);
  const bottomOffset = Platform.OS === "android" ? 28 : 16;

  // log for sanity
  useEffect(() => {
    console.log("ProtocolRunPage protocol:", JSON.stringify(protocol, null, 2));
  }, [protocol]);

  // Build helmetValues from context protocol (fallback if none)
  const helmetValues: protocolSettings = useMemo(() => {
    if (!protocol) {
      // Fallback if something navigates here without a selected protocol
      return {
        id: "local-default",
        name: "Quick Session",
        timeMin: 15,
        timeSec: 0,
        powerLevel: 50,
        frequencyHz: 10,
        sessionDurationMin: 15,
        activeZones: [1, 2, 3, 4],
      };
    }

    const zoneIds = Object.keys(protocol.Zones || {}).map((n) => Number(n));
    const firstZoneId = zoneIds[0] ?? 1;
    const firstZoneCfg = protocol.Zones[firstZoneId];

    return {
      id: (protocol.id ?? -1).toString(),
      name: protocol.name,
      timeMin: protocol.timeMin,
      timeSec: protocol.timeSec,
      powerLevel: firstZoneCfg?.powerLevel ?? 0,
      frequencyHz: firstZoneCfg?.frequencyHz ?? 0,
      sessionDurationMin: protocol.timeMin,
      activeZones: zoneIds,
    };
  }, [protocol]);

  /** Timer + countdown logic */
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initialTotalSeconds = useMemo(
    () => helmetValues.timeMin * 60 + helmetValues.timeSec,
    [helmetValues.timeMin, helmetValues.timeSec]
  );

  const [remaining, setRemaining] = useState<number>(initialTotalSeconds);
  const [running, setRunning] = useState<boolean>(false);
  const [stopped, setStopped] = useState<boolean>(false);

  // Reset timer when helmetValues change (i.e. a different protocol selected)
  useEffect(() => {
    setRemaining(initialTotalSeconds);
    setRunning(false);
    setStopped(false);
    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }
  }, [initialTotalSeconds]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current as any);
        timerRef.current = null;
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    if (running) return; // already running
    if (remaining <= 0) return; // nothing to start

    // clear any stray timer
    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }

    setRunning(true);
    setStopped(false);

    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          // stop at zero
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

  // Pause timer logic
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }
    setRunning(false);
  }, []);

  // Stop timer logic
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current as any);
      timerRef.current = null;
    }
    setRunning(false);
    setRemaining(initialTotalSeconds);
    setStopped(true);
  }, [initialTotalSeconds]);

  /** Derived labels for formatting time and hz */
  const mm = useMemo(() => pad2(Math.floor(remaining / 60)), [remaining]);
  const ss = useMemo(() => pad2(remaining % 60), [remaining]);
  const freqLabel = useMemo(
    () => `${helmetValues.frequencyHz} Hz`,
    [helmetValues.frequencyHz]
  );

  // UX helpers
  const isComplete = remaining === 0;
  const isAtInitial = remaining === initialTotalSeconds;

  const primaryTitle = running
    ? "Pause"
    : isComplete
      ? "Start"
      : isAtInitial
        ? "Start"
        : "Resume";
  const primaryOnPress = running ? pauseTimer : isComplete ? undefined : startTimer;

  // Compute status
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

  return (
    <SafeAreaView style={s.screen}>
      {/* Header*/}
      <View style={s.topBar}>
        <Pressable
          onPress={() => router.push("/protocolPage")}
          style={[s.iconBtn, { zIndex: 10 }]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to protocols"
        >
          <Text style={s.iconTxt}>‹</Text>
        </Pressable>

        <Text
          style={s.title}
          accessibilityRole="header"
          testID="hdr-session"
        >
          {helmetValues.name}
        </Text>

        
      </View>

      <View
        style={[
          s.content,
          { paddingBottom: bottomControlsHeight + bottomOffset + 12 },
        ]}
      >
        {/* Time */}
        <Row>
          <InfoCard value={mm} label="Minutes" testID="card-minutes" />
          <InfoCard value={ss} label="Seconds" testID="card-seconds" />
        </Row>

        {/* Status indicator */}
        <View style={s.statusWrap} testID="status-wrap">
          <View style={[s.statusDot, statusDotStyle]} />
          <Text style={s.statusText} testID="status-text">
            {statusText}
          </Text>
        </View>

        {/* Power & Frequency */}
        <Row>
          <InfoCard
            value={helmetValues.powerLevel}
            label="Power Level"
            large
            testID="card-power"
          />
          <InfoCard
            value={freqLabel}
            label="Frequency"
            large
            testID="card-frequency"
          />
        </Row>

        {/* Zones */}
        <View style={s.zonesWrap}>
          <Text style={s.zonesTitle} testID="lbl-zones">
            Zones Enabled
          </Text>
          <ZoneSquares
            active={helmetValues.activeZones}
            showNumbers
            testID="zones-grid"
          />
        </View>

        {/* Bottom controls */}
        <View
          style={[
            s.bottomRow,
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: bottomOffset,
              paddingHorizontal: Math.round(20 * scale),
              paddingVertical: Math.round(10 * scale),
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
  const { width } = useWindowDimensions();
  const base = 390;
  const scale = Math.max(0.8, Math.min(1.25, width / base));
  return (
    <View style={s.card} testID={testID} accessibilityLabel={`${label} card`}>
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

/* 12 squares, green when active */
function ZoneSquares({
  active,
  showNumbers = true,
  style,
  testID,
}: {
  active: number[];
  showNumbers?: boolean;
  style?: ViewStyle;
  testID?: string;
}) {
  const { width } = useWindowDimensions();
  const baseWidth = 390;
  const scale = Math.max(0.75, Math.min(1.25, width / baseWidth));
  const horizontalPadding = 56;
  const availableWidth = Math.max(180, width - horizontalPadding);
  const columns = Math.min(4, Math.max(2, Math.floor(availableWidth / 80)));
  const gap = Math.round(8 * scale);
  const rawSZ = Math.floor((availableWidth - gap * (columns - 1)) / columns);
  const minSZ = 44;
  const maxSZ = 80;
  const SZ = Math.max(minSZ, Math.min(maxSZ, rawSZ));

  const numStyle = { fontSize: Math.round(12 * scale) };

  return (
    <View
      style={[s.zoneWrap, { justifyContent: "center", flexWrap: "wrap" }, style]}
      testID={testID}
      accessibilityLabel="Zone squares"
    >
      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
        const isOn = active.includes(n);
        const boxStyle = [
          s.zoneBox,
          { width: SZ, height: SZ, borderRadius: Math.round(SZ * 0.25) },
          isOn ? s.zoneOn : s.zoneOff,
        ];

        return (
          <View key={n} style={{ marginRight: gap, marginBottom: gap }}>
            <View style={boxStyle} testID={`zone-${n}`}>
              {showNumbers && (
                <Text
                  style={
                    isOn ? [s.zoneNumOn, numStyle] : [s.zoneNumOff, numStyle]
                  }
                >
                  {n}
                </Text>
              )}
            </View>
          </View>
        );
      })}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 42,
    marginBottom: 18,
    position: "relative",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTxt: { color: AppColors.text, fontSize: 20, fontWeight: "800", opacity: 0.9 },
  title: {
    color: AppColors.text,
    fontSize: 24,
    fontWeight: "800",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 1,
  },
  content: { flex: 1, paddingHorizontal: 28, paddingTop: 8 },
  row: { flexDirection: "row", gap: 18, marginBottom: 20 },
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
  cardValue: { color: AppColors.text, fontSize: 34, fontWeight: "800", marginBottom: 8 },
  cardValueLg: { fontSize: 36 },
  cardLabel: { color: AppColors.textMuted, fontSize: 14, fontWeight: "600" },
  zonesWrap: { marginTop: 14, marginBottom: 26, alignItems: "center", width: "100%" },
  zonesTitle: { color: AppColors.text, fontSize: 24, fontWeight: "800", marginBottom: 12, textAlign: "center", width: "100%" },
  zoneWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  zoneBox: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: AppColors.zoneBorder,
  },
  zoneOn: { backgroundColor: AppColors.zoneOn, borderColor: AppColors.zoneBorderOn },
  zoneOff: { backgroundColor: AppColors.zoneOff },
  zoneNumOn: { color: AppColors.text, fontWeight: "800", fontSize: 14 },
  zoneNumOff: { color: AppColors.zoneNumOff, fontWeight: "700", fontSize: 14 },
  statusWrap: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  statusDot: { width: 10, height: 10, borderRadius: 6, marginRight: 8, borderWidth: 1, borderColor: AppColors.zoneBorder },
  statusRunning: { backgroundColor: AppColors.statusRunning },
  statusIdle: { backgroundColor: AppColors.statusIdle },
  statusPaused: { backgroundColor: AppColors.statusPaused },
  statusComplete: { backgroundColor: AppColors.button },
  statusText: { color: AppColors.textMuted, fontSize: 16, fontWeight: "700" },
  bottomRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: "auto",
    marginBottom: 22,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: AppColors.primary,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: AppColors.button,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryTxt: { color: AppColors.text, fontSize: 20, fontWeight: "800" },
  btnSecondaryTxt: { color: AppColors.text, fontSize: 20, fontWeight: "800" },
  btnPressed: { opacity: 0.9, backgroundColor: AppColors.primaryPressed },
});

function pad2(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}