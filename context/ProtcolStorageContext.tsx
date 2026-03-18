import { createContext, ReactNode, useContext, useState } from "react";
import type { Protocol, ZoneConfig } from "../databaseLib/DB";
import {
  deleteProtocolById,
  storeProtocol,
  updateProtocol,
} from "../databaseLib/DB";

type ProtocolContextValue = {
  protocol: Protocol | null;
  editingProtocolId: number | null;
  initProtocol: (editorType?: "simple" | "complex") => void;
  setZonesFromSelection: (zoneIds: number[]) => void;
  setZoneConfigForZones: (zoneIds: number[], cfg: ZoneConfig) => void;
  setPowerForAllZones: (powerLevel: number) => void;
  setFrequencyForAllZones: (frequencyHz: number) => void;
  setTime: (timeMin: number, timeSec: number) => void;
  saveProtocol: () => Promise<number>;
  loadProtocol: (p: Protocol) => void;
  startEditingProtocol: (p: Protocol) => void;
  clearEditingProtocol: () => void;
  clearProtocol: () => void;
  deleteProtocol: (id: number) => Promise<void>;
};

const ProtocolStorageContext = createContext<ProtocolContextValue | undefined>(
  undefined,
);

export function ProtocolProvider({ children }: { children: ReactNode }) {
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [editingProtocolId, setEditingProtocolId] = useState<number | null>(
    null,
  );

  const initProtocol = (editorType: "simple" | "complex" = "simple") => {
    const randomSuffix = Math.random().toString(36).slice(2, 6);
    const autoName = `Protocol-${randomSuffix}`;

    setEditingProtocolId(null);
    setProtocol({
      name: autoName,
      timeMin: 0,
      timeSec: 0,
      Zones: {},
      editorType,
    });
  };

  const ensureBaseProtocol = (p: Protocol | null): Protocol => {
    return (
      p ?? {
        name: `Protocol-${Math.random().toString(36).slice(2, 6)}`,
        timeMin: 0,
        timeSec: 0,
        Zones: {},
        editorType: "simple",
      }
    );
  };

  const setZonesFromSelection = (zoneIds: number[]) => {
    setProtocol((prev) => {
      const base = ensureBaseProtocol(prev);
      const prevZones = base.Zones ?? {};
      const nextZones: Record<number, ZoneConfig> = {};

      zoneIds.forEach((id) => {
        nextZones[id] = prevZones[id] ?? { powerLevel: 0, frequencyHz: 0 };
      });

      return { ...base, Zones: nextZones };
    });
  };

  const setZoneConfigForZones = (zoneIds: number[], cfg: ZoneConfig) => {
    setProtocol((prev) => {
      const base = ensureBaseProtocol(prev);
      const nextZones: Record<number, ZoneConfig> = { ...(base.Zones ?? {}) };

      zoneIds.forEach((id) => {
        const existing = nextZones[id] ?? { powerLevel: 0, frequencyHz: 0 };
        nextZones[id] = { ...existing, ...cfg };
      });

      return { ...base, Zones: nextZones };
    });
  };

  const setPowerForAllZones = (powerLevel: number) => {
    setProtocol((prev) => {
      if (!prev) return prev;
      const newZones: Record<number, ZoneConfig> = {};

      Object.entries(prev.Zones).forEach(([id, cfg]) => {
        newZones[Number(id)] = { ...cfg, powerLevel };
      });

      return { ...prev, Zones: newZones };
    });
  };

  const setFrequencyForAllZones = (frequencyHz: number) => {
    setProtocol((prev) => {
      if (!prev) return prev;
      const newZones: Record<number, ZoneConfig> = {};

      Object.entries(prev.Zones).forEach(([id, cfg]) => {
        newZones[Number(id)] = { ...cfg, frequencyHz };
      });

      return { ...prev, Zones: newZones };
    });
  };

  const setTime = (timeMin: number, timeSec: number) => {
    setProtocol((prev) => (prev ? { ...prev, timeMin, timeSec } : prev));
  };

  const saveProtocol = async (): Promise<number> => {
    if (!protocol) {
      throw new Error("No protocol to save");
    }

    if (editingProtocolId != null) {
      await updateProtocol(editingProtocolId, {
        name: protocol.name,
        timeMin: protocol.timeMin,
        timeSec: protocol.timeSec,
        Zones: protocol.Zones,
        editorType: protocol.editorType,
      });

      setProtocol((prev) => (prev ? { ...prev, id: editingProtocolId } : prev));
      return editingProtocolId;
    }

    const newId = await storeProtocol({
      name: protocol.name,
      timeMin: protocol.timeMin,
      timeSec: protocol.timeSec,
      Zones: protocol.Zones,
      editorType: protocol.editorType,
    });

    setProtocol((prev) => (prev ? { ...prev, id: newId } : prev));
    return newId;
  };

  const loadProtocol = (p: Protocol) => {
    setProtocol(p);
  };

  const startEditingProtocol = (p: Protocol) => {
    setProtocol(p);
    setEditingProtocolId(p.id ?? null);
  };

  const clearEditingProtocol = () => {
    setEditingProtocolId(null);
  };

  const deleteProtocol = async (id: number): Promise<void> => {
    await deleteProtocolById(id);
    setProtocol((prev) => (prev?.id === id ? null : prev));
    setEditingProtocolId((prev) => (prev === id ? null : prev));
  };

  const clearProtocol = () => {
    setProtocol(null);
    setEditingProtocolId(null);
  };

  return (
    <ProtocolStorageContext.Provider
      value={{
        protocol,
        editingProtocolId,
        initProtocol,
        setZonesFromSelection,
        setZoneConfigForZones,
        setPowerForAllZones,
        setFrequencyForAllZones,
        setTime,
        saveProtocol,
        loadProtocol,
        startEditingProtocol,
        clearEditingProtocol,
        deleteProtocol,
        clearProtocol,
      }}
    >
      {children}
    </ProtocolStorageContext.Provider>
  );
}

export function useProtocol() {
  const ctx = useContext(ProtocolStorageContext);
  if (!ctx) throw new Error("useProtocol must be used inside ProtocolProvider");
  return ctx;
}
