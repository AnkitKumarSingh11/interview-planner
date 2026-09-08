import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { AdminUser } from '@/models/AdminUser';
import { TrackModel } from '@/models/Track';
import { PendingQuestionModel } from '@/models/PendingQuestion';
import { initialTracks } from '@/data/initialData';
import { Track, Section, Question, Difficulty } from '@/types/tracker';

// In-memory fallback state if MongoDB URI is not set
let inMemoryTracks: Track[] = JSON.parse(JSON.stringify(initialTracks));
let inMemoryPending: any[] = [];
let inMemoryAdminPasswordHash: string | null = null;

// Password Hashing Helper (Salted PBKDF2 SHA-512)
export function hashPassword(password: string, salt?: string): string {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(password, actualSalt, 100000, 64, 'sha512').toString('hex');
  return `pbkdf2:${actualSalt}:${derivedKey}`;
}

// Initialize Database Connection & Seed Defaults
export async function initDb(): Promise<void> {
  const conn = await connectToDatabase();

  const defaultUsername = process.env.INITIAL_ADMIN_USERNAME || 'AnkitAvi11';
  const defaultPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Avengers11@383';

  if (!conn) {
    if (!inMemoryAdminPasswordHash) {
      inMemoryAdminPasswordHash = hashPassword(defaultPassword);
    }
    return;
  }

  // Seed default admin user if not exists
  const adminCount = await AdminUser.countDocuments();
  if (adminCount === 0) {
    const defaultPasswordHash = hashPassword(defaultPassword);
    await AdminUser.create({
      username: defaultUsername,
      passwordHash: defaultPasswordHash,
    });
    console.log(`✅ [MongoDB] Default admin user ${defaultUsername} initialized.`);
  }

  // Seed default tracks if empty
  const trackCount = await TrackModel.countDocuments();
  if (trackCount === 0) {
    await resetAndSeedDatabase();
  }
}

export async function resetAndSeedDatabase(): Promise<void> {
  const conn = await connectToDatabase();
  if (!conn) {
    inMemoryTracks = JSON.parse(JSON.stringify(initialTracks));
    inMemoryPending = [];
    return;
  }

  await TrackModel.deleteMany({});
  await PendingQuestionModel.deleteMany({});

  for (const track of initialTracks) {
    await TrackModel.create(track);
  }
  console.log('✅ [MongoDB] Database seeded successfully with DSA & LLD syllabi!');
}

// Admin Authentication Helpers

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  await initDb();
  const conn = await connectToDatabase();

  const defaultUsername = process.env.INITIAL_ADMIN_USERNAME || 'AnkitAvi11';
  if (!conn) {
    if (username !== defaultUsername) return false;
    if (!inMemoryAdminPasswordHash) inMemoryAdminPasswordHash = hashPassword('Avengers11@383');
    const stored = inMemoryAdminPasswordHash;
    if (stored.startsWith('pbkdf2:')) {
      const parts = stored.split(':');
      if (parts.length === 3) {
        const salt = parts[1];
        const expectedHash = parts[2];
        const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
        return derivedKey === expectedHash;
      }
    }
    return crypto.createHash('sha256').update(password).digest('hex') === stored;
  }

  const user = await AdminUser.findOne({ username });
  if (!user) return false;

  const stored = user.passwordHash;
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
    const newHash = hashPassword(password);
    user.passwordHash = newHash;
    await user.save();
    return true;
  }

  return false;
}

export async function updateAdminPassword(username: string, newPassword: string): Promise<boolean> {
  await initDb();
  const conn = await connectToDatabase();
  const newHash = hashPassword(newPassword);

  if (!conn) {
    inMemoryAdminPasswordHash = newHash;
    return true;
  }

  const res = await AdminUser.updateOne({ username }, { passwordHash: newHash });
  return res.modifiedCount > 0;
}

// Data Access Queries

