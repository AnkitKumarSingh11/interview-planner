'use client';

import React, { useState, useEffect } from 'react';
import { Section, Question } from '@/types/tracker';
import { QuestionRow } from './QuestionRow';
import { 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  FolderKanban 
} from 'lucide-react';

interface SectionCardProps {
  section: Section;
  defaultExpanded?: boolean;
  onToggleQuestion: (questionId: string) => void;
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;
  onAddQuestionToSection: (sectionId: string, subsectionId?: string) => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  section,
  defaultExpanded = false,
  onToggleQuestion,
  onUpdateQuestion,
  onAddQuestionToSection,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Find active sub-section
  const activeSubId = React.useMemo(() => {
    for (const sub of section.subsections) {
      if (sub.questions.some((q) => !q.completed)) {
        return sub.id;
      }
    }
    return section.subsections[0]?.id;
  }, [section.subsections]);

  // Subsections expand/collapse state
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    section.subsections.forEach((sub) => {
      initial[sub.id] = sub.id === activeSubId;
    });
    return initial;
  });

  useEffect(() => {
    setIsExpanded(defaultExpanded);
    const initial: Record<string, boolean> = {};
    section.subsections.forEach((sub) => {
      initial[sub.id] = sub.id === activeSubId;
    });
    setExpandedSubsections(initial);
  }, [defaultExpanded, section.id, activeSubId]);

  const toggleSubsection = (subId: string) => {
    setExpandedSubsections((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  // Compute section statistics across all sub-sections
  const allQuestions = section.subsections.flatMap((sub) => sub.questions);
  const totalQuestions = allQuestions.length;
  const completedQuestions = allQuestions.filter((q) => q.completed).length;
  const percentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  const handleHeaderClick = () => {
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState) {
      setTimeout(() => {
        const el = document.getElementById(section.id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div id={section.id} className="scroll-mt-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all">
      
      {/* Section Header */}
      <div 
        onClick={handleHeaderClick}
        className={`sticky top-0 z-20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
          isExpanded ? 'rounded-t-2xl border-b border-slate-100 dark:border-slate-800' : 'rounded-2xl'
        }`}
      >
        
        {/* Left Title & Timeline */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md transition-colors mt-0.5 shrink-0">
            {isExpanded ? <ChevronDown className="w-5 h-5 text-teal-600 dark:text-teal-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-md">
                <FolderKanban className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                {section.topic}
              </h3>
              {section.sectionTitle && section.sectionTitle !== section.topic && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  ({section.sectionTitle})
                </span>
              )}
            </div>

            {/* Timeline date display */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-300 rounded-lg border border-slate-200 dark:border-slate-700/60 font-medium">
                <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Target: {section.startDate || 'TBD'} – {section.endDate || 'TBD'}</span>
              </div>
              <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                {section.subsections.length} sub-sections
              </span>
            </div>
          </div>
        </div>

        {/* Right Stats & Submit Question Button */}
        <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end border-slate-200 dark:border-slate-800">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {completedQuestions} / {totalQuestions} Done
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{percentage}%</div>
            </div>
            <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddQuestionToSection(section.id);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-teal-50 dark:bg-teal-600/20 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-600/30 border border-teal-200 dark:border-teal-500/30 rounded-xl transition-all cursor-pointer"
              title="Submit a question under this topic for admin approval"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Submit Question</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subsections & Questions Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/40 rounded-b-2xl">
          {section.subsections.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              No questions under this topic yet. Click "+ Submit Question" to submit one!
            </div>
          ) : (
            section.subsections.map((subsection) => {
              const isSubExpanded = Boolean(expandedSubsections[subsection.id]);
              return (
                <div key={subsection.id} className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/60 overflow-hidden shadow-2xs">
                  
                  {/* Subsection Header */}
                  <div 
                    onClick={() => toggleSubsection(subsection.id)}
                    className="flex items-center justify-between px-3.5 py-3 cursor-pointer select-none hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-2">
                      {isSubExpanded ? (
                        <ChevronDown className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                      <span>{subsection.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal lowercase">
                        ({subsection.questions.length} questions)
                      </span>
                    </h4>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddQuestionToSection(section.id, subsection.id);
                      }}
                      className="text-[11px] text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Submit Question</span>
                    </button>
                  </div>

                  {/* Question Items list */}
                  {isSubExpanded && (
                    <div className="grid grid-cols-1 gap-2 p-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/40 bg-slate-50/60 dark:bg-slate-950/20">
                      {subsection.questions.map((question) => (
                        <QuestionRow
                          key={question.id}
                          question={question}
                          onToggleComplete={onToggleQuestion}
                          onUpdateQuestion={onUpdateQuestion}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
