import React, { useState } from 'react';
import { MessageSquareReply, Sparkles, Copy, Check, FileText, Send } from 'lucide-react';
import { SmartReplyData } from '../types';

export const SmartReplyView: React.FC = () => {
  const [incomingEmail, setIncomingEmail] = useState(
    `Hi Team,\n\nI reviewed the proposal for the Q3 AI Email Writer integration project. We are impressed with the features and performance metrics.\n\nCould you please confirm if your system supports multi-language translation, custom SMTP server configuration, and DOCX exports?\n\nAlso, let us know if you are available for a technical demo meeting this Thursday at 2:00 PM EST.\n\nBest regards,\nSarah Jenkins\nHead of Engineering, TechCorp`
  );
  const [desiredTone, setDesiredTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [replyData, setReplyData] = useState<SmartReplyData | null>({
    summary:
      'Sarah Jenkins from TechCorp reviewed the Q3 AI Email Writer proposal, asked about multi-language, custom SMTP, and DOCX export features, and requested a tech demo call on Thursday at 2:00 PM EST.',
    keyActionItems: [
      'Confirm feature support: Multi-language, Custom SMTP, DOCX Export',
      'Confirm availability for Thursday 2:00 PM EST demo call',
    ],
    replies: [
      {
        label: 'Option 1: Positive / Confirm Demo Call',
        subject: 'Re: Q3 AI Email Writer Proposal & Demo Confirmation',
        body: `<p>Hi Sarah,</p><p>Thank you for your email and positive feedback on our Q3 AI Email Writer proposal!</p><p>To answer your questions: <strong>Yes</strong>, our system natively supports multi-language translation, custom SMTP server configuration, and instant PDF/DOCX exports.</p><p>I am happy to confirm our availability for the technical demo meeting this <strong>Thursday at 2:00 PM EST</strong>. Please feel free to send over the calendar invite.</p><p>Looking forward to speaking with you!</p><p>Best regards,<br>Nikita Chaudhari</p>`,
      },
      {
        label: 'Option 2: Request Reschedule / Alternative Time',
        subject: 'Re: Q3 AI Email Writer Proposal - Meeting Schedule',
        body: `<p>Hi Sarah,</p><p>Thanks for getting in touch! We are glad to hear TechCorp is excited about our proposal.</p><p>Yes, multi-language translation, custom SMTP, and DOCX exports are all fully supported features in our application.</p><p>Regarding Thursday at 2:00 PM EST, we have a minor conflict at that exact hour. Would <strong>Friday at 11:00 AM EST</strong> or <strong>Thursday at 4:00 PM EST</strong> work for your team?</p><p>Best regards,<br>Nikita Chaudhari</p>`,
      },
    ],
  });

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerateReplies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/email/smart-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incomingEmail, desiredTone }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReplyData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (html: string, idx: number) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    navigator.clipboard.writeText(temp.innerText || temp.textContent || '');
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Smart Reply & Summarizer</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Paste any received email to automatically summarize key points and generate 3 tailored response drafts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Input Panel */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Paste Incoming Email Content
            </label>
            <textarea
              rows={10}
              value={incomingEmail}
              onChange={(e) => setIncomingEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Reply Tone
            </label>
            <select
              value={desiredTone}
              onChange={(e) => setDesiredTone(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="Professional">Professional</option>
              <option value="Friendly">Friendly</option>
              <option value="Formal">Formal</option>
              <option value="Direct / Concise">Direct / Concise</option>
            </select>
          </div>

          <button
            onClick={handleGenerateReplies}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{loading ? 'Analyzing & Generating...' : 'Summarize & Generate Smart Replies'}</span>
          </button>
        </div>

        {/* Results Panel */}
        <div className="space-y-4 lg:col-span-7">
          {replyData && (
            <>
              {/* Executive Summary Card */}
              <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-blue-50/70 p-4 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-slate-900">
                <div className="mb-1.5 flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200 text-xs">
                  <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Executive AI Summary</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed dark:text-slate-300">
                  {replyData.summary}
                </p>

                {replyData.keyActionItems && (
                  <div className="mt-3 pt-2 border-t border-indigo-100/80 dark:border-indigo-900/40">
                    <p className="text-[11px] font-bold text-indigo-950 dark:text-indigo-200 mb-1">
                      Key Action Items:
                    </p>
                    <ul className="list-disc pl-4 text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                      {replyData.keyActionItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Reply Options */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Smart Reply Options
                </h3>
                {replyData.replies?.map((reply, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {reply.label}
                      </span>
                      <button
                        onClick={() => handleCopy(reply.body, idx)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        {copiedIdx === idx ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedIdx === idx ? 'Copied' : 'Copy Draft'}</span>
                      </button>
                    </div>

                    <p className="mb-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      Subject: {reply.subject}
                    </p>

                    <div
                      dangerouslySetInnerHTML={{ __html: reply.body }}
                      className="rounded-xl bg-slate-50/70 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
