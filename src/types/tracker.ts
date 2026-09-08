export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  title: string;
  completed: boolean;
  difficulty: Difficulty;
  url?: string;
  notes?: string;
  custom?: boolean;
}

export interface Subsection {
  id: string;
  title: string;
  questions: Question[];
}

export interface Section {
  id: string;
  topic: string;              // Main topic title e.g. "Arrays", "Graphs", "Solid Principles"
  sectionTitle?: string;       // Sub-heading or details
  startDate: string;          // e.g. "04 Sep"
  endDate: string;            // e.g. "10 Sep"
  originalWeightDays: number; // Document complexity weight in days (out of 90)
  subsections: Subsection[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  roadmapStartDate?: string; // e.g. '2026-09-03'
  targetDays?: number;      // e.g. 30, 60, 90, 160
  sections: Section[];
}

export type FilterStatus = 'all' | 'pending' | 'completed' | 'custom';
export type FilterDifficulty = 'all' | 'Easy' | 'Medium' | 'Hard';
