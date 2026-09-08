'use client';

import React, { useState, useEffect } from 'react';
import { Track } from '@/types/tracker';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Target,
  ShieldCheck,
  User,
  LogIn,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  tracks: Track[];
  activeTrackId: string;
  onSelectTrack: (trackId: string) => void;
  onOpenAddQuestion: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: { id: string; username: string; role: string } | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tracks,
  activeTrackId,
  onSelectTrack,
  onOpenAddQuestion,
  searchQuery,
  onSearchChange,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Top Navbar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          
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
                  Interview Preparation Tracker
                </span>
              </div>
              <p className="text-xs text-slate-400">Roadmap & Progress Tracker</p>
            </div>
          </div>

          {/* Search & Submit Question */}
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

            {/* Action Button */}
            <button
              onClick={onOpenAddQuestion}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Question</span>
            </button>

            {/* User Auth / Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{currentUser.username}</span>
                  {currentUser.role === 'ADMIN' && (
                    <span className="px-1.5 py-0.2 text-[10px] bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-400 p-1 hover:bg-slate-700 rounded transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-lg transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Admin Portal Link */}
            <a
              href="/admin"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all ml-1"
              title="Admin Portal Login"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </a>
          </div>
        </div>
      </div>

      {/* Track Selector Bar */}
      <div className="border-t border-slate-800/80 bg-slate-900/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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
          </div>
        </div>
      </div>
    </header>
  );
};
