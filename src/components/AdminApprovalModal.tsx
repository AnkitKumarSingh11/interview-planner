'use client';

import React from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  FileText, 
  Clock 
} from 'lucide-react';

interface PendingQuestion {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  url?: string;
  notes?: string;
  submitted_at: string;
  subsection_title: string;
  parent_topic: string;
  track_title: string;
}

interface AdminApprovalModalProps {
  pendingQuestions: PendingQuestion[];
  isOpen: boolean;
  onClose: () => void;
  onApprove: (questionId: string) => void;
  onReject: (questionId: string) => void;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  pendingQuestions,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Admin Review & Approval Queue
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                  {pendingQuestions.length} Pending
                </span>
              </h3>
              <p className="text-xs text-slate-400">Review user-submitted questions before publishing live</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Pending Questions */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {pendingQuestions.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-300">All submissions reviewed!</p>
              <p className="text-xs text-slate-500">There are currently no pending questions waiting for approval.</p>
            </div>
          ) : (
            pendingQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                      {q.track_title}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {q.parent_topic} → <span className="text-indigo-300">{q.subsection_title}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(q.submitted_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center justify-between gap-2">
                    <span>{q.title}</span>
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
                  </h4>

                  {q.url && (
                    <a
                      href={q.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1 pt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{q.url}</span>
                    </a>
                  )}

                  {q.notes && (
                    <p className="text-xs text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800/80 flex items-start gap-1.5 mt-2">
                      <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{q.notes}</span>
                    </p>
                  )}
                </div>

                {/* Approve / Reject Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                  <button
                    onClick={() => onReject(q.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={() => onApprove(q.id)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve & Publish Live
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