export async function getAllTracks(): Promise<Track[]> {
  await initDb();
  const conn = await connectToDatabase();

  if (!conn) {
    return inMemoryTracks;
  }

  let tracks = await TrackModel.find({}).lean();
  if (!tracks || tracks.length === 0) {
    await resetAndSeedDatabase();
    tracks = await TrackModel.find({}).lean();
  }

  if (!tracks || tracks.length === 0) {
    return initialTracks;
  }

  return tracks.map((t: any) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    roadmapStartDate: t.roadmapStartDate,
    targetDays: t.targetDays,
    sections: (t.sections || []).map((sec: any) => ({
      id: sec.id,
      topic: sec.topic,
      sectionTitle: sec.sectionTitle,
      startDate: sec.startDate,
      endDate: sec.endDate,
      originalWeightDays: sec.originalWeightDays,
      subsections: (sec.subsections || []).map((sub: any) => ({
        id: sub.id,
        title: sub.title,
        questions: (sub.questions || [])
          .filter((q: any) => q.status === 'approved' || !q.status)
          .map((q: any) => ({
            id: q.id,
            title: q.title,
            completed: Boolean(q.completed),
            difficulty: q.difficulty as Difficulty,
            url: q.url || undefined,
            notes: q.notes || undefined,
            custom: Boolean(q.custom),
          })),
      })),
    })),
  }));
}

export async function getPendingQuestions(): Promise<any[]> {
  await initDb();
  const conn = await connectToDatabase();
  if (!conn) {
    return inMemoryPending;
  }

  const questions = await PendingQuestionModel.find({}).sort({ submittedAt: -1 }).lean();
  return questions.map((q: any) => ({
    id: q.id,
    title: q.title,
    difficulty: q.difficulty,
    url: q.url,
    notes: q.notes,
    submitted_at: q.submittedAt,
    subsection_title: q.subsectionTitle,
    subsection_id: q.subsectionId,
    parent_topic: q.parentTopic,
    section_id: q.sectionId,
    track_title: q.trackTitle || 'Roadmap Track',
    track_id: q.trackId,
  }));
}

export async function submitQuestionForApproval(data: {
  trackId?: string;
  sectionId?: string;
  newTopicName?: string;
  subsectionTitle: string;
  title: string;
  difficulty: Difficulty;
  url?: string;
  notes?: string;
}): Promise<string> {
  await initDb();
  const conn = await connectToDatabase();

  const qId = `q-pending-${Date.now()}`;
  const trackId = data.trackId || 'dsa';
  let parentTopic = data.newTopicName || 'General';
  let sectionId = data.sectionId;

  if (conn) {
    const track = await TrackModel.findOne({ id: trackId });
    if (track && sectionId) {
      const sec = track.sections.find((s: any) => s.id === sectionId);
      if (sec) parentTopic = sec.topic;
    }

    await PendingQuestionModel.create({
      id: qId,
      trackId,
      trackTitle: track?.title || 'Roadmap Track',
      sectionId,
      parentTopic,
      subsectionId: `sub-pending-${Date.now()}`,
      subsectionTitle: data.subsectionTitle,
      title: data.title,
      difficulty: data.difficulty,
      url: data.url || null,
      notes: data.notes || null,
      submittedAt: new Date().toISOString(),
    });
  } else {
    inMemoryPending.push({
      id: qId,
      track_id: trackId,
      track_title: 'Roadmap Track',
      section_id: sectionId,
      parent_topic: parentTopic,
      subsection_title: data.subsectionTitle,
      title: data.title,
      difficulty: data.difficulty,
      url: data.url,
      notes: data.notes,
      submitted_at: new Date().toISOString(),
    });
  }

  return qId;
}

