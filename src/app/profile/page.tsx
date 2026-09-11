'use client';

import React, { useState, useEffect } from 'react';
import { Track, Section } from '@/types/tracker';
import { Header } from '@/components/Header';
import { Heatmap, HeatmapItem } from '@/components/Heatmap';
import { AuthModal } from '@/components/AuthModal';
import { InitialLoader } from '@/components/InitialLoader';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { 
  User, 
  BookOpen, 
  ShieldCheck, 
  LogOut, 
  Key, 
  PieChart, 
  ArrowLeft, 
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { apiClient, clearAuthToken } from '@/lib/apiClient';

const LOCAL_PROGRESS_KEY = 'planly_user_progress_v1';
const GUEST_TIMESTAMPS_KEY = 'planly_guest_completed_timestamps_v1';

export default function ProfilePage() {
  const { showToast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string>('dsa');
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; role: string } | null>(null);

  // Modals & Heatmap State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [heatmapData, setHeatmapData] = useState<HeatmapItem[]>([]);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);

  const checkAuthStatus = async () => {
    try {
      const res = await apiClient('/api/auth/check-auth');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
          return data.user;
        }
      }
    } catch (e) {
      console.error('Failed to check auth status:', e);
    }
    setCurrentUser(null);
    return null;
  };

  const fetchHeatmapData = async (user = currentUser, year = selectedYear) => {
    if (user) {
      try {
        const res = await apiClient(`/api/questions/heatmap?year=${year}`);
        if (res.ok) {
          const data = await res.json();
          setHeatmapData(data.heatmap || []);
          setTotalCompleted(data.totalCompleted || 0);
          setCurrentStreak(data.currentStreak || 0);
          setLongestStreak(data.longestStreak || 0);
          return;
        }
      } catch (e) {
        console.error('Failed to fetch heatmap from API:', e);
      }
    }

    // Guest mode fallback calculation
    try {
      const rawProgress = localStorage.getItem(LOCAL_PROGRESS_KEY);
      const progress: Record<string, boolean> = rawProgress ? JSON.parse(rawProgress) : {};
      const rawTimestamps = localStorage.getItem(GUEST_TIMESTAMPS_KEY);
      const timestamps: Record<string, string> = rawTimestamps ? JSON.parse(rawTimestamps) : {};

      const dailyCounts: Record<string, number> = {};
      let total = 0;

      Object.entries(progress).forEach(([qId, completed]) => {
        if (completed) {
          total++;
          const dateStr = timestamps[qId] || new Date().toISOString().slice(0, 10);
          dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
        }
      });

      const sortedDates = Object.keys(dailyCounts).sort();
      let cStreak = 0;
      let lStreak = 0;
      let tempStreak = 0;

      const todayStr = new Date().toISOString().slice(0, 10);
      const yesterdayObj = new Date();
      yesterdayObj.setDate(yesterdayObj.getDate() - 1);
      const yesterdayStr = yesterdayObj.toISOString().slice(0, 10);

      if (sortedDates.length > 0) {
        tempStreak = 1;
        lStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const prev = new Date(sortedDates[i - 1]);
          const curr = new Date(sortedDates[i]);
          const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            tempStreak++;
          } else if (diffDays > 1) {
            tempStreak = 1;
          }
          if (tempStreak > lStreak) {
            lStreak = tempStreak;
          }
        }

        let checkDate = new Date();
        if (!dailyCounts[todayStr] && dailyCounts[yesterdayStr]) {
          checkDate = yesterdayObj;
        }
        while (true) {
          const dStr = checkDate.toISOString().slice(0, 10);
          if (dailyCounts[dStr]) {
            cStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }

      const items: HeatmapItem[] = [];
      const startDate = new Date(Date.UTC(year, 0, 1));
      const endDate = new Date(Date.UTC(year, 11, 31));

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().slice(0, 10);
        const count = dailyCounts[dateStr] || 0;
        let level = 0;
        if (count >= 7) level = 4;
        else if (count >= 5) level = 3;
        else if (count >= 3) level = 2;
        else if (count >= 1) level = 1;

        items.push({ date: dateStr, count, level, questions: [] });
      }

      setHeatmapData(items);
      setTotalCompleted(total);
      setCurrentStreak(cStreak);
      setLongestStreak(lStreak);
    } catch (err) {
      console.error('Failed to calculate guest heatmap:', err);
    }
  };

  const loadData = async () => {
    setIsLoaded(false);
    try {
      const user = await checkAuthStatus();
      await fetchHeatmapData(user, selectedYear);

      const res = await apiClient('/api/tracks');
      const tracksData: Track[] = await res.json();

      if (Array.isArray(tracksData)) {
        // Fetch sections for all tracks to calculate comprehensive stats
        const fullTracks = await Promise.all(
          tracksData.map(async (t) => {
            try {
              const secRes = await apiClient(`/api/tracks/${t.id}/sections`);
              const sections: Section[] = await secRes.json();

              let savedProgress: Record<string, boolean> = {};
              if (!user) {
                try {
                  const raw = localStorage.getItem(LOCAL_PROGRESS_KEY);
                  if (raw) savedProgress = JSON.parse(raw);
                } catch (err) {}
              }

              const updatedSections = (Array.isArray(sections) ? sections : []).map((sec) => ({
                ...sec,
                subsections: sec.subsections.map((sub) => ({
                  ...sub,
                  questions: sub.questions.map((q) => ({
                    ...q,
                    completed: !user && savedProgress[q.id] !== undefined ? savedProgress[q.id] : q.completed,
                  })),
                })),
              }));

              return { ...t, sections: updatedSections };
            } catch (err) {
              return t;
            }
          })
        );
        setTracks(fullTracks);
      }
    } catch (e) {
      console.error('Error loading profile page data:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const handleLogout = async () => {
    try {
      await apiClient('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    clearAuthToken();
    setCurrentUser(null);
    showToast('Signed out. Continuing as guest.', 'info');
    await loadData();
  };

  if (!isLoaded) {
    return (
      <InitialLoader 
        title="Planly Profile" 
        subtitle="Loading activity heatmap and all tracks statistics..." 
      />
    );
  }

  const initials = currentUser
    ? currentUser.username.slice(0, 2).toUpperCase()
    : 'GS';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      
      {/* Header Navbar */}
      <Header
        tracks={tracks}
        activeTrackId={activeTrackId}
        onSelectTrack={(id) => (window.location.href = `/?track=${id}`)}
        onOpenAddQuestion={() => (window.location.href = '/')}
        searchQuery=""
        onSearchChange={() => {}}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenProfileModal={() => {}}
        currentStreak={currentStreak}
      />

      {/* Main Profile View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-6">
        
        {/* Navigation Back Button & Profile Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-2xl transition-colors cursor-pointer"
              title="Back to Roadmap Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {currentUser ? currentUser.username : 'Guest Mode Profile'}
                </h1>
                {currentUser?.role === 'ADMIN' ? (
                  <span className="px-3 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 rounded-full">
                    ADMIN
                  </span>
                ) : currentUser ? (
                  <span className="px-3 py-0.5 text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 rounded-full">
                    USER
                  </span>
                ) : (
                  <span className="px-3 py-0.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                    GUEST
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentUser ? 'Personalized Preparation Profile' : 'Local Browser Mode (Progress saved in browser)'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {currentUser && (
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>Change Password</span>
              </button>
            )}

            {currentUser?.role === 'ADMIN' && (
              <a
                href="/admin"
                className="px-4 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 rounded-xl transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </a>
            )}

            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Activity Heatmap, Year Picker & Daily Completed Feed */}
        <Heatmap
          heatmapData={heatmapData}
          totalCompleted={totalCompleted}
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          selectedYear={selectedYear}
          onYearChange={(yr) => setSelectedYear(yr)}
        />

        {/* Section 2: All Tracks Statistics Breakdown */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              <span>Statistics for All Syllabus Tracks ({tracks.length})</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Per-track solved questions breakdown</span>
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
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xs hover:shadow-xs transition-all"
                >
                  {/* Track Title */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                        <BookOpen className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {track.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {track.sections?.length || 0} Syllabus Topics • {track.targetDays || 90} Days Target
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 text-xs font-extrabold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-full border border-teal-200 dark:border-teal-500/20">
                      {trackPercentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>Overall Progress</span>
                      <span>{trackCompleted} / {trackTotal} Questions Solved</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full transition-all duration-500 rounded-full"
                        style={{ width: `${trackPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Difficulty Breakdown Grid */}
                  <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                    <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl p-2">
                      <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Easy</div>
                      <div className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                        {easyCompleted}<span className="text-xs text-emerald-600/70 font-normal">/{easyCount}</span>
                      </div>
                    </div>

                    <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl p-2">
                      <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">Medium</div>
                      <div className="text-sm font-extrabold text-amber-900 dark:text-amber-200">
                        {mediumCompleted}<span className="text-xs text-amber-600/70 font-normal">/{mediumCount}</span>
                      </div>
                    </div>

                    <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40 rounded-xl p-2">
                      <div className="text-xs font-semibold text-rose-700 dark:text-rose-400">Hard</div>
                      <div className="text-sm font-extrabold text-rose-900 dark:text-rose-200">
                        {hardCompleted}<span className="text-xs text-rose-600/70 font-normal">/{hardCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6 w-full gap-2 border-t border-slate-200 dark:border-slate-800/60">
        <span>Planly — Interview Preparation Tracker</span>
        <a
          href="/admin"
          className="text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Portal Login</span>
        </a>
      </footer>

      {/* User Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => loadData()}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        username={currentUser?.username || ''}
      />
    </div>
  );
}
