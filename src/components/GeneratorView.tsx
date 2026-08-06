import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Send,
  Save,
  Download,
  Copy,
  Check,
  RotateCcw,
  Heading,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Sliders,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  Type,
  FileSpreadsheet,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { GeneratorFormState, Email, GrammarAnalysis } from '../types';

interface GeneratorViewProps {
  onSaveEmail: (emailData: Partial<Email>) => void;
  onSendSmtp: (recipient: string, subject: string, content: string) => void;
  initialEmail?: Email | null;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  onSaveEmail,
  onSendSmtp,
  initialEmail,
}) => {
  const [form, setForm] = useState<GeneratorFormState>({
    purpose: initialEmail?.purpose || 'Job Application',
    recipientName: initialEmail?.recipient || 'Hiring Manager',
    company: 'Google',
    position: 'Python & Web Developer',
    subject: initialEmail?.subject || 'Application for Senior Python Developer Role',
    keywords: 'Python 3.13, Flask, SQL, Machine Learning, Fast API, Cloud Deployment',
    tone: initialEmail?.tone || 'Professional',
    length: 'Medium',
    language: 'English',
    extraInstructions: 'Highlight recent full-stack accomplishments and strong problem-solving skills.',
  });

  const [generatedHtml, setGeneratedHtml] = useState<string>(
    initialEmail?.content ||
      `<p>Dear Hiring Manager,</p><p>I am writing to express my strong interest in the <strong>Python & Web Developer</strong> position at <strong>Google</strong>. With a robust background in building enterprise web applications, REST APIs, and database-driven tools, I am eager to contribute to your engineering goals.</p><p>My key expertise includes:</p><ul><li><strong>Backend Development:</strong> Python, Flask, Express.js, RESTful Architecture</li><li><strong>Database & Storage:</strong> MySQL, PostgreSQL, Query Optimization</li><li><strong>AI & Automation:</strong> Gemini API Integration, Machine Learning Workflows</li></ul><p>I welcome the opportunity to discuss how my skill set aligns with Google's technical vision. Thank you for your time and consideration.</p><p>Best regards,<br><strong>John Doe</strong></p>`
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingSubjects, setIsGeneratingSubjects] = useState(false);
  const [subjectSuggestions, setSubjectSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [grammarAnalysis, setGrammarAnalysis] = useState<GrammarAnalysis | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Generate Email Call
  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusMessage('Generating professional email with Gemini AI...');
    try {
      const res = await fetch('/api/email/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedHtml(data.content);
        setStatusMessage('Email successfully generated!');
        setGrammarAnalysis(null);
      } else {
        setStatusMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMessage('Failed to connect to AI server.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate 5 Subject Lines
  const handleGenerateSubjects = async () => {
    setIsGeneratingSubjects(true);
    try {
      const res = await fetch('/api/email/generate-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: form.purpose,
          company: form.company,
          keywords: form.keywords,
          tone: form.tone,
        }),
      });
      const data = await res.json();
      if (data.success && data.subjects) {
        setSubjectSuggestions(data.subjects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSubjects(false);
    }
  };

  // Run Grammar & Spam Check
  const handleCheckGrammar = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/email/check-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: generatedHtml }),
      });
      const data = await res.json();
      if (data.success) {
        setGrammarAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Rewrite / Modify Email
  const handleRewrite = async (action: string) => {
    setIsRewriting(true);
    setStatusMessage(`Rewriting email (${action})...`);
    try {
      const res = await fetch('/api/email/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: generatedHtml, action }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedHtml(data.content);
        setStatusMessage(`Email successfully updated: ${action}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewriting(false);
    }
  };

  // Copy to Clipboard
  const handleCopy = () => {
    // Convert HTML to plain text for copy
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generatedHtml;
    const textContent = tempDiv.innerText || tempDiv.textContent || '';
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save Draft
  const handleSaveDraft = () => {
    onSaveEmail({
      subject: form.subject,
      recipient: form.recipientName,
      purpose: form.purpose,
      tone: form.tone,
      content: generatedHtml,
      status: 'Draft',
    });
    setStatusMessage('Draft saved successfully!');
  };

  // Send Email via SMTP
  const handleSendEmail = () => {
    onSendSmtp(form.recipientName, form.subject, generatedHtml);
    setStatusMessage('Email sent via SMTP!');
  };

  // Export PDF using jsPDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text(form.subject || 'Generated Email', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`To: ${form.recipientName} (${form.company})`, 14, 28);
    doc.text(`Purpose: ${form.purpose} | Tone: ${form.tone}`, 14, 34);
    doc.line(14, 38, 196, 38);

    doc.setFontSize(11);
    doc.setTextColor(0);

    // Strip HTML for simple PDF render
    const temp = document.createElement('div');
    temp.innerHTML = generatedHtml;
    const textLines = doc.splitTextToSize(temp.innerText || temp.textContent || '', 180);
    doc.text(textLines, 14, 46);

    doc.save(`${(form.subject || 'Email').replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  // Export Word DOCX format
  const handleExportDOCX = () => {
    const temp = document.createElement('div');
    temp.innerHTML = generatedHtml;
    const plainText = temp.innerText || temp.textContent || '';

    const blob = new Blob([plainText], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(form.subject || 'Email').replace(/[^a-z0-9]/gi, '_')}.doc`;
    a.click();
  };

  // Format Helper for Editor
  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Email Writer & Editor</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure parameters, generate email body, optimize tone, and export or send.
          </p>
        </div>
        {statusMessage && (
          <div className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            {statusMessage}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form Panel: Parameters */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-slate-900 dark:border-slate-800 dark:text-white text-sm">
            <Sliders className="h-4 w-4 text-indigo-600" />
            <span>Generation Parameters</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Purpose
              </label>
              <select
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Job Application">Job Application</option>
                <option value="Leave Request">Leave Request</option>
                <option value="Resignation">Resignation</option>
                <option value="Business Proposal">Business Proposal</option>
                <option value="Marketing Campaign">Marketing Campaign</option>
                <option value="Follow-up Email">Follow-up Email</option>
                <option value="Cold Outreach">Cold Outreach</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Complaint / Feedback">Complaint / Feedback</option>
                <option value="Thank You">Thank You</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Writing Tone
              </label>
              <select
                name="tone"
                value={form.tone}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Professional">Professional</option>
                <option value="Formal">Formal</option>
                <option value="Friendly">Friendly</option>
                <option value="Persuasive">Persuasive</option>
                <option value="Casual">Casual</option>
                <option value="Apology">Apology</option>
                <option value="Sales">Sales</option>
                <option value="HR / Internal">HR / Internal</option>
                <option value="Technical">Technical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Recipient Name / Title
              </label>
              <input
                type="text"
                name="recipientName"
                value={form.recipientName}
                onChange={handleChange}
                placeholder="e.g. Hiring Manager"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Company / Organization
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject Line
              </label>
              <button
                type="button"
                onClick={handleGenerateSubjects}
                disabled={isGeneratingSubjects}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <Heading className="h-3 w-3" />
                {isGeneratingSubjects ? 'Suggesting...' : 'AI Subject Ideas'}
              </button>
            </div>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Application for Software Role"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />

            {/* Subject Suggestions Popup list */}
            {subjectSuggestions.length > 0 && (
              <div className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50/70 p-2.5 dark:border-indigo-900/50 dark:bg-indigo-950/40">
                <p className="mb-1.5 text-[11px] font-bold text-indigo-900 dark:text-indigo-200">
                  Select an AI Subject Line:
                </p>
                <div className="space-y-1">
                  {subjectSuggestions.map((subj, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setForm({ ...form, subject: subj })}
                      className="block w-full rounded bg-white px-2 py-1 text-left text-xs font-medium text-slate-800 shadow-2xs hover:bg-indigo-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Keywords & Key Details to Include
            </label>
            <input
              type="text"
              name="keywords"
              value={form.keywords}
              onChange={handleChange}
              placeholder="e.g. Python 3.13, Flask, SQL, Machine Learning"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Length
              </label>
              <select
                name="length"
                value={form.length}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Short">Short (1-2 paragraphs)</option>
                <option value="Medium">Medium (3 paragraphs)</option>
                <option value="Long">Long (Detailed + bullets)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Language
              </label>
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Extra Instructions
            </label>
            <textarea
              name="extraInstructions"
              rows={2}
              value={form.extraInstructions}
              onChange={handleChange}
              placeholder="e.g. Mention 2 years internship experience and call to action"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50 text-xs"
          >
            <Wand2 className="h-4 w-4" />
            <span>{isGenerating ? 'Generating Email...' : 'Generate AI Email'}</span>
          </button>
        </div>

        {/* Right Editor & Tools Panel */}
        <div className="space-y-4 lg:col-span-7">
          {/* Editor Container */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Toolbar */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => applyFormat('bold')}
                  className="rounded p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('italic')}
                  className="rounded p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('underline')}
                  className="rounded p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Underline"
                >
                  <Underline className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('insertUnorderedList')}
                  className="rounded p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('justifyLeft')}
                  className="rounded p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('justifyCenter')}
                  className="rounded p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  title="Align Center"
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
              </div>

              {/* Grammar & Analyze Trigger */}
              <button
                type="button"
                onClick={handleCheckGrammar}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                <FileCheck className="h-3.5 w-3.5" />
                <span>{isAnalyzing ? 'Checking...' : 'Check Grammar & Spam'}</span>
              </button>
            </div>

            {/* Editable Content Window */}
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setGeneratedHtml(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: generatedHtml }}
              className="min-h-[260px] rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 dark:focus:bg-slate-900"
            />

            {/* Quick Rewriter Action Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400">AI Quick Rewrite:</span>
              <button
                type="button"
                onClick={() => handleRewrite('improve')}
                disabled={isRewriting}
                className="rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
              >
                ✨ Polish Grammar
              </button>
              <button
                type="button"
                onClick={() => handleRewrite('shorten')}
                disabled={isRewriting}
                className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                ✂️ Shorten
              </button>
              <button
                type="button"
                onClick={() => handleRewrite('expand')}
                disabled={isRewriting}
                className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                📝 Expand
              </button>
              <button
                type="button"
                onClick={() => handleRewrite('professional')}
                disabled={isRewriting}
                className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                💼 Professional
              </button>
              <button
                type="button"
                onClick={() => handleRewrite('friendly')}
                disabled={isRewriting}
                className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                😊 Friendly
              </button>
            </div>

            {/* Export & Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Save className="h-3.5 w-3.5" /> Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                >
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </button>
                <button
                  type="button"
                  onClick={handleExportDOCX}
                  className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" /> Export DOCX
                </button>
              </div>

              <button
                type="button"
                onClick={handleSendEmail}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95"
              >
                <Send className="h-3.5 w-3.5" /> Send via SMTP
              </button>
            </div>
          </div>

          {/* Grammar & Spam Analysis Results Card */}
          {grammarAnalysis && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  AI Quality & Spam Risk Assessment
                </h3>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Tone Detected: {grammarAnalysis.toneDetected}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  <span className="text-[11px] font-medium text-slate-500">Readability Score</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-emerald-600">
                      {grammarAnalysis.readabilityScore}/100
                    </span>
                    <span className="text-[10px] text-slate-400">High Clarity</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  <span className="text-[11px] font-medium text-slate-500">Spam Trigger Risk</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span
                      className={`text-xl font-extrabold ${
                        grammarAnalysis.spamScore > 40 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {grammarAnalysis.spamScore}/100
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {grammarAnalysis.spamScore > 40 ? 'Review Keywords' : 'Safe for Inbox'}
                    </span>
                  </div>
                </div>
              </div>

              {grammarAnalysis.suggestions && grammarAnalysis.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Recommendations ({grammarAnalysis.suggestions.length}):
                  </p>
                  {grammarAnalysis.suggestions.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-amber-100 bg-amber-50/60 p-2.5 text-xs dark:border-amber-900/40 dark:bg-amber-950/30"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        <span>[{s.type}] {s.issue}</span>
                      </div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        👉 <strong>Fix:</strong> {s.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
