'use client';

import React, { useState, useEffect } from 'react';
import { Track, FilterStatus, FilterDifficulty } from '@/types/tracker';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Sliders, 
  Check, 
  ChevronRight 
} from 'lucide-react';

interface TimelineHeaderProps {
  track: Track;
  filterStatus: FilterStatus;
  onFilterStatusChange: (status: FilterStatus) => void;
  filterDifficulty: FilterDifficulty;
  onFilterDifficultyChange: (diff: FilterDifficulty) => void;
  onApplyRoadmapTimeline: (targetDays: number, startDateStr: string) => void;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  track,
  filterStatus,
  onFilterStatusChange,
  filterDifficulty,
  onFilterDifficultyChange,
  onApplyRoadmapTimeline,
}) => {
  const [targetDays, setTargetDays] = useState<number>(track.targetDays || 90);
  const [startDateStr, setStartDateStr] = useState<string>(
    track.roadmapStartDate || new Date().toISOString().slice(0, 10)
  );
  const [showTimelinePicker, setShowTimelinePicker] = useState(false);

  useEffect(() => {
    if (track.targetDays) setTargetDays(track.targetDays);
    if (track.roadmapStartDate) setStartDateStr(track.roadmapStartDate);
  }, [track.id, track.targetDays, track.roadmapStartDate]);

  // Compute total and completed questions
  const allQuestions = (track.sections || []).flatMap((s) =>
    (s.subsections || []).flatMap((sub) => sub.questions || [])
  );
  const totalCount = allQuestions.length;
  const completedCount = allQuestions.filter((q) => q.completed).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Compute dates range
  const dates = (track.sections || [])
    .flatMap((s) => [s.startDate, s.endDate])
    .filter(Boolean);
  
  const earliestDate = dates.length > 0 ? dates[0] : 'N/A';
  const latestDate = dates.length > 0 ? dates[dates.length - 1] : 'N/A';

  const handleApplyTimeline = (days: number) => {
    setTargetDays(days);
    onApplyRoadmapTimeline(days, startDateStr);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl overflow-hidden transition-all">
      {/* Background glow */}
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Track Title & Target Duration Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">{track.title}</h2>
            <span className="px-3 py-1 text-xs font-medium bg-slate-800 text-slate-300 rounded-full border border-slate-700">
              {track.sections?.length || 0} Sections
            </span>
          </div>

          <p className="text-sm text-slate-400 max-w-xl">{track.description}</p>

          {/* Timeline Selector Controls */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Target Timeline:
            </span>

            {/* Quick Presets: 30d, 60d, 90d, 120d, 160d */}
            {[30, 60, 90, 120, 160].map((days) => (
              <button
                key={days}
                onClick={() => handleApplyTimeline(days)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  (track.targetDays || targetDays) === days
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-105'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {days} Days
              </button>
            ))}

            <button
              onClick={() => setShowTimelinePicker(!showTimelinePicker)}
              className="px-2.5 py-1 text-xs font-medium bg-slate-800 text-indigo-300 hover:text-indigo-200 rounded-lg border border-slate-700 flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              <span>Custom Date</span>
            </button>
          </div>

          {/* Expanded Custom Date Picker */}
          {showTimelinePicker && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-3 max-w-md mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">
                    Total Duration (Days)
                  </label>
                  <input
                    type="number"
                    min={7}
                    max={365}
                    value={targetDays}
                    onChange={(e) => setTargetDays(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  handleApplyTimeline(targetDays);
                  setShowTimelinePicker(false);
                }}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow flex items-center justify-center gap-1 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                Recalculate Section Dates
              </button>
            </div>
          )}

          {/* Current schedule readout */}
          <div className="text-xs text-slate-400">
            Current Schedule: <strong className="text-slate-200">{earliestDate}</strong> to <strong className="text-slate-200">{latestDate}</strong> ({track.targetDays || 90} Days total)
          </div>
        </div>

        {/* Progress Circular Display */}
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
              <span>Overall Completion</span>
              <span>{completedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 pt-0.5">
              {percentage === 100 ? '🎉 All questions completed!' : `${totalCount - completedCount} questions remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
          
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
