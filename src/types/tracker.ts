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
  startDate: string; // ISO date 'YYYY-MM-DD' or formatted '04 Sep'
  endDate: string;   // ISO date 'YYYY-MM-DD' or formatted '07 Sep'
  subsections: Subsection[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  sections: Section[];
}

export type FilterStatus = 'all' | 'pending' | 'completed' | 'custom';
export type FilterDifficulty = 'all' | 'Easy' | 'Medium' | 'Hard';
