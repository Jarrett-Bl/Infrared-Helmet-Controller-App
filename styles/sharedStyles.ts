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
  // different grid from zoneGrid above (full cards in a 2-col wrap)
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" },

  zoneButton: {
    width: "47%",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#333333",
    elevation: 3,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  zoneButtonSelected: { borderColor: "#00FF00" },

  zoneContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  radioContainer: { marginRight: 15 },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: "#00FF00" },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#00FF00" },

  zoneNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },

  selectedContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#00FF00",
    alignItems: "center",
  },
  selectedText: { fontSize: 18, fontWeight: "600", color: "#00FF00" },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20 },
  header: { paddingHorizontal: 20, paddingVertical: 20, alignItems: "center" },
});
