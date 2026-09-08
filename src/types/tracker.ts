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
  topic?: string;
  sectionTitle: string;
  startDate: string; // Formatted 'YYYY-MM-DD' or '04 Sep'
  endDate: string;   // Formatted 'YYYY-MM-DD' or '07 Sep'
  subsections: Subsection[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  roadmapStartDate?: string; // e.g. '2026-09-08'
  targetDays?: number;      // e.g. 30, 60, 90, 160
  sections: Section[];
}

export type FilterStatus = 'all' | 'pending' | 'completed' | 'custom';
export type FilterDifficulty = 'all' | 'Easy' | 'Medium' | 'Hard';
