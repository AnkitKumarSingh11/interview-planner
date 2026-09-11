'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('planly_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'dark';
      setTheme(initial);
      if (initial === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('planly_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return <div className="w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme mode"
      className="relative flex items-center justify-between w-16 h-8 p-1 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center transform transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-8 text-teal-400' : 'translate-x-0 text-amber-500'
        }`}
      >
        {theme === 'dark' ? <Moon className="w-3.5 h-3.5 fill-current" /> : <Sun className="w-3.5 h-3.5 fill-current" />}
      </div>
      <Sun className={`w-4 h-4 ml-1 transition-opacity ${theme === 'light' ? 'opacity-0' : 'opacity-60 text-slate-400'}`} />
      <Moon className={`w-4 h-4 mr-1 transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-60 text-slate-500'}`} />
    </button>
  );
};
