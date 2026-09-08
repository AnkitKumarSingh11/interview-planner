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
import { InitialLoader } from '@/components/InitialLoader';
import { AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
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
  const [isSectionsLoading, setIsSectionsLoading] = useState(false);

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

  // Initial Fetch: Load Track Metadata List
  const fetchTracksData = async () => {
    try {
      const res = await apiClient('/api/tracks');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setTracks(data);
        const savedTrackId = typeof window !== 'undefined' ? localStorage.getItem('planly_active_track_id') : null;
        if (savedTrackId && data.some((t: Track) => t.id === savedTrackId)) {
          setActiveTrackId(savedTrackId);
        } else {
          setActiveTrackId(data[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load tracks list from API:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  // Lazy Fetch: Load Sections for Active Track on Demand
  const fetchTrackSections = async (trackId: string) => {
    if (!trackId) return;
    setIsSectionsLoading(true);
    try {
      const res = await apiClient(`/api/tracks/${trackId}/sections`);
      const sectionsData: Section[] = await res.json();

      let savedProgress: Record<string, boolean> = {};
      try {
        const rawProgress = localStorage.getItem(LOCAL_PROGRESS_KEY);
        if (rawProgress) savedProgress = JSON.parse(rawProgress);
      } catch (err) {}

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
            completed: savedProgress[q.id] !== undefined ? savedProgress[q.id] : q.completed,
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

  useEffect(() => {
    fetchTracksData();
  }, []);

  useEffect(() => {
    if (activeTrackId) {
      fetchTrackSections(activeTrackId);
    }
  }, [activeTrackId]);

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

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
    let newCompletedState = false;

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
                  newCompletedState = !q.completed;
                  return { ...q, completed: newCompletedState };
                }
                return q;
              }),
            })),
          })),
        };
      })
    );

    try {
      const rawProgress = localStorage.getItem(LOCAL_PROGRESS_KEY);
      const savedProgress = rawProgress ? JSON.parse(rawProgress) : {};
      savedProgress[questionId] = newCompletedState;
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(savedProgress));
    } catch (err) {}

    try {
      await apiClient('/api/questions/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      });
    } catch (e) {}

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
      try {
        await apiClient('/api/questions/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, notes: updatedFields.notes }),
        });
        showToast('Notes saved successfully', 'info');
      } catch (e) {}
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

  if (!isLoaded) {
    return <InitialLoader title="Planly" subtitle="Preparing your interview roadmap..." />;
  }

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
