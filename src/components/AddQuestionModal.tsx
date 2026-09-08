'use client';

import React, { useState, useEffect } from 'react';
import { Track, Difficulty } from '@/types/tracker';
import { Plus, X, Link as LinkIcon, FileText, HelpCircle } from 'lucide-react';

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
  const [selectedSectionId, setSelectedSectionId] = useState(
    defaultSectionId || track.sections[0]?.id || ''
  );
  const [selectedSubsectionTitle, setSelectedSubsectionTitle] = useState('');
  const [customSubsectionTitle, setCustomSubsectionTitle] = useState('');
  const [isNewSubsection, setIsNewSubsection] = useState(false);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Update selected section when default changes or track changes
  useEffect(() => {
    if (defaultSectionId) {
      setSelectedSectionId(defaultSectionId);
    } else if (track.sections[0]) {
      setSelectedSectionId(track.sections[0].id);
    }
  }, [defaultSectionId, track]);

  // Find currently selected section
  const currentSection = track.sections.find((s) => s.id === selectedSectionId);

  useEffect(() => {
    if (currentSection && currentSection.subsections.length > 0) {
      if (defaultSubsectionId) {
        const matchingSub = currentSection.subsections.find(
          (sub) => sub.id === defaultSubsectionId
        );
        if (matchingSub) {
          setSelectedSubsectionTitle(matchingSub.title);
          setIsNewSubsection(false);
          return;
        }
      }
      setSelectedSubsectionTitle(currentSection.subsections[0].title);
      setIsNewSubsection(false);
    } else {
      setIsNewSubsection(true);
      setCustomSubsectionTitle('General Questions');
    }
  }, [selectedSectionId, currentSection, defaultSubsectionId]);

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

    // Reset fields & close
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
              <h3 className="text-base font-bold text-white">Add New Question</h3>
              <p className="text-xs text-slate-400">Add a problem under any section or subsection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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

          {/* Target Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Target Section *
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-all"
              >
                {track.sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.topic ? `${s.topic} - ${s.sectionTitle}` : s.sectionTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-all"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Sub-section Choice */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Sub-section
              </label>
              <button
                type="button"
                onClick={() => setIsNewSubsection(!isNewSubsection)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {isNewSubsection ? 'Choose Existing' : '+ Create New Sub-section'}
              </button>
            </div>

            {isNewSubsection ? (
              <input
                type="text"
                value={customSubsectionTitle}
                onChange={(e) => setCustomSubsectionTitle(e.target.value)}
                placeholder="Enter new sub-section title..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
            ) : (
              <select
                value={selectedSubsectionTitle}
                onChange={(e) => setSelectedSubsectionTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-all"
              >
                {currentSection?.subsections.map((sub) => (
                  <option key={sub.id} value={sub.title}>
                    {sub.title}
                  </option>
                ))}
              </select>
            )}
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
              rows={3}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none"
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
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
