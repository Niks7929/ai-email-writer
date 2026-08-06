import React from 'react';
import {
  LayoutDashboard,
  Wand2,
  Heading,
  MessageSquareReply,
  FileText,
  History,
  Send,
  ShieldCheck,
  User,
  BookOpen,
  PlusCircle,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator', label: 'AI Email Writer', icon: Wand2, highlight: true },
    { id: 'subject-generator', label: 'Subject Line Generator', icon: Heading },
    { id: 'smart-reply', label: 'Smart Reply & Summary', icon: MessageSquareReply },
    { id: 'templates', label: 'Email Templates', icon: FileText },
    { id: 'history', label: 'Email History & Drafts', icon: History },
    { id: 'smtp-sender', label: 'SMTP Mail Sender', icon: Send },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-slate-50/50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('generator')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New AI Email</span>
        </button>
      </div>

      <nav className="space-y-6">
        <div>
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Main Navigation
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-600'
                      : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Management & Admin
          </p>
          <div className="space-y-1">
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/80'
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-amber-500" />
                <span>Admin Control Panel</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/80'
              }`}
            >
              <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span>Profile & Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('wamp-guide')}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                activeTab === 'wamp-guide'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40'
              }`}
            >
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Python & WAMP Setup Guide</span>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};
