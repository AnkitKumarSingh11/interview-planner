import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { initialTracks } from '@/data/initialData';
import { Track, Section, Question, Difficulty } from '@/types/tracker';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'tracker.db');
const db = new Database(dbPath);

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');

// Password Hashing Helper (Salted PBKDF2 SHA-512)
export function hashPassword(password: string, salt?: string): string {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, actualSalt, 100000, 64, 'sha512').toString('hex');
  return `pbkdf2:${actualSalt}:${derivedKey}`;
}

// Initialize Database Schema & Seed Defaults
export function initDb() {
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
      status TEXT DEFAULT 'approved', -- 'approved', 'pending', 'rejected'
      submitted_at TEXT,
      FOREIGN KEY (subsection_id) REFERENCES subsections(id) ON DELETE CASCADE
    );
  `);

  // Seed default admin user if not exists
  const adminCount = db.prepare('SELECT count(*) as count FROM admin_users').get() as { count: number };
  if (adminCount.count === 0) {
    const defaultUsername = process.env.INITIAL_ADMIN_USERNAME || 'AnkitAvi11';
    const defaultPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Avengers11@383';
    const defaultPasswordHash = hashPassword(defaultPassword);
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(
      defaultUsername,
      defaultPasswordHash
    );
    console.log(`Admin user ${defaultUsername} initialized.`);
  }

  // Check if tracks or questions count is 0; if so, re-seed database defaults with DSA & LLD tracks
  const trackCount = db.prepare('SELECT count(*) as count FROM tracks').get() as { count: number };
  if (!trackCount || trackCount.count === 0) {
    resetAndSeedDatabase();
  }
}

export function resetAndSeedDatabase() {
  db.exec(`
    DELETE FROM questions;
    DELETE FROM subsections;
    DELETE FROM sections;
    DELETE FROM tracks;
  `);
  seedDatabase();
}

function seedDatabase() {
  console.log('Seeding initial tracks into SQLite database...');

  const insertTrack = db.prepare(`
    INSERT INTO tracks (id, title, description, roadmap_start_date, target_days)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertSection = db.prepare(`
    INSERT INTO sections (id, track_id, topic, section_title, start_date, end_date, original_weight_days)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSubsection = db.prepare(`
    INSERT INTO subsections (id, section_id, title)
    VALUES (?, ?, ?)
  `);

  const insertQuestion = db.prepare(`
    INSERT INTO questions (id, subsection_id, title, completed, difficulty, url, notes, custom, status, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction((tracks: Track[]) => {
    for (const track of tracks) {
      insertTrack.run(
        track.id,
        track.title,
        track.description,
        track.roadmapStartDate || '2026-09-03',
        track.targetDays || 90
      );

      for (const section of track.sections) {
        insertSection.run(
          section.id,
          track.id,
          section.topic,
          section.sectionTitle || section.topic,
          section.startDate,
          section.endDate,
          section.originalWeightDays || 7
        );

        for (const sub of section.subsections) {
          insertSubsection.run(sub.id, section.id, sub.title);

          for (const q of sub.questions) {
            insertQuestion.run(
              q.id,
              sub.id,
              q.title,
              q.completed ? 1 : 0,
              q.difficulty,
              q.url || null,
              q.notes || null,
              q.custom ? 1 : 0,
              'approved',
              new Date().toISOString()
            );
          }
        }
      }
    }
  });

  transaction(initialTracks);
  console.log('Database seeded successfully with DSA & LLD syllabi!');
}

// Admin Authentication Helpers

export function verifyAdminCredentials(username: string, password: string): boolean {
  initDb();
  const user = db
    .prepare('SELECT * FROM admin_users WHERE username = ?')
    .get(username) as { username: string; password_hash: string } | undefined;

  if (!user) return false;

  const stored = user.password_hash;
  if (stored.startsWith('pbkdf2:')) {
    const parts = stored.split(':');
    if (parts.length === 3) {
      const salt = parts[1];
      const expectedHash = parts[2];
      const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      return derivedKey === expectedHash;
    }
  }

  // Legacy fallback (single-pass sha256)
  const legacyHash = crypto.createHash('sha256').update(password).digest('hex');
  if (legacyHash === stored) {
    // Automatically upgrade legacy hash to PBKDF2
    const newHash = hashPassword(password);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(newHash, username);
    return true;
  }

  return false;
}

export function updateAdminPassword(username: string, newPassword: string): boolean {
  initDb();
  const newHash = hashPassword(newPassword);
  const result = db
    .prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?')
    .run(newHash, username);

  return result.changes > 0;
}

// Data Access Queries

export function getAllTracks(): Track[] {
  initDb();

  let tracks = db.prepare('SELECT * FROM tracks').all() as any[];

  if (!tracks || tracks.length === 0) {
    resetAndSeedDatabase();
    tracks = db.prepare('SELECT * FROM tracks').all() as any[];
  }

  if (!tracks || tracks.length === 0) {
    return initialTracks;
  }

  return tracks.map((t) => {
    const sections = db
      .prepare('SELECT * FROM sections WHERE track_id = ?')
      .all(t.id) as any[];

    const mappedSections: Section[] = sections.map((sec) => {
      const subsections = db
        .prepare('SELECT * FROM subsections WHERE section_id = ?')
        .all(sec.id) as any[];

      const mappedSubsections = subsections.map((sub) => {
        const questions = db
          .prepare(
            "SELECT * FROM questions WHERE subsection_id = ? AND status = 'approved'"
          )
          .all(sub.id) as any[];

        return {
          id: sub.id,
          title: sub.title,
          questions: questions.map((q) => ({
            id: q.id,
            title: q.title,
            completed: Boolean(q.completed),
            difficulty: q.difficulty as Difficulty,
            url: q.url || undefined,
            notes: q.notes || undefined,
            custom: Boolean(q.custom),
          })),
        };
      });

      return {
        id: sec.id,
        topic: sec.topic,
        sectionTitle: sec.section_title,
        startDate: sec.start_date,
        endDate: sec.end_date,
        originalWeightDays: sec.original_weight_days,
        subsections: mappedSubsections,
      };
    });

    return {
      id: t.id,
      title: t.title,
      description: t.description,
      roadmapStartDate: t.roadmap_start_date,
      targetDays: t.target_days,
      sections: mappedSections,
    };
  });
}

export function getPendingQuestions() {
  initDb();
  return db
    .prepare(`
      SELECT 
        q.id, q.title, q.difficulty, q.url, q.notes, q.submitted_at,
        sub.title as subsection_title, sub.id as subsection_id,
        sec.topic as parent_topic, sec.id as section_id,
        t.title as track_title, t.id as track_id
      FROM questions q
      JOIN subsections sub ON q.subsection_id = sub.id
      JOIN sections sec ON sub.section_id = sec.id
      JOIN tracks t ON sec.track_id = t.id
      WHERE q.status = 'pending'
      ORDER BY q.submitted_at DESC
    `)
    .all();
}

export function submitQuestionForApproval(data: {
  trackId?: string;
  sectionId?: string;
  newTopicName?: string;
  subsectionTitle: string;
  title: string;
  difficulty: Difficulty;
  url?: string;
  notes?: string;
}) {
  initDb();

  let targetSectionId = data.sectionId;

  if (!targetSectionId && data.trackId && data.newTopicName) {
    const topic = data.newTopicName.trim();
    let sec = db
      .prepare('SELECT id FROM sections WHERE track_id = ? AND topic = ?')
      .get(data.trackId, topic) as { id: string } | undefined;

    if (sec) {
      targetSectionId = sec.id;
    } else {
      targetSectionId = `sec-custom-${Date.now()}`;
      db.prepare(`
        INSERT INTO sections (id, track_id, topic, section_title, start_date, end_date, original_weight_days)
        VALUES (?, ?, ?, ?, 'TBD', 'TBD', 5)
      `).run(
        targetSectionId,
        data.trackId,
        topic,
        topic
      );
    }
  }

  if (!targetSectionId) {
    throw new Error('Valid Section ID or Track ID + New Topic Name is required');
  }

  let sub = db
    .prepare('SELECT id FROM subsections WHERE section_id = ? AND title = ?')
    .get(targetSectionId, data.subsectionTitle) as { id: string } | undefined;

  let subId = sub?.id;

  if (!subId) {
    subId = `sub-custom-${Date.now()}`;
    db.prepare(
      'INSERT INTO subsections (id, section_id, title) VALUES (?, ?, ?)'
    ).run(subId, targetSectionId, data.subsectionTitle);
  }

  const qId = `q-pending-${Date.now()}`;
  db.prepare(`
    INSERT INTO questions (id, subsection_id, title, completed, difficulty, url, notes, custom, status, submitted_at)
    VALUES (?, ?, ?, 0, ?, ?, ?, 1, 'pending', ?)
  `).run(
    qId,
    subId,
    data.title,
    data.difficulty,
    data.url || null,
    data.notes || null,
    new Date().toISOString()
  );

  return qId;
}

export function approveQuestion(questionId: string) {
  initDb();
  db.prepare("UPDATE questions SET status = 'approved' WHERE id = ?").run(
    questionId
  );
}

export function rejectQuestion(questionId: string) {
  initDb();
  db.prepare('DELETE FROM questions WHERE id = ?').run(questionId);
}

export function toggleQuestionCompletion(questionId: string) {
  initDb();
  db.prepare('UPDATE questions SET completed = 1 - completed WHERE id = ?').run(
    questionId
  );
}

export function updateQuestionNotes(questionId: string, notes: string) {
  initDb();
  db.prepare('UPDATE questions SET notes = ? WHERE id = ?').run(
    notes,
    questionId
  );
}

export function updateSectionDates(sectionId: string, startDate: string, endDate: string) {
  initDb();
  db.prepare(
    'UPDATE sections SET start_date = ?, end_date = ? WHERE id = ?'
  ).run(startDate, endDate, sectionId);
}

export function updateTrackTimelineSettings(
  trackId: string,
  roadmapStartDate?: string,
  targetDays?: number,
  sections?: Section[]
) {
  initDb();
  if (roadmapStartDate !== undefined || targetDays !== undefined) {
    db.prepare(
      'UPDATE tracks SET roadmap_start_date = COALESCE(?, roadmap_start_date), target_days = COALESCE(?, target_days) WHERE id = ?'
    ).run(roadmapStartDate || null, targetDays || null, trackId);
  }

  if (sections && Array.isArray(sections) && sections.length > 0) {
    const updateSec = db.prepare(
      'UPDATE sections SET start_date = ?, end_date = ? WHERE id = ?'
    );

    const transaction = db.transaction(() => {
      for (const sec of sections) {
        updateSec.run(sec.startDate, sec.endDate, sec.id);
      }
    });

    transaction();
  }
}

export function addSectionToTrack(trackId: string, data: {
  topic: string;
  sectionTitle?: string;
  startDate: string;
  endDate: string;
  initialSubsections?: string[];
}) {
  initDb();

  const track = db.prepare('SELECT id FROM tracks WHERE id = ?').get(trackId);
  if (!track) {
    throw new Error(`Track with ID "${trackId}" not found`);
  }

  const secId = `sec-custom-${Date.now()}`;
  db.prepare(`
    INSERT INTO sections (id, track_id, topic, section_title, start_date, end_date, original_weight_days)
    VALUES (?, ?, ?, ?, ?, ?, 5)
  `).run(
    secId,
    trackId,
    data.topic,
    data.sectionTitle || data.topic,
    data.startDate,
    data.endDate
  );

  const subTitles = data.initialSubsections || ['General'];
  for (const st of subTitles) {
    const subId = `sub-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    db.prepare(
      'INSERT INTO subsections (id, section_id, title) VALUES (?, ?, ?)'
    ).run(subId, secId, st);
  }

  return secId;
}

export function deleteSectionFromTrack(sectionId: string) {
  initDb();
  db.prepare('DELETE FROM sections WHERE id = ?').run(sectionId);
}

export function deleteSubsectionFromSection(subsectionId: string) {
  initDb();
  db.prepare('DELETE FROM subsections WHERE id = ?').run(subsectionId);
}

export function createNewTrack(title: string, description: string) {
  initDb();
  const trackId = `track-${Date.now()}`;
  db.prepare(`
    INSERT INTO tracks (id, title, description, roadmap_start_date, target_days)
    VALUES (?, ?, ?, ?, 60)
  `).run(trackId, title, description, new Date().toISOString().slice(0, 10));

  const secId = `sec-${Date.now()}`;
  db.prepare(`
    INSERT INTO sections (id, track_id, topic, section_title, start_date, end_date, original_weight_days)
    VALUES (?, ?, 'Getting Started', 'Getting Started', 'TBD', 'TBD', 7)
  `).run(secId, trackId);

  const subId = `sub-${Date.now()}`;
  db.prepare(
    'INSERT INTO subsections (id, section_id, title) VALUES (?, ?, ?)'
  ).run(subId, secId, 'General Questions');

  return trackId;
}

export function deleteTrack(trackId: string) {
  initDb();
  const track = db.prepare('SELECT id FROM tracks WHERE id = ?').get(trackId);
  if (!track) {
    throw new Error(`Track with ID "${trackId}" not found`);
  }
  db.prepare('DELETE FROM tracks WHERE id = ?').run(trackId);
}
