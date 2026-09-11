'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Track } from '@/types/tracker';
import { ThemeToggle } from './ThemeToggle';
import { ProfileDropdown } from './ProfileDropdown';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Target,
  ShieldCheck,
  User,
  LogIn,
  LogOut,
  Loader2,
  Bell,
  Flame,
  ChevronDown
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
  isLoggingOut?: boolean;
  onOpenProfileModal?: () => void;
  currentStreak: number;
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
  isLoggingOut = false,
  onOpenProfileModal,
  currentStreak,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHoveringUser, setIsHoveringUser] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHoveringUser(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHoveringUser(false);
    }, 200);
  };

  const handleProfileClick = () => {
    if (onOpenProfileModal) {
      onOpenProfileModal();
    } else {
      window.location.href = '/profile';
    }
  };

  const initials = currentUser
    ? currentUser.username.slice(0, 2).toUpperCase()
    : 'GS';

  return (
    <header
      className={`sticky top-0 z-40 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/90 shadow-sm transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Top Navbar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Logo and App Brand */}
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-tr from-teal-600 to-teal-500 rounded-xl shadow-md shadow-teal-500/20 text-white group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Planly
                  </h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 rounded-full">
                    Interview Tracker
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Preparation & Timeline Manager</p>
              </div>
            </a>
          </div>

          {/* Search, Theme Toggle & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Search Input - Pill Shape */}
            <div className="relative flex-1 min-w-[180px] sm:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search topics or questions..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>

            {/* Theme Toggle Button (Sun / Moon) */}
            <div className="flex items-center" title="Toggle Light / Dark Mode">
              <ThemeToggle />
            </div>

            {/* Notification Bell Badge */}
            <button 
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Submit Question Action Button */}
            <button
              onClick={onOpenAddQuestion}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Question</span>
            </button>

            {/* User Profile Avatar with Hover Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full p-1 pr-2.5 transition-all cursor-pointer shadow-2xs"
                title="View Profile & Track Statistics"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {initials}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>{currentUser ? currentUser.username : 'Profile'}</span>

                  {currentStreak > 0 && (
                    <span className="flex items-center gap-0.5 text-[11px] text-amber-600 dark:text-amber-400 font-extrabold bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.2 rounded-full border border-amber-200 dark:border-amber-500/20">
                      <Flame className="w-3 h-3 fill-current" />
                      {currentStreak}
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isHoveringUser ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Hover Dropdown Menu */}
              <ProfileDropdown
                currentUser={currentUser}
                isOpen={isHoveringUser}
                onClose={() => setIsHoveringUser(false)}
                onLogout={onLogout}
                onOpenAuthModal={onOpenAuthModal}
              />
            </div>

            {/* Admin Portal Quick Icon Link */}
            <a
              href="/admin"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full transition-all"
              title="Admin Portal Login"
            >
              <ShieldCheck className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Track Selector Navigation Pill Bar */}
      <div className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {tracks.map((track) => {
              const isActive = track.id === activeTrackId;
              return (
                <button
                  key={track.id}
                  onClick={() => onSelectTrack(track.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 border border-teal-500'
                      : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <BookOpen className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
