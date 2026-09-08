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
import { EditTimelineModal } from '@/components/EditTimelineModal';
import { AddQuestionModal } from '@/components/AddQuestionModal';
import { AddSectionModal } from '@/components/AddSectionModal';
import { AddTrackModal } from '@/components/AddTrackModal';
import { AdminApprovalModal } from '@/components/AdminApprovalModal';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string>('dsa');
  const [isLoaded, setIsLoaded] = useState(false);

  // Admin Pending Queue
  const [pendingQuestions, setPendingQuestions] = useState<any[]>([]);
  const [isAdminApprovalOpen, setIsAdminApprovalOpen] = useState(false);

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

  // Fetch Tracks & Pending Questions from SQLite API
  const fetchTracksData = async () => {
    try {
      const res = await fetch('/api/tracks');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setTracks(data);
        if (!activeTrackId || !data.some(t => t.id === activeTrackId)) {
          setActiveTrackId(data[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load tracks from SQLite database API:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const fetchPendingQueue = async () => {
    try {
      const res = await fetch('/api/admin/pending');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPendingQuestions(data);
      }
    } catch (e) {
      console.error('Failed to load pending queue:', e);
    }
  };

  useEffect(() => {
    fetchTracksData();
    fetchPendingQueue();
  }, []);

  // Current active track
  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  // Handler: Apply Roadmap Target Days Timeline across all sections
  const handleApplyRoadmapTimeline = async (targetDays: number, startDateStr: string) => {
    if (!activeTrack) return;
    const recalculatedSections = recalculateTrackTimeline(
      activeTrack.sections,
      startDateStr,
      targetDays
    );

    // Update local state
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

    // Save to SQLite
    try {
      await fetch('/api/tracks/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: activeTrackId,
          roadmapStartDate: startDateStr,
          targetDays,
          sections: recalculatedSections,
        }),
      });
    } catch (e) {
      console.error('Failed to update timeline in SQLite:', e);
    }
  };

  // Handler: Toggle Question Completion
  const handleToggleQuestion = async (questionId: string) => {
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

    try {
      await fetch('/api/questions/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      });
    } catch (e) {
      console.error('Failed to toggle completion in SQLite:', e);
    }
  };

  // Handler: Delete Question
  const handleDeleteQuestion = async (questionId: string) => {
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

    try {
      await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, action: 'reject' }),
      });
    } catch (e) {
      console.error('Failed to delete question from SQLite:', e);
    }
  };

  // Handler: Update Question metadata (notes)
  const handleUpdateQuestion = async (questionId: string, updates: Partial<Question>) => {
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

    if (updates.notes !== undefined) {
      try {
        await fetch('/api/questions/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, notes: updates.notes }),
        });
      } catch (e) {
        console.error('Failed to update notes in SQLite:', e);
      }
    }
  };

  // Handler: Update Section Timeline Dates
  const handleSaveTimeline = async (sectionId: string, startDate: string, endDate: string) => {
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

    try {
      await fetch('/api/sections/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, startDate, endDate }),
      });
    } catch (e) {
      console.error('Failed to update section timeline in SQLite:', e);
    }
  };

  // Handler: Submit Question for Admin Approval
  const handleAddQuestion = async (
    sectionId: string,
    subsectionTitle: string,
    questionData: {
      title: string;
      difficulty: Difficulty;
      url?: string;
      notes?: string;
    }
  ) => {
    try {
      const res = await fetch('/api/questions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          subsectionTitle,
          ...questionData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('🎉 Question submitted for Admin Approval! An administrator will review and publish it live.');
        fetchPendingQueue();
      } else {
        alert(data.error || 'Failed to submit question.');
      }
    } catch (e) {
      console.error('Failed to submit question:', e);
    }
  };

  // Admin Approve Handler
  const handleApproveQuestion = async (questionId: string) => {
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, action: 'approve' }),
      });
      if (res.ok) {
        fetchPendingQueue();
        fetchTracksData(); // Refresh live syllabus
      }
    } catch (e) {
      console.error('Failed to approve question:', e);
    }
  };

  // Admin Reject Handler
  const handleRejectQuestion = async (questionId: string) => {
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, action: 'reject' }),
      });
      if (res.ok) {
        fetchPendingQueue();
      }
    } catch (e) {
      console.error('Failed to reject question:', e);
    }
  };

  // Handler: Add Section Topic
  const handleAddSection = async (sectionData: {
    topic?: string;
    sectionTitle: string;
    startDate: string;
    endDate: string;
    initialSubsections?: string[];
  }) => {
    if (!activeTrackId) return;

    try {
      await fetch('/api/sections/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: activeTrackId,
          ...sectionData,
        }),
      });
      fetchTracksData();
    } catch (e) {
      console.error('Failed to add section:', e);
    }
  };

  // Handler: Delete Section Topic
  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this topic and all its sub-sections and questions?')) return;
    try {
      await fetch('/api/sections/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId }),
      });
      fetchTracksData();
    } catch (e) {
      console.error('Failed to delete section:', e);
    }
  };

  // Handler: Add Track
  const handleAddTrack = async (title: string, description: string) => {
    try {
      const res = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.trackId) {
        setTracks(data.tracks);
        setActiveTrackId(data.trackId);
      }
    } catch (e) {
      console.error('Failed to create track:', e);
    }
  };

  // Export / Import / Reset handlers
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tracks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `planly_interview_tracker_sqlite_backup_${new Date().toISOString().slice(0, 10)}.json`);
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

  const handleResetDefaults = async () => {
    if (confirm('Are you sure you want to reset all tracks to initial default syllabi in SQLite? Custom edits will be reset.')) {
      fetchTracksData();
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
        Connecting to SQLite Database & Loading Roadmap...
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
        pendingCount={pendingQuestions.length}
        onOpenAdminApproval={() => setIsAdminApprovalOpen(true)}
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
        Planly — Interview Preparation Tracker • Built with Next.js, React, Tailwind CSS & SQLite
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

      <AdminApprovalModal
        pendingQuestions={pendingQuestions}
        isOpen={isAdminApprovalOpen}
        onClose={() => setIsAdminApprovalOpen(false)}
        onApprove={handleApproveQuestion}
        onReject={handleRejectQuestion}
      />
    </div>
  );
}
