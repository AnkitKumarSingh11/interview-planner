'use client';

import React, { useState, useEffect } from 'react';
import { Track, FilterStatus, FilterDifficulty } from '@/types/tracker';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Sliders, 
  Check, 
  TrendingUp,
  Award,
  CheckCircle2,
  BookOpen,
  PieChart,
  ListTodo
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

  // Compute total, completed and difficulty breakdown
  const allQuestions = (track.sections || []).flatMap((s) =>
    (s.subsections || []).flatMap((sub) => sub.questions || [])
  );
  const totalCount = allQuestions.length;
  const completedCount = allQuestions.filter((q) => q.completed).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const easyCount = allQuestions.filter((q) => q.difficulty === 'Easy').length;
  const easyCompleted = allQuestions.filter((q) => q.difficulty === 'Easy' && q.completed).length;
  const mediumCount = allQuestions.filter((q) => q.difficulty === 'Medium').length;
  const mediumCompleted = allQuestions.filter((q) => q.difficulty === 'Medium' && q.completed).length;
  const hardCount = allQuestions.filter((q) => q.difficulty === 'Hard').length;
  const hardCompleted = allQuestions.filter((q) => q.difficulty === 'Hard' && q.completed).length;

  // Compute schedule dates range
  const dates = (track.sections || [])
    .flatMap((s) => [s.startDate, s.endDate])
    .filter(Boolean);
  
  const earliestDate = dates.length > 0 ? dates[0] : 'Today';
  const latestDate = dates.length > 0 ? dates[dates.length - 1] : 'End Date';

  const handleApplyTimeline = (days: number) => {
    setTargetDays(days);
    onApplyRoadmapTimeline(days, startDateStr);
  };

  return (
    <div className="space-y-5">
      {/* 4 Dashboard Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Solved Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Solved</span>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-full border border-teal-200 dark:border-teal-500/20 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {percentage}%
            </span>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {completedCount} <span className="text-lg font-medium text-slate-400">/ {totalCount}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Keep track of interview problem completion at a glance.
            </p>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Card 2: Active Track Topics (Pastel Teal background matching 'Doctors' card in reference image) */}
        <div className="bg-teal-50/90 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-xl text-teal-700 dark:text-teal-300">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-sm font-semibold text-teal-900 dark:text-teal-200">Active Syllabus</span>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold text-teal-800 dark:text-teal-300 bg-white/80 dark:bg-teal-900/60 rounded-full shadow-xs">
              {track.sections?.length || 0} Topics
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-teal-950 dark:text-white tracking-tight truncate">
              {track.title}
            </div>
            <p className="text-xs text-teal-800/80 dark:text-teal-300/80 mt-1 line-clamp-2">
              {track.description || 'Structured interview preparation roadmap.'}
            </p>
          </div>

          <div className="text-xs font-medium text-teal-700 dark:text-teal-400">
            Current Target: {track.targetDays || 90} Days Schedule
          </div>
        </div>

        {/* Card 3: Target Timeline Schedule */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-purple-600 dark:text-purple-400">
                <Calendar className="w-4 h-4" />
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Schedule Plan</span>
            </div>
            <button
              onClick={() => setShowTimelinePicker(!showTimelinePicker)}
              className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-lg transition-colors cursor-pointer"
              title="Configure timeline"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {track.targetDays || 90} <span className="text-sm font-medium text-slate-500">Days</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {earliestDate} – {latestDate}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
            {[30, 60, 90, 120, 160].map((days) => (
              <button
                key={days}
                onClick={() => handleApplyTimeline(days)}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border transition-all cursor-pointer ${
                  (track.targetDays || targetDays) === days
                    ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        {/* Card 4: Difficulty Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200">
                <PieChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Difficulty Stats</span>
            </div>
            <span className="text-xs text-slate-400">{totalCount - completedCount} Left</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl p-2 text-center">
              <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Easy</div>
              <div className="text-base font-extrabold text-emerald-900 dark:text-emerald-200">
                {easyCompleted}<span className="text-xs text-emerald-600/70 font-normal">/{easyCount}</span>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-2 text-center">
              <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">Medium</div>
              <div className="text-base font-extrabold text-amber-900 dark:text-amber-200">
                {mediumCompleted}<span className="text-xs text-amber-600/70 font-normal">/{mediumCount}</span>
              </div>
            </div>

            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 rounded-xl p-2 text-center">
              <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">Hard</div>
              <div className="text-base font-extrabold text-rose-900 dark:text-rose-200">
                {hardCompleted}<span className="text-xs text-rose-600/70 font-normal">/{hardCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Custom Timeline Modal/Drawer if open */}
      {showTimelinePicker && (
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 max-w-lg shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Customize Track Timeline
            </h4>
            <button 
              onClick={() => setShowTimelinePicker(false)}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Start Date
              </label>
              <input
                type="date"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Duration (Days)
              </label>
              <input
                type="number"
                min={7}
                max={365}
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="w-full mt-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <button
            onClick={() => {
              handleApplyTimeline(targetDays);
              setShowTimelinePicker(false);
            }}
            className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            Recalculate Syllabus Section Dates
          </button>
        </div>
      )}

      {/* Filter Tabs Bar (Status & Difficulty filters) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status:</span>
          
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            {(['all', 'pending', 'completed'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => onFilterStatusChange(status)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  filterStatus === status
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700/50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Difficulty:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            {(['all', 'Easy', 'Medium', 'Hard'] as FilterDifficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => onFilterDifficultyChange(diff)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                  filterDifficulty === diff
                    ? diff === 'Easy'
                      ? 'bg-emerald-600 text-white'
                      : diff === 'Medium'
                      ? 'bg-amber-600 text-white'
                      : diff === 'Hard'
                      ? 'bg-rose-600 text-white'
                      : 'bg-teal-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700/50'
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
