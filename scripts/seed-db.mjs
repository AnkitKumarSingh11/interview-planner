import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'tracker.db');
console.log('📦 [Pre-build] Ensuring SQLite data directory and tracker.db exist at:', dbPath);

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Verify SQLite data tables exist
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    username TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    roadmap_start_date TEXT,
    target_days INTEGER
  );
  CREATE TABLE IF NOT EXISTS sections (
    id TEXT PRIMARY KEY,
    track_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    section_title TEXT,
    start_date TEXT,
    end_date TEXT,
    original_weight_days INTEGER DEFAULT 7,
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS subsections (
    id TEXT PRIMARY KEY,
    section_id TEXT NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    subsection_id TEXT NOT NULL,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    difficulty TEXT DEFAULT 'Medium',
    url TEXT,
    notes TEXT,
    custom INTEGER DEFAULT 0,
    status TEXT DEFAULT 'approved',
    submitted_at TEXT,
    FOREIGN KEY (subsection_id) REFERENCES subsections(id) ON DELETE CASCADE
  );
`);

console.log('✅ [Pre-build] SQLite schema and data directory successfully initialized.');
