'use client';

import React from 'react';
import { Track, FilterStatus, FilterDifficulty } from '@/types/tracker';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Sparkles, 
  Layers, 
  HelpCircle 
} from 'lucide-react';

interface TimelineHeaderProps {
  track: Track;
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  filterDifficulty: FilterDifficulty;
  onFilterDifficultyChange: (diff: FilterDifficulty) => void;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  track,
  filterStatus,
  onFilterStatusChange,
  filterDifficulty,
  onFilterDifficultyChange,
}) => {
  // Compute total and completed questions
  const allQuestions = track.sections.flatMap((s) =>
    s.subsections.flatMap((sub) => sub.questions)
  );
  const totalCount = allQuestions.length;
  const completedCount = allQuestions.filter((q) => q.completed).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Compute dates range
  const dates = track.sections
    .flatMap((s) => [s.startDate, s.endDate])
    .filter(Boolean);
  
  const earliestDate = dates.length > 0 ? dates.sort()[0] : 'N/A';
  const latestDate = dates.length > 0 ? dates.sort()[dates.length - 1] : 'N/A';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden mb-6">
      {/* Subtle background glow */}
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Track Title and Timeline Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">{track.title}</h2>
            <span className="px-3 py-1 text-xs font-medium bg-slate-800 text-slate-300 rounded-full border border-slate-700">
              {track.sections.length} Sections
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-xl">{track.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Schedule: <strong className="text-slate-200">{earliestDate}</strong> to <strong className="text-slate-200">{latestDate}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Questions: <strong className="text-slate-200">{completedCount}</strong> / {totalCount} completed</span>
            </div>
          </div>
        </div>

        {/* Progress Circular / Bar Display */}
        <div className="flex items-center gap-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 min-w-[280px]">
          <div className="relative flex items-center justify-center w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - percentage / 100)}
                strokeLinecap="round"
                className="text-indigo-500 transition-all duration-700"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-sm font-bold text-white">{percentage}%</span>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Overall Progress</span>
              <span>{completedCount}/{totalCount} Done</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 pt-0.5">
              {percentage === 100 ? '🎉 Track fully completed!' : `${totalCount - completedCount} questions remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filters:</span>
          
          {/* Status Filter buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['all', 'pending', 'completed'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => onFilterStatusChange(status)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Difficulty:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['all', 'Easy', 'Medium', 'Hard'] as FilterDifficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => onFilterDifficultyChange(diff)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                  filterDifficulty === diff
                    ? diff === 'Easy'
                      ? 'bg-emerald-600 text-white'
                      : diff === 'Medium'
                      ? 'bg-amber-600 text-white'
                      : diff === 'Hard'
                      ? 'bg-rose-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
