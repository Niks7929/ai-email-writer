/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { GeneratorView } from './components/GeneratorView';
import { SubjectGeneratorView } from './components/SubjectGeneratorView';
import { SmartReplyView } from './components/SmartReplyView';
import { TemplatesView } from './components/TemplatesView';
import { HistoryView } from './components/HistoryView';
import { MailSenderView } from './components/MailSenderView';
import { AdminView } from './components/AdminView';
import { ProfileView } from './components/ProfileView';
import { WampSetupGuideModal } from './components/WampSetupGuideModal';
import { AuthModal } from './components/AuthModal';

import { User, Email, EmailTemplate, ActivityLog, ActiveTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('app_authenticated') === 'true';
  });

  // Core Data States
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('app_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        // ignore parse error
      }
    }
    return {
      id: 1,
      fullname: 'Nikita Chaudhari',
      email: 'nikitachaudhari7929@gmail.com',
      phone: '+91 98765 43210',
      profile: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'Admin',
      created_at: new Date().toISOString(),
    };
  });

  const [users, setUsers] = useState<User[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [selectedEmailForGenerator, setSelectedEmailForGenerator] = useState<Email | null>(null);

  // Sync dark mode class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch Initial Data from Server State
  useEffect(() => {
    fetch('/api/state')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUsers(data.data.users || []);
          setEmails(data.data.emails || []);
          setTemplates(data.data.templates || []);
          setFavorites(data.data.favorites || []);
          setActivityLogs(data.data.activityLogs || []);
          if (data.data.users && data.data.users[0]) {
            setUser(data.data.users[0]);
          }
        }
      })
      .catch((err) => console.error('Failed to load initial state:', err));
  }, []);

  // Save Email / Draft
  const handleSaveEmail = async (emailData: Partial<Email>) => {
    try {
      const res = await fetch('/api/email/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });
      const data = await res.json();
      if (data.success && data.emails) {
        setEmails(data.emails);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Dispatch Email via SMTP
  const handleSendSmtp = async (recipient: string, subject: string, content: string) => {
    try {
      const res = await fetch('/api/email/send-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, subject, content }),
      });
      const data = await res.json();
      if (data.success && data.emails) {
        setEmails(data.emails);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Favorite Template
  const handleToggleFavorite = async (templateId: number) => {
    try {
      const res = await fetch('/api/templates/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });
      const data = await res.json();
      if (data.success && data.favorites) {
        setFavorites(data.favorites);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Custom Template
  const handleAddTemplate = async (
    title: string,
    category: string,
    subject: string,
    body: string
  ) => {
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, subject, body }),
      });
      const data = await res.json();
      if (data.success && data.templates) {
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Email
  const handleDeleteEmail = async (id: number) => {
    try {
      const res = await fetch(`/api/email/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.emails) {
        setEmails(data.emails);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (
    fullname: string,
    email: string,
    phone: string,
    profile: string
  ) => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          role: user.role,
          fullname,
          email,
          phone,
          profile,
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.user) setUser(data.user);
        if (data.users) setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Select Email to open in generator
  const handleSelectEmail = (email: Email) => {
    setSelectedEmailForGenerator(email);
    setActiveTab('generator');
  };

  // Use Template in generator
  const handleUseTemplate = (template: EmailTemplate) => {
    setSelectedEmailForGenerator({
      id: 0,
      user_id: user.id,
      subject: template.subject,
      recipient: 'Recipient',
      purpose: template.category,
      tone: 'Professional',
      content: template.body,
      status: 'Draft',
      created_at: new Date().toISOString(),
    });
  };

  const handleToggleRole = () => {
    const nextRole = user.role === 'Admin' ? 'User' : 'Admin';
    const targetUser = users.find((u) => u.role === nextRole);
    if (targetUser) {
      setUser(targetUser);
    } else {
      const fallbackUser: User = {
        id: nextRole === 'Admin' ? 1 : 2,
        fullname: `Nikita Chaudhari (${nextRole})`,
        email: nextRole === 'Admin' ? 'admin.nikita@gmail.com' : 'user.nikita@gmail.com',
        phone: '+91 98765 43210',
        profile: '',
        role: nextRole,
        created_at: new Date().toISOString(),
      };
      setUser(fallbackUser);
    }
    if (nextRole !== 'Admin' && activeTab === 'admin') {
      setActiveTab('dashboard');
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('app_authenticated', 'true');
    localStorage.setItem('app_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('app_authenticated');
    localStorage.removeItem('app_user');
  };

  if (!isAuthenticated) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <AuthModal isStandaloneScreen={true} onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 font-sans`}>
      <Navbar
        user={user}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        onToggleRole={handleToggleRole}
        onLogout={handleLogout}
      />

      <div className="flex min-h-[calc(100vh-65px)]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={user.role === 'Admin'} />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              emails={emails}
              templates={templates}
              favorites={favorites}
              activityLogs={activityLogs}
              setActiveTab={setActiveTab}
              onSelectEmail={handleSelectEmail}
            />
          )}

          {activeTab === 'generator' && (
            <GeneratorView
              onSaveEmail={handleSaveEmail}
              onSendSmtp={handleSendSmtp}
              initialEmail={selectedEmailForGenerator}
            />
          )}

          {activeTab === 'subject-generator' && <SubjectGeneratorView />}

          {activeTab === 'smart-reply' && <SmartReplyView />}

          {activeTab === 'templates' && (
            <TemplatesView
              templates={templates}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onAddTemplate={handleAddTemplate}
              onUseTemplate={handleUseTemplate}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              emails={emails}
              onDeleteEmail={handleDeleteEmail}
              onSendSmtp={handleSendSmtp}
            />
          )}

          {activeTab === 'smtp-sender' && <MailSenderView onSendSmtp={handleSendSmtp} />}

          {activeTab === 'admin' && user.role === 'Admin' && (
            <AdminView
              users={users}
              emails={emails}
              templates={templates}
              activityLogs={activityLogs}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView user={user} onUpdateProfile={handleUpdateProfile} />
          )}

          {activeTab === 'wamp-guide' && <WampSetupGuideModal />}
        </main>
      </div>
    </div>
  );
}
