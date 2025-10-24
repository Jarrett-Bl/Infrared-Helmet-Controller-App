import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

// Data structure for session settings - built through previous selection screens
type sessionSettings = {
  id: string;
  name: string;
  timeMin: number;
  timeSec: number;
  powerLevel: number;
  frequencyHz: number;
  sessionDurationMin: number;
  activeZones: number[];
};

// Test Sessions  - with sample data for now
const sessionList: sessionSettings[] = [
  { id: "1", name: "Memory Boost", timeMin: 30, timeSec: 0, powerLevel: 50, frequencyHz: 10, sessionDurationMin: 15, activeZones: [1,2,3,4] },
  { id: "2", name: "Relaxation", timeMin: 30, timeSec: 0, powerLevel: 35, frequencyHz: 8,  sessionDurationMin: 20, activeZones: [5,6,7] },
  { id: "3", name: "Energy Uplift", timeMin: 30, timeSec: 0, powerLevel: 60, frequencyHz: 12, sessionDurationMin: 10, activeZones: [2,8,9,10] },
  { id: "4", name: "Deep Focus", timeMin: 30, timeSec: 0, powerLevel: 55, frequencyHz: 9,  sessionDurationMin: 25, activeZones: [1,3,11,12] },
];


export type RunSessionScreenProps = {
  helmetValues: sessionSettings;

  onSaveProtocol?: () => void;
  onStart?: () => void;
  onStop?: () => void;
  //TODO - will be added with Jacob and Jarret's stories
  onBackPress?: () => void;
  onHomePress?: () => void;

  // Styling
  contentStyle?: ViewStyle;
};

