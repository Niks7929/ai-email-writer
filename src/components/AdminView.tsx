import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Mail,
  FileText,
  Activity,
  Trash2,
  TrendingUp,
  User as UserIcon,
  UserPlus,
  UserCheck,
  UserX,
  Sliders,
  Server,
  Key,
  Database,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
  Sparkles,
  Settings,
} from 'lucide-react';
import { User, Email, EmailTemplate, ActivityLog } from '../types';

interface AdminViewProps {
  users: User[];
  emails: Email[];
  templates: EmailTemplate[];
  activityLogs: ActivityLog[];
  onUpdateUserRole?: (userId: number, newRole: 'Admin' | 'User') => void;
  onToggleUserStatus?: (userId: number) => void;
  onDeleteUser?: (userId: number) => void;
  onDeleteEmail?: (emailId: number) => void;
  onAddUser?: (fullname: string, email: string, role: 'Admin' | 'User', phone: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  users,
  emails,
  templates,
  activityLogs,
  onUpdateUserRole,
  onToggleUserStatus,
  onDeleteUser,
  onDeleteEmail,
  onAddUser,
}) => {
  const [adminTab, setAdminTab] = useState<'users' | 'emails' | 'smtp' | 'logs'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newFullname, setNewFullname] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<'Admin' | 'User'>('User');
  const [selectedPreviewEmail, setSelectedPreviewEmail] = useState<Email | null>(null);

  // SMTP System Settings state (Admin control)
  const [smtpHost, setSmtpHost] = useState('smtp.aiemail.net');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpEncryption, setSmtpEncryption] = useState('TLS / STARTTLS');
  const [maxAiQuota, setMaxAiQuota] = useState('500');
  const [smtpSavedMessage, setSmtpSavedMessage] = useState(false);

  // Local state for users if callbacks not passed
  const [localUsers, setLocalUsers] = useState<
    (User & { status?: 'Active' | 'Suspended' })[]
  >(
    users.map((u) => ({ ...u, status: u.role === 'Admin' ? 'Active' : 'Active' }))
  );

  const [localEmails, setLocalEmails] = useState<Email[]>(emails);

  const handleRoleToggle = (userId: number, currentRole: 'Admin' | 'User') => {
    const nextRole = currentRole === 'Admin' ? 'User' : 'Admin';
    setLocalUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
    );
    if (onUpdateUserRole) onUpdateUserRole(userId, nextRole);
  };

  const handleStatusToggle = (userId: number) => {
    setLocalUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' }
          : u
      )
    );
    if (onToggleUserStatus) onToggleUserStatus(userId);
  };

  const handleDeleteUserClick = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user from the system?')) {
      setLocalUsers((prev) => prev.filter((u) => u.id !== userId));
      if (onDeleteUser) onDeleteUser(userId);
    }
  };

  const handleDeleteEmailClick = (emailId: number) => {
    if (window.confirm('Are you sure you want to delete this email from system history?')) {
      setLocalEmails((prev) => prev.filter((e) => e.id !== emailId));
      if (onDeleteEmail) onDeleteEmail(emailId);
      if (selectedPreviewEmail?.id === emailId) setSelectedPreviewEmail(null);
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullname || !newEmail) return;

    const newUserObj: User & { status?: 'Active' | 'Suspended' } = {
      id: Date.now(),
      fullname: newFullname,
      email: newEmail,
      phone: newPhone || '+91 90000 00000',
      profile: '',
      role: newRole,
      status: 'Active',
      created_at: new Date().toISOString(),
    };

    setLocalUsers((prev) => [...prev, newUserObj]);
    if (onAddUser) onAddUser(newFullname, newEmail, newRole, newPhone);

    setNewFullname('');
    setNewEmail('');
    setNewPhone('');
    setShowAddUserModal(false);
  };

  const handleSaveSmtpSettings = () => {
    setSmtpSavedMessage(true);
    setTimeout(() => setSmtpSavedMessage(false), 3000);
  };

  const filteredUsers = localUsers.filter(
    (u) =>
      u.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEmails = localEmails.filter(
    (e) =>
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.recipient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Control Console</h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
              Super Admin Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Exclusive System Management: User roles, account access controls, global email audits, & SMTP configuration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add System User</span>
          </button>
        </div>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Registered Users</span>
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{localUsers.length}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Full Administrative Control</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">System Emails Logged</span>
            <Mail className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{localEmails.length}</p>
          <span className="text-[10px] text-indigo-600 font-medium">Audited & Monitored</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Email Templates</span>
            <FileText className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{templates.length}</p>
          <span className="text-[10px] text-slate-400 font-medium">Available to all Users</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">SMTP Server Status</span>
            <Server className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2">CONNECTED : 587</p>
          <span className="text-[10px] text-slate-400 font-medium">smtp.aiemail.net</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
            adminTab === 'users'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>User Management ({localUsers.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('emails')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
            adminTab === 'emails'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Mail className="h-4 w-4" />
          <span>Global Email Audit ({localEmails.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('smtp')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
            adminTab === 'smtp'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>SMTP & AI Settings</span>
        </button>

        <button
          onClick={() => setAdminTab('logs')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
            adminTab === 'logs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Audit Logs ({activityLogs.length})</span>
        </button>
      </div>

      {/* Search Input Bar */}
      {(adminTab === 'users' || adminTab === 'emails') && (
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={adminTab === 'users' ? 'Search users by name or email...' : 'Search global emails by recipient or subject...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
      )}

      {/* TAB 1: USER MANAGEMENT */}
      {adminTab === 'users' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" /> Admin Access Controls & User Roles
            </h3>
            <span className="text-xs text-slate-500">
              Admin can change roles, suspend/activate accounts, or add new users.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="py-3 px-3">User Profile</th>
                  <th className="py-3 px-3">Email Contact</th>
                  <th className="py-3 px-3">Role Status</th>
                  <th className="py-3 px-3">Account State</th>
                  <th className="py-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => {
                  const isSuspended = u.status === 'Suspended';
                  return (
                    <tr key={u.id} className={isSuspended ? 'bg-red-50/40 dark:bg-red-950/20' : ''}>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {u.profile ? (
                            <img src={u.profile} alt={u.fullname} className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold">
                              {u.fullname.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{u.fullname}</p>
                            <span className="text-[10px] text-slate-400">{u.phone || 'No phone'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{u.email}</td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          title="Click to toggle Admin / User role"
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                            u.role === 'Admin'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-200'
                          }`}
                        >
                          <ShieldCheck className="h-3 w-3" />
                          <span>{u.role}</span>
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            isSuspended
                              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {isSuspended ? <Lock className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                          <span>{isSuspended ? 'Suspended' : 'Active'}</span>
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStatusToggle(u.id)}
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                              isSuspended
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {isSuspended ? 'Activate' : 'Suspend'}
                          </button>

                          <button
                            onClick={() => handleDeleteUserClick(u.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL EMAIL AUDIT */}
      {adminTab === 'emails' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-600" /> Global System Email Inspector
            </h3>
            <span className="text-xs text-slate-500">
              Admin has full read & delete rights over all user-generated content.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Recipient</th>
                  <th className="py-3 px-3">Tone & Purpose</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEmails.map((e) => (
                  <tr key={e.id}>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {e.subject}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{e.recipient}</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {e.tone || 'Formal'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          e.status === 'Sent'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPreviewEmail(e)}
                          className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEmailClick(e.id)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Email Inspect Drawer/Modal */}
          {selectedPreviewEmail && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/40">
              <div className="flex items-center justify-between border-b border-indigo-200/60 pb-2.5 dark:border-indigo-900/60">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    Email Inspection Preview (ID #{selectedPreviewEmail.id})
                  </h4>
                  <p className="text-[11px] text-slate-500">To: {selectedPreviewEmail.recipient}</p>
                </div>
                <button
                  onClick={() => setSelectedPreviewEmail(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Subject: {selectedPreviewEmail.subject}
                </p>
                <div
                  className="rounded-lg bg-white p-3 text-xs text-slate-800 shadow-xs dark:bg-slate-900 dark:text-slate-200 prose prose-xs max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedPreviewEmail.content }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SMTP & AI SYSTEM CONFIGURATION */}
      {adminTab === 'smtp' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* SMTP Credentials Admin Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-600" /> System SMTP Protocol Credentials
            </h3>
            <p className="text-xs text-slate-500">
              Admin defines the default SMTP mail relay server for all users sending emails via protocol.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">SMTP Host Server</label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Server Port</label>
                  <input
                    type="text"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Encryption</label>
                  <select
                    value={smtpEncryption}
                    onChange={(e) => setSmtpEncryption(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="TLS / STARTTLS">TLS / STARTTLS (587)</option>
                    <option value="SSL">SSL (465)</option>
                    <option value="None">None (25)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSaveSmtpSettings}
                className="w-full rounded-xl bg-indigo-600 py-2.5 font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Save SMTP System Credentials
              </button>

              {smtpSavedMessage && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle className="h-4 w-4" />
                  <span>SMTP Configuration updated successfully!</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Model Quotas & Governance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" /> AI Generation Engine & User Quotas
            </h3>
            <p className="text-xs text-slate-500">
              Configure Google Gemini 3.6 Flash parameters and maximum generation limit per user.
            </p>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <span className="font-bold text-slate-800 dark:text-slate-200">Active AI Model:</span>
                <p className="text-indigo-600 font-mono text-xs font-bold mt-0.5">Gemini 3.6 Flash (Server Proxy Secured)</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Monthly AI Generation Quota (per user)</label>
                <input
                  type="number"
                  value={maxAiQuota}
                  onChange={(e) => setMaxAiQuota(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Admin Safety Governance</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  System automatically screens all generated email content for spam keywords, tone clarity, and safety policy compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {adminTab === 'logs' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600" /> Real-Time System Audit Logs
            </h3>
            <span className="text-xs text-slate-400">Showing last {activityLogs.length} events</span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{log.action}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-indigo-600" /> Register New System User
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newFullname}
                  onChange={(e) => setNewFullname(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Initial Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'Admin' | 'User')}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="User">Standard User</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-indigo-700"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