export async function approveQuestion(questionId: string): Promise<void> {
  await initDb();
  const conn = await connectToDatabase();

  if (!conn) {
    const pIdx = inMemoryPending.findIndex((q) => q.id === questionId);
    if (pIdx !== -1) {
      const pending = inMemoryPending[pIdx];
      inMemoryPending.splice(pIdx, 1);
      const track = inMemoryTracks.find((t) => t.id === pending.track_id) || inMemoryTracks[0];
      let sec = track.sections.find((s) => s.topic === pending.parent_topic);
      if (!sec) {
        sec = {
          id: `sec-custom-${Date.now()}`,
          topic: pending.parent_topic,
          startDate: 'TBD',
          endDate: 'TBD',
          originalWeightDays: 5,
          subsections: [],
        };
        track.sections.push(sec);
      }
      let sub = sec.subsections.find((sb) => sb.title === pending.subsection_title);
      if (!sub) {
        sub = {
          id: `sub-custom-${Date.now()}`,
          title: pending.subsection_title,
          questions: [],
        };
        sec.subsections.push(sub);
      }
      sub.questions.push({
        id: `q-approved-${Date.now()}`,
        title: pending.title,
        completed: false,
        difficulty: pending.difficulty,
        url: pending.url,
        notes: pending.notes,
        custom: true,
      });
    }
    return;
  }

  const pending = await PendingQuestionModel.findOne({ id: questionId });
  if (!pending) return;

  const track = await TrackModel.findOne({ id: pending.trackId });
  if (track) {
    let sec = track.sections.find((s: any) => s.id === pending.sectionId || s.topic === pending.parentTopic);
    if (!sec) {
      sec = {
        id: `sec-custom-${Date.now()}`,
        topic: pending.parentTopic,
        sectionTitle: pending.parentTopic,
        startDate: 'TBD',
        endDate: 'TBD',
        originalWeightDays: 5,
        subsections: [],
      };
      track.sections.push(sec);
    }

    let sub = sec.subsections.find((sb: any) => sb.title === pending.subsectionTitle);
    if (!sub) {
      sub = {
        id: `sub-custom-${Date.now()}`,
        title: pending.subsectionTitle,
        questions: [],
      };
      sec.subsections.push(sub);
    }

    sub.questions.push({
      id: `q-approved-${Date.now()}`,
      title: pending.title,
      completed: false,
      difficulty: pending.difficulty,
      url: pending.url || undefined,
      notes: pending.notes || undefined,
      custom: true,
      status: 'approved',
      submittedAt: new Date().toISOString(),
    });

    await track.save();
  }

  await PendingQuestionModel.deleteOne({ id: questionId });
}

export async function rejectQuestion(questionId: string): Promise<void> {
  await initDb();
  const conn = await connectToDatabase();
  if (!conn) {
    inMemoryPending = inMemoryPending.filter((q) => q.id !== questionId);
    return;
  }
  await PendingQuestionModel.deleteOne({ id: questionId });
}

export async function toggleQuestionCompletion(questionId: string): Promise<void> {
  await initDb();
  const conn = await connectToDatabase();
  if (!conn) return;

  const tracks = await TrackModel.find({});
  for (const track of tracks) {
    let updated = false;
    for (const sec of track.sections) {
      for (const sub of sec.subsections) {
        for (const q of sub.questions) {
          if (q.id === questionId) {
            q.completed = !q.completed;
            updated = true;
            break;
          }
        }
        if (updated) break;
      }
      if (updated) break;
    }
    if (updated) {
      await track.save();
      break;
    }
  }
}

export async function updateQuestionNotes(questionId: string, notes: string): Promise<void> {
  await initDb();
  const conn = await connectToDatabase();
  if (!conn) return;

  const tracks = await TrackModel.find({});
  for (const track of tracks) {
    let updated = false;
    for (const sec of track.sections) {
      for (const sub of sec.subsections) {
        for (const q of sub.questions) {
          if (q.id === questionId) {
            q.notes = notes;
            updated = true;
            break;
          }
        }
        if (updated) break;
      }
      if (updated) break;
    }
    if (updated) {
      await track.save();
      break;
    }
  }
}

export async function updateSectionDates(sectionId: string, startDate: string, endDate: string): Promise<void> {
  await initDb();
  const conn = await connectToDatabase();
  if (!conn) return;

  const track = await TrackModel.findOne({ 'sections.id': sectionId });
  if (track) {
    const sec = track.sections.find((s: any) => s.id === sectionId);
    if (sec) {
      sec.startDate = startDate;
      sec.endDate = endDate;
      await track.save();
    }
  }
}

