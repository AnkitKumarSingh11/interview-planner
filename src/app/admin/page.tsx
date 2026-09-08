'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Track, Section, Question } from '@/types/tracker';
import { 
  ShieldCheck, 
  KeyRound, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Edit2, 
  ExternalLink, 
  FileText, 
  Clock, 
  FolderKanban, 
  BookOpen, 
  Layers 
} from 'lucide-react';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { AddSectionModal } from '@/components/AddSectionModal';
import { AddTrackModal } from '@/components/AddTrackModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { InitialLoader } from '@/components/InitialLoader';
import { useToast } from '@/components/Toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeTrackId, setActiveTrackId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('planly_admin_active_track_id') || 'dsa';
    }
    return 'dsa';
  });
  const [pendingQuestions, setPendingQuestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'syllabus'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('planly_admin_active_tab') as any) || 'pending';
    }
    return 'pending';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const handleTrackChange = (id: string) => {
    setActiveTrackId(id);
    try {
      localStorage.setItem('planly_admin_active_track_id', id);
    } catch (e) {}
  };

  const handleTabChange = (tab: 'pending' | 'syllabus') => {
    setActiveTab(tab);
    try {
      localStorage.setItem('planly_admin_active_tab', tab);
    } catch (e) {}
  };

  // Confirm Modal state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Modals state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isAddTrackOpen, setIsAddTrackOpen] = useState(false);

  // 1. Strict Authentication Guard
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check-auth');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchAdminData();
        } else {
          setIsAuthenticated(false);
          router.replace('/admin/login');
        }
      } catch (e) {
        setIsAuthenticated(false);
        router.replace('/admin/login');
      }
    };

    checkAuth();
  }, []);

  const fetchAdminData = async () => {
    try {
      const pendingRes = await fetch('/api/admin/pending');
      if (pendingRes.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const pendingData = await pendingRes.json();
      if (Array.isArray(pendingData)) setPendingQuestions(pendingData);

      const tracksRes = await fetch('/api/tracks');
      const tracksData = await tracksRes.json();
      if (Array.isArray(tracksData) && tracksData.length > 0) {
        setTracks(tracksData);
        if (!activeTrackId || !tracksData.some(t => t.id === activeTrackId)) {
          setActiveTrackId(tracksData[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.replace('/admin/login');
    } catch (e) {
      console.error('Failed to log out:', e);
    }
  };

  const handleApprove = async (questionId: string) => {
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, action: 'approve' }),
      });
      if (res.ok) {
        showToast('Question approved & published live!', 'success');
        fetchAdminData();
      }
    } catch (e) {
      console.error('Failed to approve question:', e);
    }
  };

  const handleReject = async (questionId: string) => {
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, action: 'reject' }),
      });
      if (res.ok) {
        showToast('Question submission rejected.', 'info');
        fetchAdminData();
      }
    } catch (e) {
      console.error('Failed to reject question:', e);
    }
  };

  const handleSaveTimeline = async (sectionId: string, startDate: string, endDate: string) => {
    try {
      await fetch('/api/sections/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, startDate, endDate }),
      });
      showToast('Topic timeline updated successfully!', 'success');
      fetchAdminData();
    } catch (e) {
      console.error('Failed to update timeline:', e);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Topic Section?',
      message: 'Are you sure you want to delete this main topic and all its sub-sections/questions? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await fetch('/api/sections/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sectionId }),
          });
          showToast('Topic section deleted.', 'info');
          fetchAdminData();
        } catch (e) {
          console.error('Failed to delete section:', e);
        }
      },
    });
  };

  const handleDeleteSubsection = (subsectionId: string, title: string) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete Sub-section "${title}"?`,
      message: `Are you sure you want to delete the sub-section "${title}" and all its questions? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await fetch('/api/subsections/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subsectionId }),
          });
          showToast(`Sub-section "${title}" deleted.`, 'info');
          fetchAdminData();
        } catch (e) {
          console.error('Failed to delete subsection:', e);
        }
      },
    });
  };

  const handleAddSection = async (sectionData: any) => {
    if (!activeTrackId) return;
    try {
      await fetch('/api/sections/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: activeTrackId,
          ...sectionData,
        }),
      });
      showToast('New topic section created!', 'success');
      fetchAdminData();
    } catch (e) {
      console.error('Failed to add section:', e);
    }
  };

  const handleAddTrack = async (title: string, description: string) => {
    try {
      const res = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.trackId) {
        showToast('New track created!', 'success');
        fetchAdminData();
        setActiveTrackId(data.trackId);
      }
    } catch (e) {
      console.error('Failed to add track:', e);
    }
  };

  const handleDeleteTrack = (trackId: string) => {
    if (tracks.length <= 1) {
      showToast('You cannot delete the only remaining track. At least one track must exist.', 'error');
      return;
    }
    const trackToDelete = tracks.find((t) => t.id === trackId);
    
    setConfirmDialog({
      isOpen: true,
      title: `Delete Track "${trackToDelete?.title || 'Track'}"?`,
      message: `Are you sure you want to delete the track "${
        trackToDelete?.title || trackId
      }" and all its topic sections and questions? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch('/api/tracks/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trackId }),
          });
          if (res.ok) {
            showToast('Track deleted successfully.', 'info');
            fetchAdminData();
            const remaining = tracks.filter((t) => t.id !== trackId);
            if (remaining.length > 0) {
              setActiveTrackId(remaining[0].id);
            }
          }
        } catch (e) {
          console.error('Failed to delete track:', e);
        }
      },
    });
  };

  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks[0];

  // If unauthenticated or checking auth status, do not render Admin Dashboard UI
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <InitialLoader 
        title="Planly Admin" 
        subtitle="Verifying Admin Security Clearance..." 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Planly Admin Portal</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                  Admin: AnkitAvi11
                </span>
              </div>
              <p className="text-xs text-slate-400">Syllabus Management & Question Approval Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all flex items-center gap-1"
            >
              <span>Public Tracker</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl transition-all"
            >
              <KeyRound className="w-4 h-4 text-indigo-400" />
              <span>Change Password</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs (Pending Approvals vs Syllabus Manager) */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => handleTabChange('pending')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pending Question Approvals</span>
            <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-full">
              {pendingQuestions.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('syllabus')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'syllabus'
                ? 'bg-indigo-600 text-white shadow border border-indigo-500'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Syllabus & Topic Manager</span>
          </button>
        </div>

        {/* Tab 1: Pending Question Approvals Queue */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Pending Submissions Queue
              </h2>
              <span className="text-xs text-slate-400">
                Only questions approved here will appear live on the public roadmap
              </span>
            </div>

            {pendingQuestions.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-300">All caught up!</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  There are currently no user-submitted questions waiting for your approval.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                          {q.track_title}
                        </span>
                        <span className="text-sm font-semibold text-slate-200">
                          {q.parent_topic} → <span className="text-indigo-300">{q.subsection_title}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Submitted: {new Date(q.submitted_at).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-bold text-white">{q.title}</h3>
                        <span
                          className={`px-3 py-0.5 text-xs font-semibold rounded-full border ${
                            q.difficulty === 'Easy'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : q.difficulty === 'Medium'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      {q.url && (
                        <a
                          href={q.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{q.url}</span>
                        </a>
                      )}

                      {q.notes && (
                        <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2 mt-2">
                          <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{q.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => handleReject(q.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Submission
                      </button>

                      <button
                        onClick={() => handleApprove(q.id)}
                        className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve & Publish Live
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Syllabus & Topic Manager */}
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            
            {/* Track Switcher & Add Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 overflow-x-auto">
                {tracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => handleTrackChange(track.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      track.id === activeTrackId
                        ? 'bg-indigo-600 text-white shadow border border-indigo-500'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{track.title}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddSectionOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Topic Section</span>
                </button>

                <button
                  onClick={() => setIsAddTrackOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Track</span>
                </button>

                {activeTrack && tracks.length > 1 && (
                  <button
                    onClick={() => handleDeleteTrack(activeTrack.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Track</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of Topic Sections with Admin Management Controls */}
            {activeTrack && (
              <div className="space-y-4">
                {activeTrack.sections.map((sec) => (
                  <div
                    key={sec.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="w-5 h-5 text-indigo-400" />
                          <h3 className="text-lg font-bold text-white">{sec.topic}</h3>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2">
                          <span>{sec.subsections.length} Sub-sections</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Topic</span>
                        </button>
                      </div>
                    </div>

                    {/* Sub-sections & Questions list */}
                    <div className="space-y-3 pt-1">
                      {sec.subsections.map((sub) => (
                        <div key={sub.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                              <Layers className="w-3.5 h-3.5" />
                              {sub.title} ({sub.questions.length} questions)
                            </h4>
                            <button
                              onClick={() => handleDeleteSubsection(sub.id, sub.title)}
                              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Sub-section</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-1.5">
                            {sub.questions.map((q) => (
                              <div
                                key={q.id}
                                className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800/80 text-xs"
                              >
                                <span className="font-medium text-slate-200">{q.title}</span>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                                      q.difficulty === 'Easy'
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : q.difficulty === 'Medium'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                    }`}
                                  >
                                    {q.difficulty}
                                  </span>
                                  {q.url && (
                                    <a
                                      href={q.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-slate-400 hover:text-indigo-400"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        Planly Admin Portal • Signed in as AnkitAvi11
      </footer>

      {/* Modals */}
      <ChangePasswordModal
        username="AnkitAvi11"
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onAddSection={handleAddSection}
      />

      <AddTrackModal
        isOpen={isAddTrackOpen}
        onClose={() => setIsAddTrackOpen(false)}
        onAddTrack={handleAddTrack}
      />

      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
