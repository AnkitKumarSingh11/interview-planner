'use client';

import React, { useState, useEffect } from 'react';
import { 
  Track, 
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
import { InitialLoader } from '@/components/InitialLoader';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { apiClient } from '@/lib/apiClient';

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

  // Fetch Tracks from SQLite API & Overlay User Local Completion Progress & Timeline
  const fetchTracksData = async () => {
    try {
      const res = await apiClient('/api/tracks');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        
        let savedProgress: Record<string, boolean> = {};
        try {
          const rawProgress = localStorage.getItem(LOCAL_PROGRESS_KEY);
          if (rawProgress) savedProgress = JSON.parse(rawProgress);
        } catch (err) {}

        const todayStr = new Date().toISOString().slice(0, 10);

        const mapped = data.map((track: Track) => {
          let savedTimeline = {
            targetDays: 90,
            startDate: todayStr,
          };

          try {
            const rawTimeline = localStorage.getItem(`${LOCAL_PROGRESS_KEY}_timeline_${track.id}`);
            if (rawTimeline) {
              const parsed = JSON.parse(rawTimeline);
              if (parsed.targetDays) savedTimeline.targetDays = parsed.targetDays;
              if (parsed.startDate) savedTimeline.startDate = parsed.startDate;
            } else {
              localStorage.setItem(
                `${LOCAL_PROGRESS_KEY}_timeline_${track.id}`,
                JSON.stringify(savedTimeline)
              );
            }
          } catch (err) {}

          const targetDays = savedTimeline.targetDays;
          const roadmapStartDate = savedTimeline.startDate;

          const updatedSections = track.sections.map((sec) => ({
            ...sec,
            subsections: sec.subsections.map((sub) => ({
              ...sub,
              questions: sub.questions.map((q) => ({
                ...q,
                completed: savedProgress[q.id] !== undefined ? savedProgress[q.id] : q.completed,
              })),
            })),
          }));

          const recalculatedSections = recalculateTrackTimeline(
            updatedSections,
            roadmapStartDate,
            targetDays
          );

          return {
            ...track,
            targetDays,
            roadmapStartDate,
            sections: recalculatedSections,
          };
        });

        setTracks(mapped);
        
        const savedTrackId = typeof window !== 'undefined' ? localStorage.getItem('planly_active_track_id') : null;
        if (savedTrackId && mapped.some((t) => t.id === savedTrackId)) {
          setActiveTrackId(savedTrackId);
        } else if (!activeTrackId || !mapped.some((t) => t.id === activeTrackId)) {
          handleSelectTrack(mapped[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load tracks from API:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchTracksData();
  }, []);

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  // Auto-scroll smoothly to the first unsolved question so the user can easily resume
  useEffect(() => {
    if (!isLoaded || !activeTrack) return;

    let firstUnsolvedId: string | null = null;
    for (const sec of activeTrack.sections) {
      for (const sub of sec.subsections) {
        for (const q of sub.questions) {
          if (!q.completed) {
            firstUnsolvedId = q.id;
            break;
          }
        }
        if (firstUnsolvedId) break;
      }
      if (firstUnsolvedId) break;
    }

    if (firstUnsolvedId) {
      const targetId = firstUnsolvedId;
      const timer = setTimeout(() => {
        const el = document.getElementById(`q-row-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, activeTrackId]);

  // Handler: Apply Roadmap Target Days Timeline across all sections
  const handleApplyRoadmapTimeline = (targetDays: number, startDateStr: string) => {
    if (!activeTrack) return;
    const recalculatedSections = recalculateTrackTimeline(
      activeTrack.sections,
      startDateStr,
      targetDays
    );

    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id !== activeTrackId) return track;
        return {
          ...track,
          targetDays,
          roadmapStartDate: startDateStr,
          sections: recalculatedSections,
        };
      })
    );

    // Save timeline settings in localStorage per track
    try {
      localStorage.setItem(
        `${LOCAL_PROGRESS_KEY}_timeline_${activeTrackId}`,
        JSON.stringify({ targetDays, startDate: startDateStr })
      );
    } catch (err) {}

    showToast(`Timeline updated: ${targetDays} days starting ${startDateStr}`, 'success');
  };

  // Handler: Toggle Question Completion (Local Progress)
  const handleToggleQuestion = (questionId: string) => {
    let nextCompleted = false;

    const currentQ = activeTrack?.sections
      .flatMap((s) => s.subsections)
      .flatMap((sub) => sub.questions)
      .find((q) => q.id === questionId);

    if (currentQ) {
      nextCompleted = !currentQ.completed;
    }

    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id !== activeTrackId) return track;
        return {
          ...track,
          sections: track.sections.map((section) => ({
            ...section,
            subsections: section.subsections.map((sub) => ({
              ...sub,
              questions: sub.questions.map((q) => {
                if (q.id === questionId) {
                  return { ...q, completed: nextCompleted };
                }
                return q;
              }),
            })),
          })),
        };
      })
    );

    // Save exact computed progress to localStorage instantly
    try {
      const rawProgress = localStorage.getItem(LOCAL_PROGRESS_KEY);
      const progressMap = rawProgress ? JSON.parse(rawProgress) : {};
      progressMap[questionId] = nextCompleted;
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(progressMap));
    } catch (e) {}
  };

  // Handler: Update Question metadata (notes)
  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id !== activeTrackId) return track;
        return {
          ...track,
          sections: track.sections.map((section) => ({
            ...section,
            subsections: section.subsections.map((sub) => ({
              ...sub,
              questions: sub.questions.map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            })),
          })),
        };
      })
    );
  };

  // Handler: Submit Question for Admin Approval
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

      const data = await res.json();
      if (res.ok) {
        showToast('🎉 Question submitted for Admin Approval! An administrator will review and publish it live.', 'success');
      } else {
        showToast(data.error || 'Failed to submit question.', 'error');
      }
    } catch (e) {
      console.error('Failed to submit question:', e);
    }
  };

  // Filter sections & questions based on search & filter state
  const filteredSections = activeTrack ? activeTrack.sections.map((section) => {
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

  if (!isLoaded) {
    return <InitialLoader title="Planly" subtitle="Preparing your interview roadmap..." />;
  }

  // Find active section (section containing the first unsolved question)
  let activeSectionId = activeTrack?.sections[0]?.id;
  if (activeTrack) {
    for (const sec of activeTrack.sections) {
      const hasUnsolved = sec.subsections.some((sub) => sub.questions.some((q) => !q.completed));
      if (hasUnsolved) {
        activeSectionId = sec.id;
        break;
      }
    }
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

        {/* Topic Section Cards List */}
        {filteredSections.length === 0 ? (
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
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6 w-full gap-2">
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
    </div>
  );
}
