import React, { useState } from 'react';
import { Send, CheckCircle2, Server, ShieldCheck, Mail, RefreshCw, FileText, Code, Eye } from 'lucide-react';

interface MailSenderViewProps {
  onSendSmtp: (recipient: string, subject: string, content: string) => void;
}

export const MailSenderView: React.FC<MailSenderViewProps> = ({ onSendSmtp }) => {
  const [recipient, setRecipient] = useState('hr@google.com');
  const [subject, setSubject] = useState('Application for Senior Developer Position');
  const [formatType, setFormatType] = useState<'plain' | 'html'>('plain');
  const [plainContent, setPlainContent] = useState(
    `Dear Hiring Manager,\n\nPlease find attached my application for the Senior Developer role.\n\nBest regards,\nNikita Chaudhari`
  );
  const [htmlContent, setHtmlContent] = useState(
    `<p>Dear Hiring Manager,</p>\n<p>Please find attached my application for the <strong>Senior Developer</strong> role.</p>\n<p>Best regards,<br><strong>Nikita Chaudhari</strong></p>`
  );
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] SMTP Server Connected: smtp.aiemail.net:587',
    '[SYSTEM] TLS Handshake Successful',
    '[READY] Mailer queue initialized',
  ]);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  const activeContent = formatType === 'plain' ? plainContent : htmlContent;

  const handleSend = async () => {
    setIsSending(true);
    setLogs((prev) => [...prev, `[SENDING] Dispatching (${formatType.toUpperCase()}) email to ${recipient}...`]);
    try {
      const formattedBody = formatType === 'plain' 
        ? plainContent.replace(/\n/g, '<br/>')
        : htmlContent;

      const res = await fetch('/api/email/send-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, subject, content: formattedBody }),
      });
      const data = await res.json();
      if (data.success) {
        setLogs((prev) => [
          ...prev,
          `[250 OK] Message accepted for delivery by host ${recipient}`,
          `[RECEIPT] ID: MSG-${Math.floor(Math.random() * 899999 + 100000)}`,
        ]);
        setLastReceipt(data.deliveryReceipt);
      }
    } catch (err) {
      setLogs((prev) => [...prev, `[ERROR] Failed to dispatch email.`]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">SMTP Email Dispatch Console</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Directly send emails via SMTP server protocol using Plain Text or HTML formatting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Form */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Recipient Email Address
            </label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Body Format & Content
              </label>

              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setFormatType('plain')}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-all ${
                    formatType === 'plain'
                      ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  <FileText className="h-3 w-3" />
                  <span>Plain Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormatType('html')}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold transition-all ${
                    formatType === 'html'
                      ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-indigo-300'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  <Code className="h-3 w-3" />
                  <span>HTML</span>
                </button>
              </div>
            </div>

            {formatType === 'plain' ? (
              <textarea
                rows={6}
                value={plainContent}
                onChange={(e) => setPlainContent(e.target.value)}
                placeholder="Write your email here in simple text..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 font-sans leading-relaxed"
              />
            ) : (
              <textarea
                rows={6}
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="<p>Write your HTML code here...</p>"
                className="w-full rounded-lg border border-slate-200 bg-slate-900 p-2 font-mono text-xs text-emerald-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-emerald-400 leading-relaxed"
              />
            )}

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {formatType === 'plain' ? 'Simple readable text (No tags required)' : 'Full HTML formatting supported'}
              </span>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                <Eye className="h-3 w-3" />
                <span>{showPreview ? 'Hide Preview' : 'Live Preview'}</span>
              </button>
            </div>

            {showPreview && (
              <div className="mt-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 p-3 text-xs dark:border-indigo-900/50 dark:bg-indigo-950/30">
                <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 mb-1">Email Rendering Preview:</p>
                <div
                  className="prose prose-xs max-w-none text-slate-800 dark:text-slate-200"
                  dangerouslySetInnerHTML={{
                    __html: formatType === 'plain' ? plainContent.replace(/\n/g, '<br/>') : htmlContent,
                  }}
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={isSending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{isSending ? 'Dispatching...' : 'Dispatch Email Now'}</span>
          </button>
        </div>

        {/* Server Log & Delivery Status */}
        <div className="space-y-4 md:col-span-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-400 shadow-sm">
            <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-200">
                <Server className="h-3.5 w-3.5 text-emerald-500" /> SMTP Server Console
              </span>
              <span className="text-[10px] text-emerald-500">CONNECTED: PORT 587</span>
            </div>

            <div className="h-48 overflow-y-auto space-y-1 text-[11px] leading-relaxed">
              {logs.map((log, i) => (
                <p key={i} className="text-slate-300">
                  {log}
                </p>
              ))}
            </div>
          </div>

          {lastReceipt && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/40">
              <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200 text-xs mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Delivery Receipt Confirmed</span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                <strong>Recipient:</strong> {lastReceipt.recipient}<br />
                <strong>Status:</strong> {lastReceipt.smtpStatus}<br />
                <strong>Timestamp:</strong> {new Date(lastReceipt.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