export async function updateTrackTimelineSettings(
  trackId: string,
  roadmapStartDate?: string,
  targetDays?: number,
  sections?: Section[]
): Promise<void> {
  await initDb();
  const conn = await connectToDatabase();
  if (!conn) return;

  const track = await TrackModel.findOne({ id: trackId });
  if (track) {
    if (roadmapStartDate !== undefined) track.roadmapStartDate = roadmapStartDate;
    if (targetDays !== undefined) track.targetDays = targetDays;

    if (sections && Array.isArray(sections) && sections.length > 0) {
      for (const updatedSec of sections) {
        const sec = track.sections.find((s: any) => s.id === updatedSec.id);
        if (sec) {
          sec.startDate = updatedSec.startDate;
          sec.endDate = updatedSec.endDate;
        }
      }
    }
    await track.save();
  }
}

export async function addSectionToTrack(
  trackId: string,
  data: {
    topic: string;
    sectionTitle?: string;
    startDate: string;
    endDate: string;
    initialSubsections?: string[];
  }
): Promise<string> {
  await initDb();
  const conn = await connectToDatabase();

  const secId = `sec-custom-${Date.now()}`;
  const initialSubs = data.initialSubsections || ['General'];
  const newSubsections = initialSubs.map((st) => ({
    id: `sub-custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: st,
    questions: [],
  }));

  const newSection = {
    id: secId,
    topic: data.topic,
    sectionTitle: data.sectionTitle || data.topic,
    startDate: data.startDate,
    endDate: data.endDate,
    originalWeightDays: 5,
    subsections: newSubsections,
  };

  if (!conn) {
    const track = inMemoryTracks.find((t) => t.id === trackId);
    if (track) {
      track.sections.push(newSection);
    }
    return secId;
  }

  const track = await TrackModel.findOne({ id: trackId });
  if (!track) {
    throw new Error(`Track with ID "${trackId}" not found`);
  }

  track.sections.push(newSection);
  await track.save();
  return secId;
}

export async function deleteSectionFromTrack(sectionId: string): Promise<void> {
  await initDb();
  const conn = await connectToDatabase();
  if (!conn) {
    for (const track of inMemoryTracks) {
      track.sections = track.sections.filter((s) => s.id !== sectionId);
    }
    return;
  }

  const track = await TrackModel.findOne({ 'sections.id': sectionId });
  if (track) {
    track.sections = track.sections.filter((s: any) => s.id !== sectionId);
    await track.save();
  }
}

export async function deleteSubsectionFromSection(subsectionId: string): Promise<void> {
  await initDb();
  const conn = await connectToDatabase();
  if (!conn) {
    for (const track of inMemoryTracks) {
      for (const sec of track.sections) {
        sec.subsections = sec.subsections.filter((sub) => sub.id !== subsectionId);
      }
    }
    return;
  }

  const track = await TrackModel.findOne({ 'sections.subsections.id': subsectionId });
  if (track) {
    for (const sec of track.sections) {
      sec.subsections = sec.subsections.filter((sub: any) => sub.id !== subsectionId);
    }
    await track.save();
  }
}

export async function createNewTrack(title: string, description: string): Promise<string> {
  await initDb();
  const conn = await connectToDatabase();
  const trackId = `track-${Date.now()}`;

  const newTrack = {
    id: trackId,
    title,
    description,
    roadmapStartDate: new Date().toISOString().slice(0, 10),
    targetDays: 60,
    sections: [
      {
        id: `sec-${Date.now()}`,
        topic: 'Getting Started',
        sectionTitle: 'Getting Started',
        startDate: 'TBD',
        endDate: 'TBD',
        originalWeightDays: 7,
        subsections: [
          {
            id: `sub-${Date.now()}`,
            title: 'General Questions',
            questions: [],
          },
        ],
      },
    ],
  };

  if (!conn) {
    inMemoryTracks.push(newTrack);
    return trackId;
  }

  await TrackModel.create(newTrack);
  return trackId;
}

export async function deleteTrack(trackId: string): Promise<void> {
  await initDb();
  const conn = await connectToDatabase();
  if (!conn) {
    inMemoryTracks = inMemoryTracks.filter((t) => t.id !== trackId);
    return;
  }

  await TrackModel.deleteOne({ id: trackId });
}
