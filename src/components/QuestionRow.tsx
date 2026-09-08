'use client';

import React, { useState } from 'react';
import { Question } from '@/types/tracker';
import { 
  Check, 
  ExternalLink, 
  FileText, 
  Trash2 
} from 'lucide-react';

interface QuestionRowProps {
  question: Question;
  onToggleComplete: (questionId: string) => void;
  onDeleteQuestion?: (questionId: string) => void;
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;
}

export const QuestionRow: React.FC<QuestionRowProps> = ({
  question,
  onToggleComplete,
  onDeleteQuestion,
  onUpdateQuestion,
}) => {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState(question.notes || '');

  const difficultyColors = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const problemUrl =
    question.url ||
    `https://leetcode.com/problemset/all/?search=${encodeURIComponent(question.title)}`;

  const handleSaveNotes = () => {
    onUpdateQuestion(question.id, { notes });
    setShowNotesModal(false);
  };

  return (
    <div
      id={`q-row-${question.id}`}
      onClick={() => onToggleComplete(question.id)}
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
        question.completed
          ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
          : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-850 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Custom Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(question.id);
          }}
          className={`flex items-center justify-center w-5 h-5 rounded-md border transition-all shrink-0 ${
            question.completed
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
              : 'border-slate-600 hover:border-indigo-400 bg-slate-800'
          }`}
          title={question.completed ? "Mark incomplete" : "Mark completed"}
        >
          {question.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Question Title & Link */}
        <div className="min-w-0 flex-1 flex flex-wrap items-center gap-2">
          <a
            href={problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open question in new tab"
            className={`text-sm font-medium transition-all hover:underline flex items-center gap-1.5 ${
              question.completed
                ? 'line-through text-slate-500 hover:text-slate-300'
                : 'text-slate-200 hover:text-indigo-400'
            }`}
          >
            <span>{question.title}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 shrink-0 inline-block" />
          </a>

          {question.custom && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
              Custom
            </span>
          )}
        </div>
      </div>

      {/* Right Controls: Difficulty badge, Notes, Delete */}
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {/* Difficulty Badge */}
        <span
          className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
            difficultyColors[question.difficulty] || difficultyColors.Medium
          }`}
        >
          {question.difficulty}
        </span>

        {/* External Link Direct Icon */}
        <a
          href={problemUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          title="Open problem link in new tab"
          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Notes Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowNotesModal(true);
          }}
          title={question.notes ? 'View Notes' : 'Add Notes'}
          className={`p-1.5 rounded-lg transition-colors ${
            question.notes
              ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Delete Button - Only shown when onDeleteQuestion callback is explicitly provided */}
        {onDeleteQuestion && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteQuestion(question.id);
            }}
            title="Delete Question"
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                Notes for: {question.title}
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add personal notes, approach hints, edge cases, time complexity..."
              rows={5}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
