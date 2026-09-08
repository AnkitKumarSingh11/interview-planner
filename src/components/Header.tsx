'use client';

import React from 'react';
import { Track } from '@/types/tracker';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  RotateCcw, 
  Calendar, 
  CheckCircle2, 
  Target 
} from 'lucide-react';

interface HeaderProps {
  tracks: Track[];
  activeTrackId: string;
  onSelectTrack: (trackId: string) => void;
  onOpenAddTrack: () => void;
  onOpenAddQuestion: () => void;
  onOpenAddSection: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDefaults: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tracks,
  activeTrackId,
  onSelectTrack,
  onOpenAddTrack,
  onOpenAddQuestion,
  onOpenAddSection,
  searchQuery,
  onSearchChange,
  onExportData,
  onImportData,
  onResetDefaults,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Logo and App Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Planly
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  Interview Tracker
                </span>
              </div>
              <p className="text-xs text-slate-400">Roadmap & Timeline Progress Manager</p>
            </div>
          </div>

          {/* Quick Actions & Search */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search topics or questions..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <button
              onClick={onOpenAddQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>

            <button
              onClick={onOpenAddSection}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>

            {/* Export / Import / Reset */}
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={onExportData}
                title="Export Data JSON"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Import Data JSON"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={onImportData}
                className="hidden"
              />
              <button
                onClick={onResetDefaults}
                title="Reset Default Syllabi"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Track Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
          {tracks.map((track) => {
            const isActive = track.id === activeTrackId;
            return (
              <button
                key={track.id}
                onClick={() => onSelectTrack(track.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 border border-indigo-400/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <BookOpen className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{track.title}</span>
              </button>
            );
          })}

          <button
            onClick={onOpenAddTrack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 border border-dashed border-indigo-500/30 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Track</span>
          </button>
        </div>
      </div>
    </header>
  );
};
