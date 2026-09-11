'use client';

import React from 'react';
import { 
  User, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  ChevronRight
} from 'lucide-react';

interface ProfileDropdownProps {
  currentUser: { id: string; username: string; role: string } | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  currentUser,
  isOpen,
  onClose,
  onLogout,
  onOpenAuthModal,
}) => {
  if (!isOpen) return null;

  const initials = currentUser
    ? currentUser.username.slice(0, 2).toUpperCase()
    : 'GS';

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-2 z-50 animate-in fade-in duration-150 text-slate-900 dark:text-slate-100"
    >
      {/* User Info Card */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl mb-1 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 text-white flex items-center justify-center font-extrabold text-xs shadow-xs shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentUser ? currentUser.username : 'Guest User'}
            </h4>
            {currentUser?.role === 'ADMIN' && (
              <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded-full border border-amber-500/30">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {currentUser ? 'Logged in account' : 'Local browser mode'}
          </p>
        </div>
      </div>

      {/* Menu Actions */}
      <div className="space-y-0.5">
        {/* Profile Page Link */}
        <a
          href="/profile"
          onClick={onClose}
          className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Profile & Track Stats</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </a>

        {/* Admin Portal Link if Admin */}
        {currentUser?.role === 'ADMIN' && (
          <a
            href="/admin"
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Portal</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </a>
        )}

        {/* Logout / Sign In Action */}
        {currentUser ? (
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => {
              onClose();
              onOpenAuthModal();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
