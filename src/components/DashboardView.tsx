import React from 'react';
import {
  Mail,
  Send,
  FileEdit,
  Bookmark,
  TrendingUp,
  Plus,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  ListOrdered,
} from 'lucide-react';
import { Email, EmailTemplate, ActivityLog, ActiveTab, User } from '../types';

interface DashboardViewProps {
  user: User;
  emails: Email[];
  templates: EmailTemplate[];
  favorites: number[];
  activityLogs: ActivityLog[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectEmail: (email: Email) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  emails,
  templates,
  favorites,
  activityLogs,
  setActiveTab,
  onSelectEmail,
}) => {
  const totalEmails = emails.length;
  const sentEmails = emails.filter((e) => e.status === 'Sent').length;
  const draftsCount = emails.filter((e) => e.status === 'Draft').length;
  const favoriteTemplatesCount = favorites.length;

  const recentEmails = emails.slice(0, 5);
  const recentLogs = activityLogs.slice(0, 6);

  // Tone distribution calculation
  const toneCounts: Record<string, number> = {};
  emails.forEach((e) => {
    toneCounts[e.tone] = (toneCounts[e.tone] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 p-6 text-white shadow-lg shadow-indigo-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> AI-Powered Copywriting Engine
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user.fullname} 👋</h2>
          <p className="mt-1 text-sm text-indigo-100">
            Generate high-converting professional emails, refine tone with Gemini AI, verify grammar & spam scores, and track your sent messages easily.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('generator')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-600 shadow-sm transition-all hover:bg-slate-100 active:scale-95"
            >
              <Plus className="h-4 w-4" /> Generate Email Now
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              Browse Templates
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Emails</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{totalEmails}</p>
          <div className="mt-2 flex items-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="mr-1 h-3 w-3" /> All AI generated & custom
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Emails Sent</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Send className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{sentEmails}</p>
          <div className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Dispatched via SMTP
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Saved Drafts</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <FileEdit className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{draftsCount}</p>
          <div className="mt-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Ready to edit & send
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Favorite Templates</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <Bookmark className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{favoriteTemplatesCount}</p>
          <div className="mt-2 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            Quick access library
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Generated Emails Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Emails</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest communications generated and saved</p>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
                <tr>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Purpose</th>
                  <th className="py-2.5 px-3">Tone</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentEmails.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                      No emails created yet. Click <span className="font-semibold text-indigo-600 dark:text-indigo-400">"Generate Email Now"</span> to create your first AI email!
                    </td>
                  </tr>
                ) : (
                  recentEmails.map((email) => (
                    <tr key={email.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                        {email.subject}
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{email.purpose}</td>
                      <td className="py-3 px-3">
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          {email.tone}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            email.status === 'Sent'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {email.status === 'Sent' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {email.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectEmail(email)}
                          className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tone Distribution & Activity Log */}
        <div className="space-y-6">
          {/* Tone Usage Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-base font-bold text-slate-900 dark:text-white">Tone Breakdown</h3>
            <div className="space-y-3">
              {['Professional', 'Formal', 'Persuasive', 'Friendly'].map((tone) => {
                const count = toneCounts[tone] || 0;
                const pct = totalEmails ? Math.round((count / totalEmails) * 100) : 0;
                return (
                  <div key={tone} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{tone}</span>
                      <span>{pct}% ({count})</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Logs Feed */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-base font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <div className="space-y-3">
              {recentLogs.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-400">
                  No activity recorded yet. Your AI generation & email sending actions will appear here.
                </p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs">
                    <div className="mt-0.5 rounded-full bg-indigo-50 p-1 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                      <ListOrdered className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{log.action}</p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
