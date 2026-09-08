'use client';

import React from 'react';
import { Target, Sparkles, BookOpen, Layers } from 'lucide-react';

interface InitialLoaderProps {
  title?: string;
  subtitle?: string;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({
  title = 'Planly',
  subtitle = 'Preparing your interview roadmap...',
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden select-none">
      
      {/* Background Animated Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl animate-pulse delay-700 pointer-events-none" />

      {/* Main SVG Animated Center Piece */}
      <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
        
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <div className="absolute w-28 h-28 rounded-full border border-indigo-500/20 animate-ping duration-1000" />

          {/* Rotating Dashed SVG Ring */}
          <svg className="w-24 h-24 animate-spin text-indigo-500/40" style={{ animationDuration: '8s' }} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Inner Glowing Badge Icon */}
          <div className="absolute p-4 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-2xl shadow-xl shadow-indigo-500/30 text-white flex items-center justify-center transform transition-transform hover:scale-105">
            <Target className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        {/* Brand & Loading Label */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              {title}
            </h1>
            <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
          </div>

          <p className="text-xs font-medium text-slate-400 animate-pulse flex items-center justify-center gap-1.5">
            <span>{subtitle}</span>
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex items-center gap-3 pt-2 text-[11px] font-medium text-slate-500">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 rounded-full border border-slate-800/80 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>DSA & LLD</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 rounded-full border border-slate-800/80 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Timeline Tracker</span>
          </div>
        </div>
      </div>
    </div>
  );
};
