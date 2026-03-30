import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import {
  Alert,
  Platform,
  Pressable,
} from "react-native";

import { AppColors } from "@/constants/theme";
import type { Protocol } from "@/databaseLib/DB";
import { storeProtocol } from "@/databaseLib/DB";
import {
  parseImportedProtocol,
  serializeProtocolForExport,
} from "@/lib/protocolJson";

async function readJsonFromPickedAsset(
  asset: DocumentPicker.DocumentPickerAsset,
): Promise<string> {
  return FileSystem.readAsStringAsync(asset.uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });
}

export function ProtocolJsonImportButton({
  onImported,
}: {
  onImported: () => void | Promise<void>;
}) {
  const pickAndImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
        multiple: false,
        base64: Platform.OS === "web" ? false : undefined,
      });

      if (result.canceled || !result.assets?.length) return;

      const text = await readJsonFromPickedAsset(result.assets[0]);
      const payload = parseImportedProtocol(text);
      await storeProtocol(payload);
      Alert.alert("Imported", `Protocol "${payload.name}" was added.`);
      await onImported();
    } catch (e) {
      Alert.alert(
        "Import failed",
        e instanceof Error ? e.message : "Could not import protocol.",
      );
    }
  };

  return (
    <Pressable
      onPress={pickAndImport}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Import protocol from JSON"
      testID="btn-import-protocol-json"
      style={{
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        minWidth: 44,
      }}
    >
      <Ionicons
        name="cloud-upload-outline"
        size={26}
        color={AppColors.statusIdle}
      />
    </Pressable>
  );
}

function safeFileBase(name: string): string {
  const trimmed = name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 80);
  return trimmed || "protocol";
}

export function ProtocolJsonExportButton({ protocol }: { protocol: Protocol }) {
  const exportProtocol = async () => {
    try {
      const json = serializeProtocolForExport(protocol);
      const base = safeFileBase(protocol.name);
      const filename = `${base}-${Date.now()}.json`;

      const dir = FileSystem.cacheDirectory;
      if (!dir) {
        throw new Error("Cache directory is not available.");
      }

      const path = `${dir}${filename}`;
      await FileSystem.writeAsStringAsync(path, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Export", "Sharing is not available on this device.");
        return;
      }

      await Sharing.shareAsync(path, {
        mimeType: "application/json",
        dialogTitle: "Export protocol",
        UTI: "public.json",
      });
    } catch (e) {
      Alert.alert(
        "Export failed",
        e instanceof Error ? e.message : "Could not export protocol.",
      );
    }
  };

  return (
    <Pressable
      onPress={exportProtocol}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel="Export protocol to JSON"
      testID={`btn-export-protocol-json-${protocol.id ?? "new"}`}
      style={{
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons
        name="share-outline"
        size={22}
        color={AppColors.statusIdle}
      />
    </Pressable>
  );
}
