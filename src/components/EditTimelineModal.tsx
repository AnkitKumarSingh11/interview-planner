'use client';

import React, { useState } from 'react';
import { Section } from '@/types/tracker';
import { Calendar, Clock, X, Check } from 'lucide-react';

interface EditTimelineModalProps {
  section: Section;
  isOpen: boolean;
  onClose: () => void;
  onSaveTimeline: (sectionId: string, startDate: string, endDate: string) => void;
}

export const EditTimelineModal: React.FC<EditTimelineModalProps> = ({
  section,
  isOpen,
  onClose,
  onSaveTimeline,
}) => {
  const [startDate, setStartDate] = useState(section.startDate || '');
  const [endDate, setEndDate] = useState(section.endDate || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTimeline(section.id, startDate, endDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit Timeline</h3>
              <p className="text-xs text-slate-400 truncate max-w-[240px]">
                {section.sectionTitle}
              </p>
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
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Start Date / Target
            </label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="e.g. 04 Sep or 2026-09-04"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              End Date / Target
            </label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="e.g. 10 Sep or 2026-09-10"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Quick Presets */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Popular Format Examples
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: '04 Sep - 10 Sep', start: '04 Sep', end: '10 Sep' },
                { label: '11 Sep - 17 Sep', start: '11 Sep', end: '17 Sep' },
                { label: '18 Sep - 25 Sep', start: '18 Sep', end: '25 Sep' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setStartDate(preset.start);
                    setEndDate(preset.end);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-800/70 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700/50 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
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
              <Check className="w-4 h-4" />
              Save Timeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