/** ------- Component ------- */
export default function RunSessionScreen({
  helmetValues = sessionList[0],
  onBackPress,
  onHomePress,
  onSaveProtocol,
  onStart,
  onStop,
  contentStyle,
}: RunSessionScreenProps) {
  /** Timer + countdown logic */
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const initialTotalSeconds = helmetValues.timeMin * 60 + helmetValues.timeSec;
  const [remaining, setRemaining] = useState<number>(initialTotalSeconds);
  const [running, setRunning] = useState<boolean>(false);
  // Track whether the session was stopped to display idle
  const [stopped, setStopped] = useState<boolean>(false);

  useEffect(() => {
    if (!running) setRemaining(helmetValues.timeMin * 60 + helmetValues.timeSec);
  }, [helmetValues.timeMin, helmetValues.timeSec]);

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
    onStart?.();
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          // stop at zero
          if (timerRef.current) {
            clearInterval(timerRef.current as any);
            timerRef.current = null;
          }
          setRunning(false);
          onStop?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }, [running, onStart, onStop]);

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
  // mark as stopped/idle
  setStopped(true);
    onStop?.();
  }, [initialTotalSeconds, onStop]);

  /** Derived labels for formatting time and hz */
  const mm = useMemo(() => pad2(Math.floor(remaining / 60)), [remaining]);
  const ss = useMemo(() => pad2(remaining % 60), [remaining]);
  const freqLabel = useMemo(() => `${helmetValues.frequencyHz} Hz`, [helmetValues.frequencyHz]);

  // UX helpers
  const isComplete = remaining === 0;
  const isAtInitial = remaining === initialTotalSeconds;
  // primary button text and handler
  const primaryTitle = running ? "Pause" : isComplete ? "Start" : isAtInitial ? "Start" : "Resume";
  const primaryOnPress = running ? pauseTimer : isComplete ? undefined : startTimer;

  // Compute status When session has not been started yet
  // or when Stop was pressed (stopped === true), show a RED idle/not-started
  // indicator.
  let statusText = "";
  let statusDotStyle = s.statusPaused;
  if (isAtInitial && !running) {
    // initial state or after stop
    statusDotStyle = s.statusIdle;
    // Always show "Idle" for both never-started and stopped states
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
          testID="btn-back"
          accessibilityLabel="Back"
          onPress={onBackPress}
          style={s.iconBtn}
          hitSlop={10}
        >
          <Text style={s.iconTxt}>←</Text>
        </Pressable>

        <Text
          style={s.title}
          accessibilityRole="header"
          testID="hdr-session"
        >
          Your Session
        </Text>

        <Pressable
          testID="btn-home"
          accessibilityLabel="Home"
          onPress={onHomePress}
          style={s.iconBtn}
          hitSlop={10}
        >
          <Text style={s.iconTxt}>⌂</Text>
        </Pressable>
      </View>

      <View style={[s.content, contentStyle]}>
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
          <InfoCard value={helmetValues.powerLevel} label="Power Level" large testID="card-power" />
          <InfoCard value={freqLabel} label="Frequency" large testID="card-frequency" />
        </Row>

        {/* Zones */}
        <View style={s.zonesWrap}>
          <Text style={s.zonesTitle} testID="lbl-zones">Zones Enabled</Text>
          <ZoneSquares
            active={helmetValues.activeZones}
            showNumbers
            testID="zones-grid"
          />
        </View>

        {/* Save */}
        <View style={{ marginVertical: 12, width: "100%" }}>
          <Pressable
            onPress={() => {
              console.log("Save Protocol pressed");
              onSaveProtocol?.();
            }}
            testID="btn-save"
            style={({ pressed }) => [s.saveBtn, pressed && s.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Save as Protocol"
            hitSlop={8}
          >
            <Text style={s.saveBtnTxt}>Save as Protocol</Text>
          </Pressable>
        </View>

        {/* Start / Pause / Stop */}
        <View style={s.bottomRow}>
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
  return (
    <View style={s.card} testID={testID} accessibilityLabel={`${label} card`}>
      <Text style={[s.cardValue, large && s.cardValueLg]}>{value}</Text>
      <Text style={s.cardLabel}>{label}</Text>
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
  const SZ = 102;
  return (
    <View style={[s.zoneWrap, style]} testID={testID} accessibilityLabel="Zone squares">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
        const isOn = active.includes(n);
        const boxStyle = [
          s.zoneBox,
          { width: SZ, height: SZ, borderRadius: SZ * 0.25 },
          isOn ? s.zoneOn : s.zoneOff,
        ];

        return (
          <View key={n} style={{ marginRight: 10, marginBottom: 10 }}>
            <View style={boxStyle} testID={`zone-${n}`}>
              {showNumbers && (
                <Text style={isOn ? s.zoneNumOn : s.zoneNumOff}>{n}</Text>
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
      style={({ pressed }) => [s.btnPrimary, (!onPress || pressed) && s.btnPressed, style]}
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

//Styles
const BG = "#0E1418";
const CARD = "#252D34";
const CARD_BORDER = "#22303A";
const TEXT = "#FFFFFF";
const SUB = "#AEB7BF";
const BLUE = "#58A6FF";
const BLUE_DARK = "#3B6FB8";
const MUTED = "#2B3640";
const DOT_ON = "#1CCB4B";
const DOT_OFF = "#0D1A22";
const DOT_BORDER = "#1E2A33";
const PAUSED = "#FFC857";
const IDLE = "#E53935";

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTxt: { color: TEXT, fontSize: 20, fontWeight: "800", opacity: 0.9 },
  title: { color: TEXT, fontSize: 24, fontWeight: "800" },

  content: { flex: 1, paddingHorizontal: 28 },

  row: { flexDirection: "row", gap: 18, marginBottom: 20 },

  card: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    alignItems: "center",
  },
  cardValue: { color: TEXT, fontSize: 34, fontWeight: "800", marginBottom: 8 },
  cardValueLg: { fontSize: 36 },
  cardLabel: { color: SUB, fontSize: 14, fontWeight: "600" },

  zonesWrap: { marginTop: 14, marginBottom: 26, alignItems: "center", width: "100%" },
  zonesTitle: { color: TEXT, fontSize: 24, fontWeight: "800", marginBottom: 12, textAlign: "center", width: "100%" },

  zoneWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  zoneBox: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: DOT_BORDER,
  },
  zoneOn: { backgroundColor: DOT_ON, borderColor: "#2E6B3D" },
  zoneOff: { backgroundColor: DOT_OFF },
  zoneNumOn: { color: TEXT, fontWeight: "800", fontSize: 14 },
  zoneNumOff: { color: "#8BA0AC", fontWeight: "700", fontSize: 14 },
  
  saveBtn: {
    width: "100%",
    paddingVertical: 22,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BLUE,
  },
  saveBtnTxt: { fontSize: 26, color: TEXT, fontWeight: "900" },

  statusWrap: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  statusDot: { width: 10, height: 10, borderRadius: 6, marginRight: 8, borderWidth: 1, borderColor: DOT_BORDER },
  statusRunning: { backgroundColor: DOT_ON },
  statusIdle: { backgroundColor: IDLE },
  statusPaused: { backgroundColor: PAUSED },
  statusComplete: { backgroundColor: MUTED },
  statusText: { color: SUB, fontSize: 16, fontWeight: "700" },

  bottomRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: "auto",
    marginBottom: 22,
  },

  btnPrimary: {
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: MUTED,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryTxt: { color: TEXT, fontSize: 20, fontWeight: "800" },
  btnSecondaryTxt: { color: TEXT, fontSize: 20, fontWeight: "800" },
  btnPressed: { opacity: 0.9, backgroundColor: BLUE_DARK },
});

/* Helper */
function pad2(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}
