'use client';

import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Trophy, 
  CheckCircle2, 
  Calendar, 
  ExternalLink, 
  ChevronDown, 
  BookOpen, 
  ListFilter 
} from 'lucide-react';

export interface CompletedQuestionDetail {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url?: string;
  topic?: string;
  trackTitle?: string;
  completedAt?: string;
}

export interface HeatmapItem {
  date: string;
  count: number;
  level: number;
  questions?: CompletedQuestionDetail[];
}

interface HeatmapProps {
  heatmapData: HeatmapItem[];
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  selectedYear: number;
  onYearChange: (year: number) => void;
  isLoading?: boolean;
}

export const Heatmap: React.FC<HeatmapProps> = ({
  heatmapData,
  totalCompleted,
  currentStreak,
  longestStreak,
  selectedYear,
  onYearChange,
  isLoading = false,
}) => {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // Dynamically generated Available Years (from current year down to 2023)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2023;
    const years: number[] = [];
    for (let y = Math.max(currentYear, 2026); y >= startYear; y--) {
      years.push(y);
    }
    return years;
  }, []);

  // Group 365 heatmap items into padded 7-day week columns (Monday to Sunday)
  const weeks = useMemo(() => {
    const itemsMap = new Map<string, HeatmapItem>();
    if (heatmapData && heatmapData.length > 0) {
      heatmapData.forEach((item) => itemsMap.set(item.date, item));
    }

    const allDays: (HeatmapItem | null)[] = [];
    const startOfYear = new Date(Date.UTC(selectedYear, 0, 1));
    const endOfYear = new Date(Date.UTC(selectedYear, 11, 31));

    // Determine weekday of Jan 1 (0 = Mon, 1 = Tue, ..., 6 = Sun)
    const jan1DayOfWeek = (startOfYear.getUTCDay() + 6) % 7;

    // Pad week 0 with null items for days before Jan 1
    for (let p = 0; p < jan1DayOfWeek; p++) {
      allDays.push(null);
    }

    // Add all days of selectedYear
    for (let d = new Date(startOfYear); d <= endOfYear; d.setUTCDate(d.getUTCDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      const existing = itemsMap.get(dateStr);
      if (existing) {
        allDays.push(existing);
      } else {
        allDays.push({
          date: dateStr,
          count: 0,
          level: 0,
          questions: [],
        });
      }
    }

    // Pad last week to complete 7 days if needed
    while (allDays.length % 7 !== 0) {
      allDays.push(null);
    }

    // Chunk into 7-day columns
    const chunked: (HeatmapItem | null)[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      chunked.push(allDays.slice(i, i + 7));
    }

    return chunked;
  }, [heatmapData, selectedYear]);

  // Precise Month Column Alignment calculation
  const monthHeaders = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const headers: { monthName: string; colIndex: number }[] = [];
    const monthSeen = new Set<number>();

    weeks.forEach((week, weekIdx) => {
      for (const item of week) {
        if (item && item.date) {
          const parts = item.date.split('-');
          if (parts.length === 3) {
            const m = parseInt(parts[1], 10) - 1;
            if (!monthSeen.has(m)) {
              monthSeen.add(m);
              headers.push({
                monthName: months[m],
                colIndex: weekIdx,
              });
            }
          }
        }
      }
    });

    return headers;
  }, [weeks]);

  // Find currently selected day item and questions
  const selectedDayItem = useMemo(() => {
    return heatmapData.find((item) => item.date === selectedDate) || {
      date: selectedDate,
      count: 0,
      level: 0,
      questions: [],
    };
  }, [heatmapData, selectedDate]);

  const levelClasses = [
    'bg-slate-100 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/40', // Level 0: 0
    'bg-teal-200 dark:bg-teal-900/60 border-teal-300 dark:border-teal-800/80 text-teal-900 dark:text-teal-200', // Level 1: 1-2
    'bg-teal-400 dark:bg-teal-700 border-teal-400 dark:border-teal-600 text-white', // Level 2: 3-4
    'bg-teal-600 dark:bg-teal-500 border-teal-600 dark:border-teal-400 text-white', // Level 3: 5-6
    'bg-teal-500 dark:bg-teal-400 border-teal-400 dark:border-teal-300 shadow-xs text-white', // Level 4: 7+
  ];

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
  };

  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
        return d.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {}
    return dateStr;
  };

  return (
    <div className="space-y-5">
      {/* Top Streak Stats Row */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Total Solved */}
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Solved</div>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {totalCompleted}
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <Flame className="w-5 h-5 fill-current animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Current Streak</div>
            <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
              {currentStreak} <span className="text-xs font-normal text-slate-400">days</span>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-3">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Longest Streak</div>
            <div className="text-lg font-extrabold text-purple-600 dark:text-purple-400">
              {longestStreak} <span className="text-xs font-normal text-slate-400">days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Heatmap Controls Header (Year Selector & Title) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Activity Heatmap ({selectedYear})
            </h4>
          </div>

          {/* Year Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Year:</span>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="appearance-none pl-3 pr-7 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Unified CSS Grid Heatmap (Responsive & Screen-Size Proof) */}
        <div className="overflow-x-auto no-scrollbar pb-1">
          <div className="min-w-[840px] w-full">
            <div 
              className="grid gap-1.5 items-center w-full"
              style={{
                gridTemplateColumns: `auto repeat(${weeks.length}, minmax(0, 1fr))`,
                gridTemplateRows: `auto repeat(7, minmax(0, 1fr))`,
              }}
            >
              {/* Month Header Labels (Row 1) */}
              {monthHeaders.map((hdr, i) => (
                <div
                  key={`month-${i}`}
                  className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 select-none pb-1.5 whitespace-nowrap"
                  style={{
                    gridColumn: `${hdr.colIndex + 2} / span 3`,
                    gridRow: 1,
                  }}
                >
                  {hdr.monthName}
                </div>
              ))}

              {/* Weekday Labels (Column 1, Rows 2 to 8) */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, rIdx) => (
                <div
                  key={`day-label-${rIdx}`}
                  className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 select-none pr-2.5 flex items-center justify-end h-full min-h-[14px]"
                  style={{
                    gridColumn: 1,
                    gridRow: rIdx + 2,
                  }}
                >
                  {dayName}
                </div>
              ))}

              {/* Day Squares (Columns 2 to 54, Rows 2 to 8) */}
              {weeks.map((week, wIdx) =>
                week.map((item, rIdx) => {
                  const colNum = wIdx + 2;
                  const rowNum = rIdx + 2;

                  if (!item || !item.date) {
                    return (
                      <div
                        key={`pad-${wIdx}-${rIdx}`}
                        className="w-full aspect-square min-w-[12px] min-h-[12px] max-w-[18px] max-h-[18px] rounded-[3px] opacity-0 pointer-events-none mx-auto"
                        style={{
                          gridColumn: colNum,
                          gridRow: rowNum,
                        }}
                      />
                    );
                  }

                  const isSelected = item.date === selectedDate;
                  return (
                    <div
                      key={item.date}
                      onClick={() => setSelectedDate(item.date)}
                      onMouseEnter={() => setHoveredDay({ date: item.date, count: item.count })}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-full aspect-square min-w-[12px] min-h-[12px] max-w-[18px] max-h-[18px] rounded-[3px] border transition-all duration-150 transform hover:scale-125 cursor-pointer mx-auto ${
                        levelClasses[item.level] || levelClasses[0]
                      } ${
                        isSelected
                          ? 'ring-2 ring-teal-500 ring-offset-1 dark:ring-offset-slate-900 scale-125 z-10'
                          : ''
                      }`}
                      style={{
                        gridColumn: colNum,
                        gridRow: rowNum,
                      }}
                      title={`${item.count} questions on ${formatDateLabel(item.date)}`}
                    />
                  );
                })
              )}
            </div>

            {/* Legend & Hover Info */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="font-medium">
                {hoveredDay ? (
                  <span>
                    <strong className="text-slate-900 dark:text-slate-100">{hoveredDay.count}</strong> question{hoveredDay.count === 1 ? '' : 's'} on {formatDateLabel(hoveredDay.date)}
                  </span>
                ) : (
                  <span>Click any date square to view completed questions feed</span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <span>Less</span>
                {levelClasses.map((cls, idx) => (
                  <span
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-[2.5px] border ${cls}`}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Daily Completed Questions & Topics Feed */}
      <div className="bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Completed Topics & Questions on {formatDateLabel(selectedDate)}
            </h4>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-bold bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 rounded-full">
            {selectedDayItem.questions?.length || selectedDayItem.count || 0} Solved
          </span>
        </div>

        {selectedDayItem.questions && selectedDayItem.questions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {selectedDayItem.questions.map((q, idx) => {
              const problemUrl =
                q.url ||
                `https://leetcode.com/problemset/all/?search=${encodeURIComponent(q.title)}`;

              return (
                <div
                  key={q.id || idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:border-teal-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <a
                      href={problemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 hover:underline flex items-center gap-1.5 truncate"
                    >
                      <span className="truncate">{q.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                    </a>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {q.topic || 'General Topic'}
                      </span>
                      <span>•</span>
                      <span>{q.trackTitle || 'Roadmap'}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 ${
                      difficultyColors[q.difficulty] || difficultyColors.Medium
                    }`}
                  >
                    {q.difficulty}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 space-y-1">
            <BookOpen className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto mb-1" />
            <p className="font-semibold text-slate-500 dark:text-slate-400">
              No questions recorded as completed on {formatDateLabel(selectedDate)}.
            </p>
            <p className="text-slate-400 text-[11px]">
              Mark questions as complete on this date in your syllabus to see them appear here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
