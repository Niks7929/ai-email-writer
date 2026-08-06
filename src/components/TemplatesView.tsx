import React, { useState } from 'react';
import {
  FileText,
  Search,
  Bookmark,
  Plus,
  ArrowRight,
  Check,
  Star,
  Tag,
} from 'lucide-react';
import { EmailTemplate, ActiveTab } from '../types';

interface TemplatesViewProps {
  templates: EmailTemplate[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onAddTemplate: (title: string, category: string, subject: string, body: string) => void;
  onUseTemplate: (template: EmailTemplate) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  templates,
  favorites,
  onToggleFavorite,
  onAddTemplate,
  onUseTemplate,
  setActiveTab,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Template Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Business');
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');

  const categories = [
    'All',
    'Job Application',
    'Leave Request',
    'Follow-up',
    'Customer Support',
    'Business',
    'Sales & Marketing',
    'HR & Onboarding',
    'Academic & College',
    'Networking',
    'Project Update',
    'Invoicing & Payments',
  ];

  const filtered = templates.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSubject || !newBody) return;
    onAddTemplate(newTitle, newCategory, newSubject, newBody);
    setNewTitle('');
    setNewSubject('');
    setNewBody('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Email Templates Library</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select pre-written professional templates or save custom blueprints.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Create Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tmpl) => {
          const isFav = favorites.includes(tmpl.id);
          return (
            <div
              key={tmpl.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    <Tag className="h-3 w-3" /> {tmpl.category}
                  </span>
                  <button
                    onClick={() => onToggleFavorite(tmpl.id)}
                    className={`rounded-lg p-1.5 transition-colors ${
                      isFav ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${isFav ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tmpl.title}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                  Subject: {tmpl.subject}
                </p>

                <div
                  dangerouslySetInnerHTML={{ __html: tmpl.body }}
                  className="mt-3 text-[11px] leading-relaxed text-slate-500 line-clamp-3 dark:text-slate-400 border-t border-slate-100 pt-2 dark:border-slate-800"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    onUseTemplate(tmpl);
                    setActiveTab('generator');
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                  <span>Use Template</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for adding template */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create New Template</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Template Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Leave Application - Medical"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="Job Application">Job Application</option>
                    <option value="Leave Request">Leave Request</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Business">Business</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="HR & Onboarding">HR & Onboarding</option>
                    <option value="Academic & College">Academic & College</option>
                    <option value="Networking">Networking</option>
                    <option value="Project Update">Project Update</option>
                    <option value="Invoicing & Payments">Invoicing & Payments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Pattern
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Leave Request: {Name}"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Template Body (HTML or Plain Text)
                </label>
                <textarea
                  rows={5}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="<p>Dear {Manager},</p>..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
