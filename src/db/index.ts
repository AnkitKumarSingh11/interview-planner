import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { initialTracks } from '@/data/initialData';
import { Track, Section, Question, Difficulty } from '@/types/tracker';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'tracker.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency & speed
db.pragma('journal_mode = WAL');

// Initialize Tables Schema
export function initDb() {
  db.exec(`
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

  // Check if DB is empty; if so, seed initial dataset
  const count = db.prepare('SELECT count(*) as count FROM tracks').get() as { count: number };
  if (count.count === 0) {
    seedDatabase();
  }
}

function seedDatabase() {
  console.log('Seeding initial tracks and syllabi into SQLite database...');

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
  console.log('Database seeded successfully!');
}

// Helper DB Access Functions

export function getAllTracks(): Track[] {
  initDb();

  const tracks = db.prepare('SELECT * FROM tracks').all() as any[];

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
            'SELECT * FROM questions WHERE subsection_id = ? AND status = "approved"'
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
  sectionId: string;
  subsectionTitle: string;
  title: string;
  difficulty: Difficulty;
  url?: string;
  notes?: string;
}) {
  initDb();

  // Find or create subsection
  let sub = db
    .prepare('SELECT id FROM subsections WHERE section_id = ? AND title = ?')
    .get(data.sectionId, data.subsectionTitle) as { id: string } | undefined;

  let subId = sub?.id;

  if (!subId) {
    subId = `sub-custom-${Date.now()}`;
    db.prepare(
      'INSERT INTO subsections (id, section_id, title) VALUES (?, ?, ?)'
    ).run(subId, data.sectionId, data.subsectionTitle);
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
  db.prepare('UPDATE questions SET status = "approved" WHERE id = ?').run(
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
  roadmapStartDate: string,
  targetDays: number,
  sections: Section[]
) {
  initDb();
  db.prepare(
    'UPDATE tracks SET roadmap_start_date = ?, target_days = ? WHERE id = ?'
  ).run(roadmapStartDate, targetDays, trackId);

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

export function addSectionToTrack(trackId: string, data: {
  topic: string;
  sectionTitle?: string;
  startDate: string;
  endDate: string;
  initialSubsections?: string[];
}) {
  initDb();

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
