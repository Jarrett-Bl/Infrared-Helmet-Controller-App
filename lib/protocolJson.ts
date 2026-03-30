import type { Protocol, ZoneConfig } from "@/databaseLib/DB";

export type ProtocolImportPayload = Pick<
  Protocol,
  "name" | "timeMin" | "timeSec" | "Zones" | "editorType"
>;

function isZoneConfig(x: unknown): x is ZoneConfig {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.powerLevel === "number" &&
    Number.isFinite(o.powerLevel) &&
    typeof o.frequencyHz === "number" &&
    Number.isFinite(o.frequencyHz)
  );
}

/**
 * JSON for export/import: same fields as DB insert, without `id`.
 */
export function serializeProtocolForExport(p: Protocol): string {
  const { name, timeMin, timeSec, Zones, editorType } = p;
  return JSON.stringify(
    { name, timeMin, timeSec, Zones: Zones ?? {}, editorType },
    null,
    2,
  );
}

export function parseImportedProtocol(jsonText: string): ProtocolImportPayload {
  let data: unknown;
  try {
    data = JSON.parse(jsonText);
  } catch {
    throw new Error("The file is not valid JSON.");
  }

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("Protocol file must be a JSON object.");
  }

  const o = data as Record<string, unknown>;

  if (typeof o.name !== "string" || !o.name.trim()) {
    throw new Error('Protocol must include a non-empty "name" string.');
  }

  if (typeof o.timeMin !== "number" || !Number.isFinite(o.timeMin)) {
    throw new Error('Protocol must include a numeric "timeMin".');
  }

  if (typeof o.timeSec !== "number" || !Number.isFinite(o.timeSec)) {
    throw new Error('Protocol must include a numeric "timeSec".');
  }

  if (o.editorType !== "simple" && o.editorType !== "complex") {
    throw new Error('Protocol "editorType" must be "simple" or "complex".');
  }

  if (typeof o.Zones !== "object" || o.Zones === null || Array.isArray(o.Zones)) {
    throw new Error('Protocol "Zones" must be an object.');
  }

  const Zones: Record<number, ZoneConfig> = {};
  for (const [k, v] of Object.entries(o.Zones as Record<string, unknown>)) {
    const id = Number(k);
    if (!Number.isInteger(id) || id < 1) {
      throw new Error(`Invalid zone key: ${k}`);
    }
    if (!isZoneConfig(v)) {
      throw new Error(`Invalid zone config for zone ${k}.`);
    }
    Zones[id] = v;
  }

  return {
    name: o.name.trim(),
    timeMin: o.timeMin,
    timeSec: o.timeSec,
    Zones,
    editorType: o.editorType,
  };
}
