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

const LOCAL_PROGRESS_KEY = 'planly_user_progress_v1';

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

      try {
        const rawTimeline = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_timeline_${trackId}`);
        if (rawTimeline) {
          const parsed = JSON.parse(rawTimeline);
          if (parsed.targetDays) savedTimeline.targetDays = parsed.targetDays;
          if (parsed.startDate) savedTimeline.startDate = parsed.startDate;
        }
      } catch (err) {}

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

  // Unified Initial Fetch: Load Auth, Tracks List, AND Initial Track Sections before hiding loader
  const fetchInitialData = async () => {
    setIsLoaded(false);
    try {
      const user = await checkAuthStatus();

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

          const todayStr = new Date().toISOString().slice(0, 10);
          let savedTimeline = { targetDays: 90, startDate: todayStr };

          try {
            const rawTimeline = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_timeline_${initialTrackId}`);
            if (rawTimeline) {
              const parsed = JSON.parse(rawTimeline);
              if (parsed.targetDays) savedTimeline.targetDays = parsed.targetDays;
              if (parsed.startDate) savedTimeline.startDate = parsed.startDate;
            }
          } catch (err) {}

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
  const handleApplyRoadmapTimeline = (targetDays: number, startDate: string) => {
    if (!activeTrack) return;
    try {
      localStorage.setItem(
        `${LOCAL_PROGRESS_KEY}_timeline_${activeTrack.id}`,
        JSON.stringify({ startDate, targetDays })
      );
    } catch (e) {}

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

  const handleToggleQuestion = async (questionId: string) => {
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
          sections: t.sections.map((sec) => ({
            ...sec,
            subsections: sec.subsections.map((sub) => ({
              ...sub,
              questions: sub.questions.map((q) => {
                if (q.id === questionId) {
                  return { ...q, completed: newCompletedState };
                }
                return q;
              }),
            })),
          })),
        };
      })
    );

    if (currentUser) {
      // Authenticated user: DO NOT use localStorage, persist via backend API
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
      // Guest user: strictly persist progress in localStorage
      try {
        const rawProgress = localStorage.getItem(LOCAL_PROGRESS_KEY);
        const savedProgress = rawProgress ? JSON.parse(rawProgress) : {};
        savedProgress[questionId] = newCompletedState;
        localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(savedProgress));
      } catch (err) {
        console.error('Failed to save guest progress in localStorage:', err);
      }
    }

    if (newCompletedState) {
      showToast('Question marked as completed! 🎉', 'success');
    }
  };

  const handleUpdateQuestion = async (questionId: string, updatedFields: Partial<Question>) => {
    if (!activeTrack) return;

    setTracks((prevTracks) =>
      prevTracks.map((t) => {
        if (t.id !== activeTrack.id) return t;
        return {
          ...t,
          sections: t.sections.map((sec) => ({
            ...sec,
            subsections: sec.subsections.map((sub) => ({
              ...sub,
              questions: sub.questions.map((q) => {
                if (q.id === questionId) {
                  return { ...q, ...updatedFields };
                }
                return q;
              }),
            })),
          })),
        };
      })
    );

    if (updatedFields.notes !== undefined) {
      if (currentUser) {
        // Authenticated user: save notes via backend API
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
        // Guest user: save notes in localStorage
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
  };

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
    setCurrentUser(user);
    if (activeTrackId) {
      fetchTrackSections(activeTrackId, user);
    }
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
      showToast('Signed out. Continuing as guest.', 'info');
      if (activeTrackId) {
        await fetchTrackSections(activeTrackId, null);
      }
      setIsLoggingOut(false);
    }
  };

  const filteredSections = activeTrack && activeTrack.sections ? activeTrack.sections.map((section) => {
    const searchLower = searchQuery.toLowerCase();

    const topicMatches =
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
    }).filter((sub) => sub.questions.length > 0 || searchQuery === '');

    return { ...section, subsections: filteredSubsections };
  }).filter((sec) => sec.subsections.some((sub) => sub.questions.length > 0) || searchQuery === '') : [];

  if (!isLoaded || isLoggingOut) {
    return (
      <InitialLoader 
        title="Planly" 
        subtitle={isLoggingOut ? "Signing out of your account..." : "Preparing your interview roadmap..."} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
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
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-200">Loading Track Topics & Questions...</h3>
            <p className="text-xs text-slate-400">Fetching normalized syllabus sections from database</p>
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No matching topics or questions found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
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
                onAddQuestionToSection={(secId, subId) => {
                  setAddQuestionDefaultSectionId(secId);
                  setAddQuestionDefaultSubsectionId(subId);
                  setIsAddQuestionOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6 w-full gap-2">
        <span>Planly — Interview Preparation Tracker</span>
        <a
          href="/admin"
          className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
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
    </div>
  );
}
