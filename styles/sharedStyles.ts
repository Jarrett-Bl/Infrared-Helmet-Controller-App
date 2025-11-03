import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0E1418",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  button: {
    minWidth: 240,
    minHeight: 100,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: { fontSize: 24, fontWeight: "bold"},
  searchInput: {
    backgroundColor: "#252D34",
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ android: 14, ios: 18 }) as number,
    borderRadius: 14,
    fontSize: Platform.select({ android: 20, ios: 24 }) as number,
    lineHeight: Platform.select({ android: 24, ios: 28 }) as number,
    includeFontPadding: false,
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#151B20",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#22303A",
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  cardColumn: { flexDirection: "column", alignItems: "stretch" },
  cardElevated: { elevation: 2 },

  cardBody: { flex: 1 },
  cardTitle: { color: "white", fontSize: 22, fontWeight: "700", marginBottom: 6 },
  cardSub: { color: "#AEB7BF", fontSize: 16, marginBottom: 10 },

  zoneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: -8,
    marginBottom: -8,
    maxWidth: 260,
  },
  zoneCell: { alignItems: "center", justifyContent: "center", borderWidth: 1 },
  zoneOn: { backgroundColor: "#009520ff", borderColor: "#3C4A56" },
  zoneOff: { backgroundColor: "#0F1519", borderColor: "#1E2A33" },
  zoneTextOn: { color: "white", fontWeight: "700" },
  zoneTextOff: { color: "#6C7A86", fontWeight: "600" },

  loadBtn: {
    backgroundColor: "#2B3640",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    marginLeft: 16,
    alignSelf: "center",
  },
  loadBtnFull: {
    marginLeft: 0,
    marginTop: 8,
    alignSelf: "stretch",
    alignItems: "center",
  },
  loadBtnText: { color: "white", fontSize: 18, fontWeight: "700" },

  emptyText: {
    color: "#8B97A1",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
});
