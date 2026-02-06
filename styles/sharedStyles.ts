import { AppColors } from "@/constants/theme";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: AppColors.background,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    color: AppColors.text,
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
  buttonLabel: { fontSize: 24, fontWeight: "bold" },
  searchInput: {
    backgroundColor: AppColors.card,
    color: AppColors.text,
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ android: 14, ios: 18 }) as number,
    borderRadius: 14,
    fontSize: Platform.select({ android: 20, ios: 24 }) as number,
    lineHeight: Platform.select({ android: 24, ios: 28 }) as number,
    includeFontPadding: false,
    marginBottom: 14,
  },

  card: {
    backgroundColor: AppColors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  cardColumn: { flexDirection: "column", alignItems: "stretch" },
  cardElevated: { elevation: 2 },

  cardBody: { flex: 1 },
  cardTitle: { color: AppColors.text, fontSize: 22, fontWeight: "700", marginBottom: 6 },
  cardSub: { color: AppColors.textMuted, fontSize: 16, marginBottom: 10 },

  zoneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: -8,
    marginBottom: -8,
    maxWidth: 260,
  },
  zoneCell: { alignItems: "center", justifyContent: "center", borderWidth: 1 },
  zoneOn: { backgroundColor: AppColors.zoneOn, borderColor: AppColors.zoneBorderOn },
  zoneOff: { backgroundColor: AppColors.zoneOff, borderColor: AppColors.zoneBorder },
  zoneTextOn: { color: AppColors.text, fontWeight: "700" },
  zoneTextOff: { color: AppColors.zoneNumOff, fontWeight: "600" },

  loadBtn: {
    backgroundColor: AppColors.button,
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
  loadBtnText: { color: AppColors.text, fontSize: 18, fontWeight: "700" },

  emptyText: {
    color: AppColors.textMuted,
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" },

  zoneButton: {
    width: "47%",
    backgroundColor: AppColors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: AppColors.border,
    elevation: 3,
    shadowColor: AppColors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  zoneButtonSelected: { borderColor: AppColors.selected },

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
    borderColor: AppColors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: AppColors.selected },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: AppColors.selected },

  zoneNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.text,
    flex: 1,
    textAlign: "center",
  },

  selectedContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: AppColors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AppColors.selected,
    alignItems: "center",
  },
  selectedText: { fontSize: 18, fontWeight: "600", color: AppColors.selected },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 20 },
  header: { paddingHorizontal: 20, paddingVertical: 20, alignItems: "center" },
});
