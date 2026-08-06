import React, { useState, useRef, useEffect } from 'react';
import { Mail, Moon, Sun, Bell, User as UserIcon, HelpCircle, Shield, ShieldCheck, CheckCheck, Info, Sparkles, LogOut } from 'lucide-react';
import { User, ActiveTab } from '../types';

interface NavbarProps {
  user: User;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  setActiveTab: (tab: ActiveTab) => void;
  activeTab: ActiveTab;
  onToggleRole?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  darkMode,
  setDarkMode,
  setActiveTab,
  activeTab,
  onToggleRole,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to AI Email Writer', time: 'Just now', read: false, type: 'info' },
    { id: 2, title: 'WAMP & Python Setup Guide is available', time: '10 mins ago', read: false, type: 'system' },
    { id: 3, title: `Switched mode to ${user.role}`, time: '1 hour ago', read: true, type: 'role' },
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-3.5 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 text-white shadow-md shadow-indigo-500/20">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              AI Email Writer
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent Email Generation & Management System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('wamp-guide')}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
            activeTab === 'wamp-guide'
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          <HelpCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Local WAMP / Python Setup</span>
        </button>

        {/* Role Toggle Button */}
        {onToggleRole && (
          <button
            onClick={onToggleRole}
            title="Click to switch between Admin and User role"
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-all ${
              user.role === 'Admin'
                ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {user.role === 'Admin' ? (
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Shield className="h-3.5 w-3.5 text-slate-500" />
            )}
            <span>Role: {user.role}</span>
            <span className="text-[10px] opacity-75 font-normal underline">(Switch)</span>
          </button>
        )}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    <CheckCheck className="h-3 w-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-64 space-y-1.5 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                      );
                    }}
                    className={`flex items-start gap-2.5 rounded-xl p-2.5 transition-colors cursor-pointer ${
                      n.read
                        ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        : 'bg-indigo-50/70 hover:bg-indigo-50 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60'
                    }`}
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                      <Info className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${n.read ? 'text-slate-600 dark:text-slate-400' : 'font-semibold text-slate-900 dark:text-white'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2.5 rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {user.profile ? (
            <img
              src={user.profile}
              alt={user.fullname}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500/30 dark:bg-indigo-950 dark:text-indigo-400">
              <UserIcon className="h-4 w-4" />
            </div>
          )}
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.fullname}</p>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{user.role}</p>
          </div>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Sign Out / Switch Account"
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/50 dark:hover:text-red-300 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
};

