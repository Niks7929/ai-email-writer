import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  X,
  Send,
  FileSpreadsheet,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { Email } from '../types';

interface HistoryViewProps {
  emails: Email[];
  onDeleteEmail: (id: number) => void;
  onSendSmtp: (recipient: string, subject: string, content: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  emails,
  onDeleteEmail,
  onSendSmtp,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = emails.filter((e) => {
    const matchesSearch =
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.recipient.toLowerCase().includes(search.toLowerCase()) ||
      e.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCopy = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    navigator.clipboard.writeText(temp.innerText || temp.textContent || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = (email: Email) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(email.subject, 14, 20);
    doc.setFontSize(10);
    doc.text(`To: ${email.recipient} | Purpose: ${email.purpose} | Status: ${email.status}`, 14, 28);
    doc.line(14, 32, 196, 32);

    const temp = document.createElement('div');
    temp.innerHTML = email.content;
    const lines = doc.splitTextToSize(temp.innerText || temp.textContent || '', 180);
    doc.setFontSize(11);
    doc.text(lines, 14, 40);

    doc.save(`${email.subject.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  const handleDownloadDOCX = (email: Email) => {
    const temp = document.createElement('div');
    temp.innerHTML = email.content;
    const plainText = temp.innerText || temp.textContent || '';

    const blob = new Blob([plainText], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${email.subject.replace(/[^a-z0-9]/gi, '_')}.doc`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Email History & Drafts</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View all past generated emails, sent logs, and saved drafts.
          </p>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject, recipient, purpose..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-slate-400" />
          {['All', 'Generated', 'Draft', 'Sent'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Emails Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
            <tr>
              <th className="py-3 px-4">Subject & Recipient</th>
              <th className="py-3 px-4">Purpose</th>
              <th className="py-3 px-4">Tone</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Created Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((email) => (
              <tr key={email.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4">
                  <p className="font-bold text-slate-900 dark:text-white max-w-[240px] truncate">
                    {email.subject}
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-[200px] truncate">To: {email.recipient}</p>
                </td>
                <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{email.purpose}</td>
                <td className="py-3 px-4">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {email.tone}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      email.status === 'Sent'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {email.status === 'Sent' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {email.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {new Date(email.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  <button
                    onClick={() => setSelectedEmail(email)}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="View Email"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(email)}
                    className="rounded p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    title="Export PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteEmail(email.id)}
                    className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedEmail.subject}</h3>
                <p className="text-xs text-slate-500">
                  To: {selectedEmail.recipient} | Purpose: {selectedEmail.purpose}
                </p>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
              className="my-4 max-h-[360px] overflow-y-auto rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 dark:bg-slate-800/50 dark:text-slate-200"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(selectedEmail.content)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  onClick={() => handleDownloadPDF(selectedEmail)}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
                >
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
                <button
                  onClick={() => handleDownloadDOCX(selectedEmail)}
                  className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" /> DOCX
                </button>
              </div>

              {selectedEmail.status !== 'Sent' && (
                <button
                  onClick={() => {
                    onSendSmtp(selectedEmail.recipient, selectedEmail.subject, selectedEmail.content);
                    setSelectedEmail(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <Send className="h-3.5 w-3.5" /> Dispatch via SMTP
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
