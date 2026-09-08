'use client';

import React, { useState, useEffect } from 'react';
import { Track, Difficulty } from '@/types/tracker';
import { Plus, X, Link as LinkIcon, FileText, FolderKanban, Layers, ShieldCheck } from 'lucide-react';

interface AddQuestionModalProps {
  track: Track;
  defaultSectionId?: string;
  defaultSubsectionId?: string;
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (
    sectionId: string,
    subsectionTitle: string,
    questionData: {
      title: string;
      difficulty: Difficulty;
      url?: string;
      notes?: string;
    }
  ) => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  track,
  defaultSectionId,
  defaultSubsectionId,
  isOpen,
  onClose,
  onAddQuestion,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    defaultSectionId || track.sections[0]?.id || ''
  );
  const [selectedSubsectionTitle, setSelectedSubsectionTitle] = useState<string>('');
  const [customSubsectionTitle, setCustomSubsectionTitle] = useState<string>('');
  const [isNewSubsection, setIsNewSubsection] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [url, setUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (defaultSectionId) {
      setSelectedSectionId(defaultSectionId);
    } else if (track.sections.length > 0) {
      setSelectedSectionId(track.sections[0].id);
    }
  }, [defaultSectionId, track, isOpen]);

  const currentParentSection = track.sections.find((s) => s.id === selectedSectionId);

  useEffect(() => {
    if (currentParentSection && currentParentSection.subsections.length > 0) {
      if (defaultSubsectionId) {
        const matchingSub = currentParentSection.subsections.find(
          (sub) => sub.id === defaultSubsectionId
        );
        if (matchingSub) {
          setSelectedSubsectionTitle(matchingSub.title);
          setIsNewSubsection(false);
          return;
        }
      }
      setSelectedSubsectionTitle(currentParentSection.subsections[0].title);
      setIsNewSubsection(false);
    } else {
      setIsNewSubsection(true);
      setCustomSubsectionTitle('General Questions');
    }
  }, [selectedSectionId, currentParentSection, defaultSubsectionId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedSectionId) return;

    const subTitle = isNewSubsection
      ? customSubsectionTitle.trim() || 'General Questions'
      : selectedSubsectionTitle;

    onAddQuestion(selectedSectionId, subTitle, {
      title: title.trim(),
      difficulty,
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setUrl('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Submit New Question</h3>
              <p className="text-xs text-slate-400">Questions go through admin approval before publishing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Approval Notice Banner */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-amber-300 text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Submissions require admin approval. Once reviewed by an administrator, your question will appear live in the official syllabus!
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Question Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Question Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. LRU Cache Implementation or Two Sum"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* 1st Dropdown: Parent Main Topic */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5" />
              1. Parent Topic *
            </label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-indigo-500/30 rounded-xl text-slate-100 text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-all"
            >
              {track.sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.topic} ({sec.subsections.length} sub-sections)
                </option>
              ))}
            </select>
          </div>

          {/* 2nd Dependent Dropdown: Sub-section */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                2. Sub-section (Under "{currentParentSection?.topic || 'Selected Topic'}") *
              </label>
              <button
                type="button"
                onClick={() => setIsNewSubsection(!isNewSubsection)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {isNewSubsection ? 'Choose Existing Sub-section' : '+ New Sub-section'}
              </button>
            </div>

            {isNewSubsection ? (
              <input
                type="text"
                value={customSubsectionTitle}
                onChange={(e) => setCustomSubsectionTitle(e.target.value)}
                placeholder="Enter new sub-section title..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-all"
              />
            ) : (
              <select
                value={selectedSubsectionTitle}
                onChange={(e) => setSelectedSubsectionTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-all"
              >
                {currentParentSection?.subsections.map((sub) => (
                  <option key={sub.id} value={sub.title}>
                    {sub.title} ({sub.questions.length} questions)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Difficulty
            </label>
            <div className="flex items-center gap-2">
              {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    difficulty === diff
                      ? diff === 'Easy'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : diff === 'Medium'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Problem URL Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Reference Link (Optional)</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://leetcode.com/problems/... or GFG link"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Notes / Solution Hints (Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Initial thoughts, key takeaways, approach..."
              rows={2}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Submit Question for Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
