import { Alert } from "react-native";

import {
  updateProtocol,
  type Protocol,
} from "@/databaseLib/DB";

export function trimmedProtocolNameOrNull(raw: string): string | null {
  const t = raw.trim();
  return t.length > 0 ? t : null;
}

export function alertProtocolNameRequired(): void {
  Alert.alert("Name required", "Please enter a protocol name.");
}


export async function persistProtocolRename(
  id: number,
  protocol: Protocol,
  trimmedName: string,
): Promise<boolean> {
  try {
    await updateProtocol(id, {
      name: trimmedName,
      timeMin: protocol.timeMin,
      timeSec: protocol.timeSec,
      Zones: protocol.Zones,
      editorType: protocol.editorType,
    });
    return true;
  } catch (e) {
    console.warn("Failed to rename protocol:", e);
    Alert.alert(
      "Error",
      e instanceof Error ? e.message : "Could not rename protocol.",
    );
    return false;
  }
}


export async function renameProtocolSaving(
  id: number,
  protocol: Protocol,
  rawName: string,
): Promise<boolean> {
  const trimmed = trimmedProtocolNameOrNull(rawName);
  if (!trimmed) {
    alertProtocolNameRequired();
    return false;
  }
  return persistProtocolRename(id, protocol, trimmed);
}
