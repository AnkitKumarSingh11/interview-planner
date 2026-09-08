'use client';

import React, { useState, useEffect } from 'react';
import { initialTracks } from '@/data/initialData';
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
import { EditTimelineModal } from '@/components/EditTimelineModal';
import { AddQuestionModal } from '@/components/AddQuestionModal';
import { AddSectionModal } from '@/components/AddSectionModal';
import { AddTrackModal } from '@/components/AddTrackModal';
import { AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'planly_interview_tracker_v2';

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [activeTrackId, setActiveTrackId] = useState<string>('dsa');
  const [isLoaded, setIsLoaded] = useState(false);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>('all');

  // Modals state
  const [editingTimelineSection, setEditingTimelineSection] = useState<Section | null>(null);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [addQuestionDefaultSectionId, setAddQuestionDefaultSectionId] = useState<string | undefined>();
  const [addQuestionDefaultSubsectionId, setAddQuestionDefaultSubsectionId] = useState<string | undefined>();
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isAddTrackOpen, setIsAddTrackOpen] = useState(false);

  // Load state from LocalStorage on initial client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTracks(parsed);
          setActiveTrackId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load saved state from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save state to LocalStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
    }
  }, [tracks, isLoaded]);

  // Current active track
  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  // Handler: Apply Roadmap Target Days Timeline across all sections
  const handleApplyRoadmapTimeline = (targetDays: number, startDateStr: string) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id !== activeTrackId) return track;
        const recalculatedSections = recalculateTrackTimeline(
          track.sections,
          startDateStr,
          targetDays
        );
        return {
          ...track,
          targetDays,
          roadmapStartDate: startDateStr,
          sections: recalculatedSections,
        };
      })
    );
  };

  // Handler: Toggle Question Completion
  const handleToggleQuestion = (questionId: string) => {
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
                q.id === questionId ? { ...q, completed: !q.completed } : q
              ),
            })),
          })),
        };
      })
    );
  };

  // Handler: Delete Question
  const handleDeleteQuestion = (questionId: string) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id !== activeTrackId) return track;
        return {
          ...track,
          sections: track.sections.map((section) => ({
            ...section,
            subsections: section.subsections.map((sub) => ({
              ...sub,
              questions: sub.questions.filter((q) => q.id !== questionId),
            })),
          })),
        };
      })
    );
  };

  // Handler: Update Question metadata
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

  // Handler: Update Section Timeline Dates
  const handleSaveTimeline = (sectionId: string, startDate: string, endDate: string) => {
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id !== activeTrackId) return track;
        return {
          ...track,
          sections: track.sections.map((sec) =>
            sec.id === sectionId ? { ...sec, startDate, endDate } : sec
          ),
        };
      })
    );
  };

  // Handler: Add Question
  const handleAddQuestion = (
    sectionId: string,
    subsectionTitle: string,
    questionData: {
      title: string;
      difficulty: Difficulty;
      url?: string;
      notes?: string;
    }
  ) => {
    const newQuestion: Question = {
      id: `q-custom-${Date.now()}`,
      title: questionData.title,
      completed: false,
      difficulty: questionData.difficulty,
      url: questionData.url,
      notes: questionData.notes,
      custom: true,
    };

    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id !== activeTrackId) return track;
        return {
          ...track,
          sections: track.sections.map((sec) => {
            if (sec.id !== sectionId) return sec;
            
            const existingSubIndex = sec.subsections.findIndex(
              (sub) => sub.title.toLowerCase() === subsectionTitle.toLowerCase()
            );

            if (existingSubIndex >= 0) {
              const updatedSubs = [...sec.subsections];
              updatedSubs[existingSubIndex] = {
                ...updatedSubs[existingSubIndex],
                questions: [...updatedSubs[existingSubIndex].questions, newQuestion],
              };
              return { ...sec, subsections: updatedSubs };
            } else {
              const newSub = {
                id: `sub-custom-${Date.now()}`,
                title: subsectionTitle,
                questions: [newQuestion],
              };
              return { ...sec, subsections: [...sec.subsections, newSub] };
            }
          }),
        };
      })
    );
  };

  // Handler: Add Section
  const handleAddSection = (sectionData: {
    topic?: string;
    sectionTitle: string;
    startDate: string;
    endDate: string;
    initialSubsections?: string[];
  }) => {
    const newSection: Section = {
      id: `sec-custom-${Date.now()}`,
      topic: sectionData.topic,
      sectionTitle: sectionData.sectionTitle,
      startDate: sectionData.startDate,
      endDate: sectionData.endDate,
      subsections: (sectionData.initialSubsections || ['General']).map((stTitle, i) => ({
        id: `sub-custom-${Date.now()}-${i}`,
        title: stTitle,
        questions: [],
      })),
    };

    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id !== activeTrackId) return track;
        return {
          ...track,
          sections: [...track.sections, newSection],
        };
      })
    );
  };

  // Handler: Delete Section
  const handleDeleteSection = (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section and all its questions?')) return;
    setTracks((prevTracks) =>
      prevTracks.map((track) => {
        if (track.id !== activeTrackId) return track;
        return {
          ...track,
          sections: track.sections.filter((s) => s.id !== sectionId),
        };
      })
    );
  };

  // Handler: Add Track
  const handleAddTrack = (title: string, description: string) => {
    const newTrackId = `track-${Date.now()}`;
    const newTrack: Track = {
      id: newTrackId,
      title,
      description,
      targetDays: 60,
      roadmapStartDate: new Date().toISOString().slice(0, 10),
      sections: [
        {
          id: `sec-${Date.now()}`,
          sectionTitle: 'Getting Started',
          startDate: 'TBD',
          endDate: 'TBD',
          subsections: [
            {
              id: `sub-${Date.now()}`,
              title: 'General Questions',
              questions: [],
            },
          ],
        },
      ],
    };
    setTracks((prev) => [...prev, newTrack]);
    setActiveTrackId(newTrackId);
  };

  // Export / Import / Reset handlers
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tracks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `planly_interview_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setTracks(parsed);
            if (parsed.length > 0) setActiveTrackId(parsed[0].id);
            alert('Progress imported successfully!');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all tracks to initial default syllabi? Local modifications will be cleared.')) {
      setTracks(initialTracks);
      setActiveTrackId(initialTracks[0].id);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Filter sections & questions based on search & filter state
  const filteredSections = activeTrack ? activeTrack.sections.map((section) => {
    const searchLower = searchQuery.toLowerCase();

    const sectionMatches =
      (section.topic && section.topic.toLowerCase().includes(searchLower)) ||
      section.sectionTitle.toLowerCase().includes(searchLower);

    const filteredSubsections = section.subsections.map((sub) => {
      const filteredQuestions = sub.questions.filter((q) => {
        const matchesSearch =
          sectionMatches || q.title.toLowerCase().includes(searchLower);

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
        Loading interview roadmap...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Top Header Navbar */}
      <Header
        tracks={tracks}
        activeTrackId={activeTrackId}
        onSelectTrack={setActiveTrackId}
        onOpenAddTrack={() => setIsAddTrackOpen(true)}
        onOpenAddQuestion={() => {
          setAddQuestionDefaultSectionId(undefined);
          setAddQuestionDefaultSubsectionId(undefined);
          setIsAddQuestionOpen(true);
        }}
        onOpenAddSection={() => setIsAddSectionOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetDefaults={handleResetDefaults}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Timeline Header & Progress Card */}
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

        {/* Section Cards List */}
        {filteredSections.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No matching questions or topics found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search query or reset status / difficulty filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onToggleQuestion={handleToggleQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onUpdateQuestion={handleUpdateQuestion}
                onEditTimeline={(sec) => setEditingTimelineSection(sec)}
                onAddQuestionToSection={(secId, subId) => {
                  setAddQuestionDefaultSectionId(secId);
                  setAddQuestionDefaultSubsectionId(subId);
                  setIsAddQuestionOpen(true);
                }}
                onDeleteSection={handleDeleteSection}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        Planly — Interview Preparation Tracker • Built with Next.js, React & Tailwind CSS
      </footer>

      {/* Modals */}
      {editingTimelineSection && (
        <EditTimelineModal
          section={editingTimelineSection}
          isOpen={!!editingTimelineSection}
          onClose={() => setEditingTimelineSection(null)}
          onSaveTimeline={handleSaveTimeline}
        />
      )}

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

      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onAddSection={handleAddSection}
      />

      <AddTrackModal
        isOpen={isAddTrackOpen}
        onClose={() => setIsAddTrackOpen(false)}
        onAddTrack={handleAddTrack}
      />
    </div>
  );
}
