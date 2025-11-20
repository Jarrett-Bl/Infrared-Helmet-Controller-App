import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";
import type { Protocol, ZoneConfig } from "../databaseLib/DB"; // <-- adjust if needed
import { storeProtocol } from "../databaseLib/DB";

type ProtocolContextValue = {
  protocol: Protocol | null;
  /** called on Zone page first time */
  initProtocol: () => void;
  /** from Zone page: set which zones are in the protocol */
  setZonesFromSelection: (zoneIds: number[]) => void;
  /** from Power page */
  setPowerForZone: (zoneId: number, powerLevel: number) => void;
  /** from Frequency page */
  setFrequencyForZone: (zoneId: number, frequencyHz: number) => void;
  /** from Time page */
  setTime: (timeMin: number, timeSec: number) => void;
  /** final step: write to SQLite and return DB id */
  saveProtocol: () => Promise<number>;
  setPowerForAllZones: (powerLevel: number) => void;
};

const ProtocolStorageContext = createContext<ProtocolContextValue | undefined>(
  undefined
);

export function ProtocolProvider({ children }: { children: ReactNode }) {
  const [protocol, setProtocol] = useState<Protocol | null>(null);

  /** Step 1 – called on Zone page mount */
  const initProtocol = () => {
    const randomSuffix = Math.random().toString(36).slice(2, 6); // "a3f9" etc.
    const autoName = `Protocol-${randomSuffix}`;

    setProtocol({
      // id is left undefined until DB insert
      name: autoName,
      timeMin: 0,
      timeSec: 0,
      Zones: {},
    });
  };

  /** Step 1 – after user picks zones */
  const setZonesFromSelection = (zoneIds: number[]) => {
    setProtocol((prev) => {
      const base: Protocol =
        prev ?? {
          name: `Protocol-${Math.random().toString(36).slice(2, 6)}`,
          timeMin: 0,
          timeSec: 0,
          Zones: {},
        };

      const newZones: Record<number, ZoneConfig> = {};

      // keep any existing config for a zone if it exists, otherwise default
      zoneIds.forEach((id) => {
        const existing = base.Zones[id];
        newZones[id] = existing ?? { powerLevel: 0, frequencyHz: 0 };
      });

      return {
        ...base,
        Zones: newZones,
      };
    });
  };

  /** Step 2 – Power page */
  const setPowerForZone = (zoneId: number, powerLevel: number) => {
    setProtocol((prev) => {
      if (!prev) return prev;

      const existing = prev.Zones[zoneId] ?? { powerLevel: 0, frequencyHz: 0 };

      return {
        ...prev,
        Zones: {
          ...prev.Zones,
          [zoneId]: {
            ...existing,
            powerLevel,
          },
        },
      };
    });
  };
  const setPowerForAllZones = (powerLevel: number) => {
  setProtocol((prev) => {
    if (!prev) return prev;
    const newZones: Record<number, ZoneConfig> = {};

    Object.entries(prev.Zones).forEach(([id, cfg]) => {
      newZones[Number(id)] = {
        ...cfg,
        powerLevel,
      };
    });

    return {
      ...prev,
      Zones: newZones,
    };
  });
};

  /** Step 3 – Frequency page */
  const setFrequencyForZone = (zoneId: number, frequencyHz: number) => {
    setProtocol((prev) => {
      if (!prev) return prev;

      const existing = prev.Zones[zoneId] ?? { powerLevel: 0, frequencyHz: 0 };

      return {
        ...prev,
        Zones: {
          ...prev.Zones,
          [zoneId]: {
            ...existing,
            frequencyHz,
          },
        },
      };
    });
  };

  /** Step 4 – Time page */
  const setTime = (timeMin: number, timeSec: number) => {
    setProtocol((prev) => {
      if (!prev) return prev;
      return { ...prev, timeMin, timeSec };
    });
  };

  /** Step 5 – final save to SQLite */
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

    setProtocol((prev) =>
      prev ? { ...prev, id: newId } : prev
    );

    return newId;
  };

  return (
    <ProtocolStorageContext.Provider
      value={{
        protocol,
        initProtocol,
        setZonesFromSelection,
        setPowerForZone,
        setPowerForAllZones,
        setFrequencyForZone,
        setTime,
        saveProtocol,
      }}
    >
      {children}
    </ProtocolStorageContext.Provider>
  );
}

export function useProtocol() {
  const ctx = useContext(ProtocolStorageContext);
  if (!ctx) {
    throw new Error("useProtocol must be used inside ProtocolProvider");
  }
  return ctx;
}
