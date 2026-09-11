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
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
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
      className={`group flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
        question.completed
          ? 'bg-slate-50/70 border-slate-200 text-slate-500 dark:bg-slate-900/40 dark:border-slate-800/80 dark:text-slate-400'
          : 'bg-white border-slate-200/90 text-slate-800 hover:border-teal-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 dark:hover:border-slate-700 shadow-xs'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Custom Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(question.id);
          }}
          className={`flex items-center justify-center w-5 h-5 rounded-md border transition-all shrink-0 cursor-pointer ${
            question.completed
              ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
              : 'border-slate-300 dark:border-slate-600 hover:border-teal-500 bg-slate-100 dark:bg-slate-800'
          }`}
          title={question.completed ? "Mark incomplete" : "Mark completed"}
        >
          {question.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Question Title & Problem Link */}
        <div className="min-w-0 flex-1 flex flex-wrap items-center gap-2">
          <a
            href={problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open question in new tab"
            className={`text-sm font-medium transition-all hover:underline flex items-center gap-1.5 ${
              question.completed
                ? 'line-through text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                : 'text-slate-900 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400'
            }`}
          >
            <span>{question.title}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 shrink-0 inline-block" />
          </a>

          {question.custom && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20 rounded-md">
              Custom
            </span>
          )}
        </div>
      </div>

      {/* Status dot badge & Controls */}
      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        
        {/* Status dot pill inspired by 'Active' pill in reference image */}
        <span
          className={`px-2.5 py-0.5 text-xs font-medium rounded-full border flex items-center gap-1.5 ${
            question.completed
              ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800/40'
              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700/60'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${question.completed ? 'bg-teal-500' : 'bg-slate-400'}`} />
          {question.completed ? 'Completed' : 'Pending'}
        </span>

        {/* Difficulty Badge */}
        <span
          className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
            difficultyColors[question.difficulty] || difficultyColors.Medium
          }`}
        >
          {question.difficulty}
        </span>

        {/* Notes Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowNotesModal(true);
          }}
          title={question.notes ? 'View Notes' : 'Add Notes'}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            question.notes
              ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 hover:bg-amber-100 dark:hover:bg-amber-400/20'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        {onDeleteQuestion && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteQuestion(question.id);
            }}
            title="Delete Question"
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Notes for: {question.title}
              </h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add personal notes, approach hints, edge cases, time complexity..."
              rows={5}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 transition-all resize-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow transition-colors cursor-pointer"
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
