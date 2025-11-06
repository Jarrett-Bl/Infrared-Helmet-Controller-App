import * as SQLite from "expo-sqlite";


//Types
export type ZoneConfig = {
  powerLevel: number;
  frequencyHz: number;
};

export type Protocol = {
  id: string;              // uuid
  name: string;
  timeMin: number;
  timeSec: number;
  Zones: Record<number, ZoneConfig>; // Each Zones holds holds a config(powerLevel, frequencyHz)
};


// Database init
let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("ProtocolsDB.db");
  }
  return db;
}

export async function initDb() {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS protocols (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      time_min INTEGER NOT NULL,
      time_sec INTEGER NOT NULL,
      zones_json TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_protocols_name ON protocols(name);
  `);
  return db;
}
