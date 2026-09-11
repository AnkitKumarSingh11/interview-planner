'use client';

import React, { useState, useEffect } from 'react';
import { 
  Track, 
  Section,
  Question, 
  Difficulty, 
  FilterStatus, 
  FilterDifficulty 
} from '@/types/tracker';
import { recalculateTrackTimeline } from '@/utils/timeline';
import { Header } from '@/components/Header';
import { TimelineHeader } from '@/components/TimelineHeader';
import { SectionCard } from '@/components/SectionCard';
import { AddQuestionModal } from '@/components/AddQuestionModal';
import { AuthModal } from '@/components/AuthModal';
import { InitialLoader } from '@/components/InitialLoader';
import { AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { apiClient, clearAuthToken } from '@/lib/apiClient';
import { HeatmapItem } from '@/components/Heatmap';
import { ProfileModal } from '@/components/ProfileModal';

const LOCAL_PROGRESS_KEY = 'planly_user_progress_v1';
const GUEST_TIMESTAMPS_KEY = 'planly_guest_completed_timestamps_v1';

export default function Home() {
  const { showToast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('planly_active_track_id') || 'dsa';
    }
    return 'dsa';
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSectionsLoading, setIsSectionsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; role: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Heatmap & Streak State
  const [heatmapData, setHeatmapData] = useState<HeatmapItem[]>([]);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [longestStreak, setLongestStreak] = useState<number>(0);

  const handleSelectTrack = (id: string) => {
    setActiveTrackId(id);
    try {
      localStorage.setItem('planly_active_track_id', id);
    } catch (e) {}
  };

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>('all');

  // Modals state
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [addQuestionDefaultSectionId, setAddQuestionDefaultSectionId] = useState<string | undefined>();
  const [addQuestionDefaultSubsectionId, setAddQuestionDefaultSubsectionId] = useState<string | undefined>();

  // Check auth status on mount
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

  const clearGuestLocalStorage = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(LOCAL_PROGRESS_KEY);
      localStorage.removeItem(`${LOCAL_PROGRESS_KEY}_notes`);
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith(`${LOCAL_PROGRESS_KEY}_timeline_`) ||
            key.startsWith('planly_guest_progress'))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error('Failed to clear guest local storage:', e);
    }
  };

  // Helper to load sections for a specific track
  const fetchTrackSections = async (trackId: string, loggedInUser: { id: string } | null = currentUser) => {
    if (!trackId) return;
    setIsSectionsLoading(true);
    try {
      const res = await apiClient(`/api/tracks/${trackId}/sections`);
      const sectionsData: Section[] = await res.json();

      let savedProgress: Record<string, boolean> = {};
      let savedNotes: Record<string, string> = {};

      if (!loggedInUser) {
        try {
          const rawProgress = localStorage.getItem(LOCAL_PROGRESS_KEY);
          if (rawProgress) savedProgress = JSON.parse(rawProgress);

          const rawNotes = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_notes`);
          if (rawNotes) savedNotes = JSON.parse(rawNotes);
        } catch (err) {}
      }

      const todayStr = new Date().toISOString().slice(0, 10);
      let savedTimeline = { targetDays: 90, startDate: todayStr };

      if (loggedInUser) {
        const currentTrack = tracks.find((t) => t.id === trackId);
        if (currentTrack?.roadmapStartDate) savedTimeline.startDate = currentTrack.roadmapStartDate;
        if (currentTrack?.targetDays) savedTimeline.targetDays = currentTrack.targetDays;
      } else {
        try {
          const rawTimeline = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_timeline_${trackId}`);
          if (rawTimeline) {
            const parsed = JSON.parse(rawTimeline);
            if (parsed.targetDays) savedTimeline.targetDays = parsed.targetDays;
            if (parsed.startDate) savedTimeline.startDate = parsed.startDate;
          } else {
            // Automatically persist default timeline to localStorage on guest's first visit
            localStorage.setItem(
              `${LOCAL_PROGRESS_KEY}_timeline_${trackId}`,
              JSON.stringify(savedTimeline)
            );
          }
        } catch (err) {}
      }

      const updatedSections = (Array.isArray(sectionsData) ? sectionsData : []).map((sec) => ({
        ...sec,
        subsections: sec.subsections.map((sub) => ({
          ...sub,
          questions: sub.questions.map((q) => ({
            ...q,
            completed: !loggedInUser && savedProgress[q.id] !== undefined ? savedProgress[q.id] : q.completed,
            notes: !loggedInUser && savedNotes[q.id] !== undefined ? savedNotes[q.id] : q.notes,
          })),
        })),
      }));

      const recalculatedSections = recalculateTrackTimeline(
        updatedSections,
        savedTimeline.startDate,
        savedTimeline.targetDays
      );

      setTracks((prev) =>
        prev.map((t) =>
          t.id === trackId
            ? {
                ...t,
                targetDays: savedTimeline.targetDays,
                roadmapStartDate: savedTimeline.startDate,
                sections: recalculatedSections,
              }
            : t
        )
      );
    } catch (e) {
      console.error(`Failed to load sections for track ${trackId}:`, e);
    } finally {
      setIsSectionsLoading(false);
    }
  };

  // Helper to fetch/calculate activity heatmap & streaks
  const fetchHeatmapData = async (user = currentUser) => {
    if (user) {
      try {
        const res = await apiClient('/api/questions/heatmap');
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

    // Guest mode heatmap calculation
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
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 364);

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().slice(0, 10);
        const count = dailyCounts[dateStr] || 0;
        let level = 0;
        if (count >= 7) level = 4;
        else if (count >= 5) level = 3;
        else if (count >= 3) level = 2;
        else if (count >= 1) level = 1;

        items.push({ date: dateStr, count, level });
      }

      setHeatmapData(items);
      setTotalCompleted(total);
      setCurrentStreak(cStreak);
      setLongestStreak(lStreak);
    } catch (err) {
      console.error('Failed to calculate guest heatmap:', err);
    }
  };

  // Unified Initial Fetch: Load Auth, Tracks List, AND Initial Track Sections before hiding loader
  const fetchInitialData = async () => {
    setIsLoaded(false);
    try {
      const user = await checkAuthStatus();
      await fetchHeatmapData(user);

      const res = await apiClient('/api/tracks');
      const tracksData = await res.json();

      if (Array.isArray(tracksData) && tracksData.length > 0) {
        const savedTrackId = typeof window !== 'undefined' ? localStorage.getItem('planly_active_track_id') : null;
        const initialTrackId = savedTrackId && tracksData.some((t: Track) => t.id === savedTrackId)
          ? savedTrackId
          : tracksData[0].id;
        setActiveTrackId(initialTrackId);

        // Fetch sections for the initial track BEFORE removing initial loader
        try {
          const sectionsRes = await apiClient(`/api/tracks/${initialTrackId}/sections`);
          const sectionsData: Section[] = await sectionsRes.json();

          let savedProgress: Record<string, boolean> = {};
          let savedNotes: Record<string, string> = {};

          if (!user) {
            try {
              const rawProgress = localStorage.getItem(LOCAL_PROGRESS_KEY);
              if (rawProgress) savedProgress = JSON.parse(rawProgress);

              const rawNotes = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_notes`);
              if (rawNotes) savedNotes = JSON.parse(rawNotes);
            } catch (err) {}
          }

          const initialTrackData = tracksData.find((t: Track) => t.id === initialTrackId);
          const todayStr = new Date().toISOString().slice(0, 10);
          let savedTimeline = { targetDays: 90, startDate: todayStr };

          if (user) {
            if (initialTrackData?.roadmapStartDate) savedTimeline.startDate = initialTrackData.roadmapStartDate;
            if (initialTrackData?.targetDays) savedTimeline.targetDays = initialTrackData.targetDays;
          } else {
            try {
              const rawTimeline = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_timeline_${initialTrackId}`);
              if (rawTimeline) {
                const parsed = JSON.parse(rawTimeline);
                if (parsed.targetDays) savedTimeline.targetDays = parsed.targetDays;
                if (parsed.startDate) savedTimeline.startDate = parsed.startDate;
              } else {
                // Automatically persist default timeline to localStorage on guest's first visit
                localStorage.setItem(
                  `${LOCAL_PROGRESS_KEY}_timeline_${initialTrackId}`,
                  JSON.stringify(savedTimeline)
                );
              }
            } catch (err) {}
          }

          const updatedSections = (Array.isArray(sectionsData) ? sectionsData : []).map((sec) => ({
            ...sec,
            subsections: sec.subsections.map((sub) => ({
              ...sub,
              questions: sub.questions.map((q) => ({
                ...q,
                completed: !user && savedProgress[q.id] !== undefined ? savedProgress[q.id] : q.completed,
                notes: !user && savedNotes[q.id] !== undefined ? savedNotes[q.id] : q.notes,
              })),
            })),
          }));

          const recalculatedSections = recalculateTrackTimeline(
            updatedSections,
            savedTimeline.startDate,
            savedTimeline.targetDays
          );

          const initialTracksWithSections = tracksData.map((t: Track) =>
            t.id === initialTrackId
              ? {
                  ...t,
                  targetDays: savedTimeline.targetDays,
                  roadmapStartDate: savedTimeline.startDate,
                  sections: recalculatedSections,
                }
              : t
          );

          setTracks(initialTracksWithSections);
        } catch (err) {
          console.error(`Failed to load initial sections for track ${initialTrackId}:`, err);
          setTracks(tracksData);
        }
      }
    } catch (e) {
      console.error('Failed to load initial tracks data:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch sections when switching tracks after initial load if sections not loaded yet
  useEffect(() => {
    if (isLoaded && activeTrackId) {
      const currentTrack = tracks.find((t) => t.id === activeTrackId);
      if (!currentTrack || !currentTrack.sections || currentTrack.sections.length === 0) {
        fetchTrackSections(activeTrackId, currentUser);
      }
    }
  }, [activeTrackId, isLoaded]);

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  // Calculate active section containing first unsolved question
  let activeSectionId = activeTrack?.sections?.[0]?.id;
  if (activeTrack && activeTrack.sections) {
    for (const sec of activeTrack.sections) {
      const hasUnsolved = sec.subsections.some((sub) => sub.questions.some((q) => !q.completed));
      if (hasUnsolved) {
        activeSectionId = sec.id;
        break;
      }
    }
  }

  // Smooth scroll to active section on section load
  useEffect(() => {
    if (!isSectionsLoading && activeSectionId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(activeSectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isSectionsLoading, activeSectionId]);

  // Apply timeline custom dates
  const handleApplyRoadmapTimeline = async (targetDays: number, startDate: string) => {
    if (!activeTrack) return;

    if (currentUser) {
      // Authenticated user: persist timeline to database
      try {
        await apiClient('/api/tracks/user-timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trackId: activeTrack.id,
            startDate,
            targetDays,
          }),
        });
      } catch (e) {
        console.error('Failed to save user timeline on server:', e);
      }
    } else {
      // Guest user: save timeline in localStorage
      try {
        localStorage.setItem(
          `${LOCAL_PROGRESS_KEY}_timeline_${activeTrack.id}`,
          JSON.stringify({ startDate, targetDays })
        );
      } catch (e) {}
    }

    const recalculatedSections = recalculateTrackTimeline(
      activeTrack.sections || [],
      startDate,
      targetDays
    );

    setTracks((prev) =>
      prev.map((t) =>
        t.id === activeTrack.id
          ? { ...t, roadmapStartDate: startDate, targetDays, sections: recalculatedSections }
          : t
      )
    );

    showToast('Roadmap timeline recalculated!', 'success');
  };

  const handleToggleQuestion = React.useCallback(async (questionId: string) => {
    if (!activeTrack) return;

    let currentQuestion: Question | undefined;
    for (const sec of activeTrack.sections || []) {
      for (const sub of sec.subsections || []) {
        const found = sub.questions.find((q) => q.id === questionId);
        if (found) {
          currentQuestion = found;
          break;
        }
      }
      if (currentQuestion) break;
    }

    if (!currentQuestion) return;
    const newCompletedState = !currentQuestion.completed;

    setTracks((prevTracks) =>
      prevTracks.map((t) => {
        if (t.id !== activeTrack.id) return t;
        return {
          ...t,
          sections: t.sections.map((sec) => {
            const hasQuestion = sec.subsections.some((sub) =>
              sub.questions.some((q) => q.id === questionId)
            );
            if (!hasQuestion) return sec;
            return {
              ...sec,
              subsections: sec.subsections.map((sub) => {
                const subHasQuestion = sub.questions.some((q) => q.id === questionId);
                if (!subHasQuestion) return sub;
                return {
                  ...sub,
                  questions: sub.questions.map((q) =>
                    q.id === questionId ? { ...q, completed: newCompletedState } : q
                  ),
                };
              }),
            };
          }),
        };
      })
    );

    if (currentUser) {
      // Authenticated user: persist via backend API
      try {
        await apiClient('/api/questions/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId }),
        });
      } catch (e) {
        console.error('Failed to toggle question completion on server:', e);
      }
    } else {
      // Guest user: strictly persist progress and timestamp in localStorage
      try {
        const rawProgress = localStorage.getItem(LOCAL_PROGRESS_KEY);
        const savedProgress = rawProgress ? JSON.parse(rawProgress) : {};
        savedProgress[questionId] = newCompletedState;
        localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(savedProgress));

        const rawTimestamps = localStorage.getItem(GUEST_TIMESTAMPS_KEY);
        const savedTimestamps = rawTimestamps ? JSON.parse(rawTimestamps) : {};
        if (newCompletedState) {
          savedTimestamps[questionId] = new Date().toISOString().slice(0, 10);
        } else {
          delete savedTimestamps[questionId];
        }
        localStorage.setItem(GUEST_TIMESTAMPS_KEY, JSON.stringify(savedTimestamps));
      } catch (err) {
        console.error('Failed to save guest progress in localStorage:', err);
      }
    }

    // Instantly update heatmap activity counts on toggle
    fetchHeatmapData();

    if (newCompletedState) {
      showToast('Question marked as completed! 🎉', 'success');
    }
  }, [activeTrack, currentUser, showToast]);

  const handleUpdateQuestion = React.useCallback(async (questionId: string, updatedFields: Partial<Question>) => {
    if (!activeTrack) return;

    setTracks((prevTracks) =>
      prevTracks.map((t) => {
        if (t.id !== activeTrack.id) return t;
        return {
          ...t,
          sections: t.sections.map((sec) => {
            const hasQuestion = sec.subsections.some((sub) =>
              sub.questions.some((q) => q.id === questionId)
            );
            if (!hasQuestion) return sec;
            return {
              ...sec,
              subsections: sec.subsections.map((sub) => {
                const subHasQuestion = sub.questions.some((q) => q.id === questionId);
                if (!subHasQuestion) return sub;
                return {
                  ...sub,
                  questions: sub.questions.map((q) =>
                    q.id === questionId ? { ...q, ...updatedFields } : q
                  ),
                };
              }),
            };
          }),
        };
      })
    );

    if (updatedFields.notes !== undefined) {
      if (currentUser) {
        try {
          await apiClient('/api/questions/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionId, notes: updatedFields.notes }),
          });
          showToast('Notes saved successfully', 'info');
        } catch (e) {
          console.error('Failed to save notes on server:', e);
        }
      } else {
        try {
          const rawNotes = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_notes`);
          const savedNotes = rawNotes ? JSON.parse(rawNotes) : {};
          savedNotes[questionId] = updatedFields.notes;
          localStorage.setItem(`${LOCAL_PROGRESS_KEY}_notes`, JSON.stringify(savedNotes));
          showToast('Notes saved locally (Guest Mode)', 'info');
        } catch (err) {
          console.error('Failed to save guest notes in localStorage:', err);
        }
      }
    }
  }, [activeTrack, currentUser, showToast]);

  const handleAddQuestionToSection = React.useCallback((secId: string, subId?: string) => {
    setAddQuestionDefaultSectionId(secId);
    setAddQuestionDefaultSubsectionId(subId);
    setIsAddQuestionOpen(true);
  }, []);

  const handleAddQuestion = async (payload: {
    sectionId?: string;
    newTopicName?: string;
    subsectionTitle: string;
    questionData: {
      title: string;
      difficulty: Difficulty;
      url?: string;
      notes?: string;
    };
  }) => {
    if (!activeTrackId) return;
    try {
      const res = await apiClient('/api/questions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: activeTrackId,
          sectionId: payload.sectionId,
          newTopicName: payload.newTopicName,
          subsectionTitle: payload.subsectionTitle,
          ...payload.questionData,
        }),
      });

      if (res.ok) {
        showToast('Question submitted for admin review!', 'success');
      } else {
        showToast('Failed to submit question.', 'error');
      }
    } catch (e) {
      showToast('Error submitting question.', 'error');
    }
  };

  const handleAuthSuccess = (user: { id: string; username: string; role: string }) => {
    clearGuestLocalStorage();
    setCurrentUser(user);
    fetchInitialData();
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiClient('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      clearAuthToken();
      setCurrentUser(null);
      clearGuestLocalStorage();
      showToast('Signed out. Continuing as guest.', 'info');
      await fetchInitialData();
      setIsLoggingOut(false);
    }
  };

  const filteredSections = React.useMemo(() => {
    if (!activeTrack || !activeTrack.sections) return [];
    const searchLower = searchQuery.toLowerCase().trim();

    return activeTrack.sections.map((section) => {
      const topicMatches =
        searchLower === '' ||
        section.topic.toLowerCase().includes(searchLower) ||
        (section.sectionTitle && section.sectionTitle.toLowerCase().includes(searchLower));

      const filteredSubsections = section.subsections.map((sub) => {
        const filteredQuestions = sub.questions.filter((q) => {
          const matchesSearch =
            topicMatches ||
            sub.title.toLowerCase().includes(searchLower) ||
            q.title.toLowerCase().includes(searchLower);

          const matchesStatus =
            filterStatus === 'all'
              ? true
              : filterStatus === 'completed'
              ? q.completed
              : !q.completed;

          const matchesDifficulty =
            filterDifficulty === 'all' ? true : q.difficulty === filterDifficulty;

          return matchesSearch && matchesStatus && matchesDifficulty;
        });

        return { ...sub, questions: filteredQuestions };
      }).filter((sub) => sub.questions.length > 0 || searchLower === '');

      return { ...section, subsections: filteredSubsections };
    }).filter((sec) => sec.subsections.some((sub) => sub.questions.length > 0) || searchLower === '');
  }, [activeTrack, searchQuery, filterStatus, filterDifficulty]);

  if (!isLoaded || isLoggingOut) {
    return (
      <InitialLoader 
        title="Planly" 
        subtitle={isLoggingOut ? "Signing out of your account..." : "Preparing your interview roadmap..."} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      
      {/* Smart Sticky Header Navbar */}
      <Header
        tracks={tracks}
        activeTrackId={activeTrackId}
        onSelectTrack={handleSelectTrack}
        onOpenAddQuestion={() => {
          setAddQuestionDefaultSectionId(undefined);
          setAddQuestionDefaultSubsectionId(undefined);
          setIsAddQuestionOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        onOpenProfileModal={() => (window.location.href = '/profile')}
        currentStreak={currentStreak}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8 space-y-5">
        
        {/* Sticky Timeline Header Card */}
        {activeTrack && (
          <TimelineHeader
            track={activeTrack}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            filterDifficulty={filterDifficulty}
            onFilterDifficultyChange={setFilterDifficulty}
            onApplyRoadmapTimeline={handleApplyRoadmapTimeline}
          />
        )}

        {/* Section Loader or Content Cards */}
        {isSectionsLoading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xs">
            <Loader2 className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Loading Track Topics & Questions...</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fetching normalized syllabus sections from database</p>
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-xs">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No matching topics or questions found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try adjusting your search query or reset status / difficulty filters.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                defaultExpanded={section.id === activeSectionId}
                onToggleQuestion={handleToggleQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onAddQuestionToSection={handleAddQuestionToSection}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6 w-full gap-2 border-t border-slate-200 dark:border-slate-800/60 mt-4">
        <span>Planly — Interview Preparation Tracker</span>
        <a
          href="/admin"
          className="text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Portal Login</span>
        </a>
      </footer>

      {/* Submit Question Modal */}
      {activeTrack && (
        <AddQuestionModal
          track={activeTrack}
          defaultSectionId={addQuestionDefaultSectionId}
          defaultSubsectionId={addQuestionDefaultSubsectionId}
          isOpen={isAddQuestionOpen}
          onClose={() => setIsAddQuestionOpen(false)}
          onAddQuestion={handleAddQuestion}
        />
      )}

      {/* User Login / Register Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Dedicated User Profile & All Tracks Statistics Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        tracks={tracks}
        heatmapData={heatmapData}
        totalCompleted={totalCompleted}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        onLogout={handleLogout}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}
