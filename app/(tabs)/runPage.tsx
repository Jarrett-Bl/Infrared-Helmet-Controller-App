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
import { useProtocol } from '../../context/ProtcolStorageContext';


type SessionSettings = {
  id: string;
  name: string;
  timeMin: number;
  timeSec: number;
  powerLevel: number;
  frequencyHz: number;
  sessionDurationMin: number;
  activeZones: number[];
};

export default function RunPage() {
  const { protocol, saveProtocol } = useProtocol();
  const { width, height } = useWindowDimensions();
  const baseWidth = 390;
  const baseHeight = 844;
  const globalScale = Math.max(
    0.65,
    Math.min(1, Math.min(width / baseWidth, height / baseHeight))
  );
  const bottomControlsHeight = Math.round(84 * globalScale);
  const bottomOffset = Platform.OS === "android" ? 28 : 16;

  useEffect(() => {
    console.log("RunPage protocol:", JSON.stringify(protocol, null, 2));
  }, [protocol]);



  const helmetValues: SessionSettings = useMemo(() => {
    if (!protocol) {
      // Fallback
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

    const zoneIds = Object.keys(protocol.Zones).map((n) => Number(n));
    const firstZoneId = zoneIds[0] ?? 1;
    const firstZoneCfg = protocol.Zones[firstZoneId];

    return {
      id: (protocol.id ?? -1).toString(),
      name: protocol.name,
      timeMin: protocol.timeMin,
      timeSec: protocol.timeSec,
      powerLevel: firstZoneCfg?.powerLevel ?? 0,
      frequencyHz: firstZoneCfg?.frequencyHz ?? 0,
      sessionDurationMin: protocol.timeMin, // you can change this if you want for per zone
      activeZones: zoneIds
    };
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
  const freqLabel = useMemo(
    () => `${helmetValues.frequencyHz} Hz`,
    [helmetValues.frequencyHz]
  );

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

  //think I need to add clear Protocol method to Context methods 
  // upon save currently I am not incrementing the id var, leading to matching id check to return early. 
  //TODO !!

  const handleSaveProtocol = useCallback(async () => {
    try {
      const id = await saveProtocol();
      console.log("Protocol saved with id:", id);
      Alert.alert("Saved", `Protocol saved with id ${id}`);
    } catch (e) {
      console.error("Failed to save protocol", e);
      Alert.alert("Error", "Could not save protocol. Please try again.");
    }
  }, [saveProtocol]);

  return (
    <SafeAreaView style={s.screen}>
      {/* Header */}
      <View style={s.topBar}>
        <Text style={s.title} accessibilityRole="header" testID="hdr-session">
          Your Session
        </Text>
        
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          { paddingHorizontal: 28 },
          { paddingBottom: bottomControlsHeight + bottomOffset + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Time */}
        <Row>
          <InfoCard value={mm} label="Minutes" testID="card-minutes" />
          <InfoCard value={ss} label="Seconds" testID="card-seconds" />
        </Row>

        {/* Status */}
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

        {/* Save button */}
        <View style={{ marginVertical: 12 * globalScale, width: "100%" }}>
          <Pressable
            onPress={handleSaveProtocol}
            testID="btn-save"
            style={({ pressed }) => [s.saveBtn, pressed && s.btnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Save as Protocol"
            hitSlop={8}
          >
            <Text
              style={[
                s.saveBtnTxt,
                { fontSize: Math.round(26 * globalScale) },
              ]}
            >
              Save as Protocol
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom controls */}
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
    Math.min(1, Math.min(width / baseW, height / baseH))
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
  const { width, height } = useWindowDimensions();
  const baseWidth = 390;
  const baseHeight = 844;
  const scale = Math.max(
    0.65,
    Math.min(1, Math.min(width / baseWidth, height / baseHeight))
  );
  const horizontalPadding = 56;
  const availableWidth = Math.max(160, width - horizontalPadding);
  const columns = Math.min(
    6,
    Math.max(
      2,
      Math.floor(
        availableWidth / Math.max(64, Math.round(72 * scale))
      )
    )
  );
  const gap = Math.round(8 * scale);
  const rawSZ = Math.floor(
    (availableWidth - gap * (columns - 1)) / columns
  );
  const minSZ = Math.max(36, Math.round(36 * scale));
  const maxSZ = Math.max(64, Math.round(80 * scale));
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
          {
            width: SZ,
            height: SZ,
            borderRadius: Math.round(SZ * 0.25),
          },
          isOn ? s.zoneOn : s.zoneOff,
        ];

        return (
          <View key={n} style={{ marginRight: gap, marginBottom: gap }}>
            <View style={boxStyle} testID={`zone-${n}`}>
              {showNumbers && (
                <Text
                  style={
                    isOn
                      ? [s.zoneNumOn, numStyle]
                      : [s.zoneNumOff, numStyle]
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
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    marginBottom: 12,
  },
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
  zonesWrap: {
    marginTop: 14,
    marginBottom: 26,
    alignItems: "center",
    width: "100%",
  },
  zonesTitle: {
    color: AppColors.text,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
    width: "100%",
  },
  zoneWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
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

  saveBtn: {
    width: "100%",
    paddingVertical: 22,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.primary,
  },
  saveBtnTxt: { fontSize: 26, color: AppColors.text, fontWeight: "900" },

  statusWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
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
  statusText: { color: AppColors.textMuted, fontSize: 16, fontWeight: "700" },

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
