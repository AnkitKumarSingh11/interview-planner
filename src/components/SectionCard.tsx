'use client';

import React, { useState } from 'react';
import { Section, Question } from '@/types/tracker';
import { QuestionRow } from './QuestionRow';
import { 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit2, 
  FolderKanban 
} from 'lucide-react';

interface SectionCardProps {
  section: Section;
  onToggleQuestion: (questionId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;
  onEditTimeline: (section: Section) => void;
  onAddQuestionToSection: (sectionId: string, subsectionId?: string) => void;
  onDeleteSection: (sectionId: string) => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  section,
  onToggleQuestion,
  onDeleteQuestion,
  onUpdateQuestion,
  onEditTimeline,
  onAddQuestionToSection,
  onDeleteSection,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Compute section statistics across all sub-sections
  const allQuestions = section.subsections.flatMap((sub) => sub.questions);
  const totalQuestions = allQuestions.length;
  const completedQuestions = allQuestions.filter((q) => q.completed).length;
  const percentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all hover:border-slate-700/80">
      
      {/* Section Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border-b border-slate-800/80">
        
        {/* Left Title & Timeline */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors mt-0.5"
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1 bg-indigo-500/10 text-indigo-400 rounded-md">
                <FolderKanban className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-100 truncate">
                {section.topic}
              </h3>
              {section.sectionTitle && section.sectionTitle !== section.topic && (
                <span className="text-xs text-slate-400 font-normal">
                  ({section.sectionTitle})
                </span>
              )}
            </div>

            {/* Timeline date selector display */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <button
                onClick={() => onEditTimeline(section)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 rounded-lg border border-slate-700/60 transition-all font-medium group"
                title="Click to edit section timeline dates"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>{section.startDate || 'Set Start'} – {section.endDate || 'Set End'}</span>
                <Edit2 className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 ml-1" />
              </button>
              <span className="text-slate-500 text-[11px]">
                {section.subsections.length} sub-sections
              </span>
            </div>
          </div>
        </div>

        {/* Right Stats & Action Controls */}
        <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-200">
                {completedQuestions} / {totalQuestions} Done
              </div>
              <div className="text-[11px] text-slate-400">{percentage}%</div>
            </div>
            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
            <button
              onClick={() => onAddQuestionToSection(section.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg transition-all"
              title="Add Question to this topic"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Add Question</span>
            </button>

            <button
              onClick={() => onDeleteSection(section.id)}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Main Topic"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Subsections & Questions Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-6 bg-slate-950/40">
          {section.subsections.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No questions under this topic yet. Click "+ Add Question" to add one!
            </div>
          ) : (
            section.subsections.map((subsection) => (
              <div key={subsection.id} className="space-y-2.5 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/60">
                
                {/* Subsection Header */}
                <div className="flex items-center justify-between px-1 border-b border-slate-800/60 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {subsection.title}
                    <span className="text-[10px] text-slate-500 font-normal lowercase">
                      ({subsection.questions.length} questions)
                    </span>
                  </h4>
                  <button
                    onClick={() => onAddQuestionToSection(section.id, subsection.id)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium bg-slate-800 px-2 py-0.5 rounded-md"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>

                {/* Question Items list */}
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {subsection.questions.map((question) => (
                    <QuestionRow
                      key={question.id}
                      question={question}
                      onToggleComplete={onToggleQuestion}
                      onDeleteQuestion={onDeleteQuestion}
                      onUpdateQuestion={onUpdateQuestion}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
