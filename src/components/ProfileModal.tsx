'use client';

import React, { useState } from 'react';
import { Track } from '@/types/tracker';
import { Heatmap, HeatmapItem } from './Heatmap';
import { 
  X, 
  User, 
  BookOpen, 
  ShieldCheck, 
  LogOut, 
  Key, 
  PieChart, 
  CheckCircle2, 
  LogIn,
  Layers,
  Sparkles
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { id: string; username: string; role: string } | null;
  tracks: Track[];
  heatmapData: HeatmapItem[];
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  onLogout: () => void;
  onOpenChangePassword?: () => void;
  onOpenAuthModal: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  tracks,
  heatmapData,
  totalCompleted,
  currentStreak,
  longestStreak,
  onLogout,
  onOpenChangePassword,
  onOpenAuthModal,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  if (!isOpen) return null;

  const initials = currentUser
    ? currentUser.username.slice(0, 2).toUpperCase()
    : 'GS';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-4xl shadow-2xl space-y-6 my-8 text-slate-900 dark:text-slate-100">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentUser ? currentUser.username : 'Guest User Profile'}
                </h2>
                {currentUser?.role === 'ADMIN' ? (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 rounded-full">
                    ADMIN
                  </span>
                ) : currentUser ? (
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 rounded-full">
                    USER
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                    GUEST MODE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Overall Interview Preparation Dashboard & Track Statistics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Section 1: Activity Heatmap & Streaks */}
        <div className="space-y-3">
          <Heatmap
            heatmapData={heatmapData}
            totalCompleted={totalCompleted}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            selectedYear={selectedYear}
            onYearChange={(yr) => setSelectedYear(yr)}
          />
        </div>

        {/* Section 2: All Tracks Statistics Breakdown */}
        <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              <span>Statistics for All Syllabus Tracks ({tracks.length})</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Per-track solved questions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tracks.map((track) => {
              const allTrackQuestions = (track.sections || []).flatMap((s) =>
                (s.subsections || []).flatMap((sub) => sub.questions || [])
              );
              const trackTotal = allTrackQuestions.length;
              const trackCompleted = allTrackQuestions.filter((q) => q.completed).length;
              const trackPercentage = trackTotal > 0 ? Math.round((trackCompleted / trackTotal) * 100) : 0;

              const easyCount = allTrackQuestions.filter((q) => q.difficulty === 'Easy').length;
              const easyCompleted = allTrackQuestions.filter((q) => q.difficulty === 'Easy' && q.completed).length;

              const mediumCount = allTrackQuestions.filter((q) => q.difficulty === 'Medium').length;
              const mediumCompleted = allTrackQuestions.filter((q) => q.difficulty === 'Medium' && q.completed).length;

              const hardCount = allTrackQuestions.filter((q) => q.difficulty === 'Hard').length;
              const hardCompleted = allTrackQuestions.filter((q) => q.difficulty === 'Hard' && q.completed).length;

              return (
                <div
                  key={track.id}
                  className="bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-2xs hover:shadow-xs transition-all"
                >
                  {/* Track Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg">
                        <BookOpen className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {track.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {track.sections?.length || 0} Topics | {track.targetDays || 90} Days Plan
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-full border border-teal-200 dark:border-teal-500/20">
                      {trackPercentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>Track Completion</span>
                      <span>{trackCompleted} / {trackTotal} Solved</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full transition-all duration-500 rounded-full"
                        style={{ width: `${trackPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Difficulty Breakdown Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl p-1.5">
                      <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">Easy</div>
                      <div className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">
                        {easyCompleted}<span className="text-[10px] text-emerald-600/70 font-normal">/{easyCount}</span>
                      </div>
                    </div>

                    <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-1.5">
                      <div className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">Medium</div>
                      <div className="text-xs font-extrabold text-amber-900 dark:text-amber-200">
                        {mediumCompleted}<span className="text-[10px] text-amber-600/70 font-normal">/{mediumCount}</span>
                      </div>
                    </div>

                    <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 rounded-xl p-1.5">
                      <div className="text-[10px] font-semibold text-rose-700 dark:text-rose-400">Hard</div>
                      <div className="text-xs font-extrabold text-rose-900 dark:text-rose-200">
                        {hardCompleted}<span className="text-[10px] text-rose-600/70 font-normal">/{hardCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            {currentUser && onOpenChangePassword && (
              <button
                onClick={() => {
                  onClose();
                  onOpenChangePassword();
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </button>
            )}

            {!currentUser && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Sync Across Devices</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentUser?.role === 'ADMIN' && (
              <a
                href="/admin"
                className="px-3.5 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 rounded-xl transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </a>
            )}

            {currentUser && (
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="px-4 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
