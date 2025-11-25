import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import type { Protocol, ZoneConfig } from "../databaseLib/DB";
import { storeProtocol } from "../databaseLib/DB";

type ProtocolContextValue = {
  protocol: Protocol | null;
  initProtocol: () => void;
  setZonesFromSelection: (zoneIds: number[]) => void;
  setPowerForAllZones: (powerLevel: number) => void;
  setFrequencyForAllZones: (frequencyHz: number) => void;
  setTime: (timeMin: number, timeSec: number) => void;
  saveProtocol: () => Promise<number>;
  loadProtocol: (p: Protocol) => void; 
};

const ProtocolStorageContext = createContext<ProtocolContextValue | undefined>(
  undefined
);

export function ProtocolProvider({ children }: { children: ReactNode }) {
  const [protocol, setProtocol] = useState<Protocol | null>(null);

  const initProtocol = () => {
    const randomSuffix = Math.random().toString(36).slice(2, 6);
    const autoName = `Protocol-${randomSuffix}`;

    setProtocol({
      name: autoName,
      timeMin: 0,
      timeSec: 0,
      Zones: {},
    });
  };

  const ensureBaseProtocol = (): Protocol => {
    return (
      protocol ?? {
        name: `Protocol-${Math.random().toString(36).slice(2, 6)}`,
        timeMin: 0,
        timeSec: 0,
        Zones: {},
      }
    );
  };

  const setZonesFromSelection = (zoneIds: number[]) => {
    setProtocol((prev) => {
      const base = prev ?? ensureBaseProtocol();
      const newZones: Record<number, ZoneConfig> = {};

      zoneIds.forEach((id) => {
        const existing = base.Zones[id];
        newZones[id] = existing ?? { powerLevel: 0, frequencyHz: 0 };
      });

      return { ...base, Zones: newZones };
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

    const newId = await storeProtocol({
      name: protocol.name,
      timeMin: protocol.timeMin,
      timeSec: protocol.timeSec,
      Zones: protocol.Zones,
    });

    setProtocol((prev) => (prev ? { ...prev, id: newId } : prev));
    return newId;
  };

  const loadProtocol = (p: Protocol) => {
    setProtocol(p);
  };

  return (
    <ProtocolStorageContext.Provider
      value={{
        protocol,
        initProtocol,
        setZonesFromSelection,
        setPowerForAllZones,
        setFrequencyForAllZones,
        setTime,
        saveProtocol,
        loadProtocol,
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