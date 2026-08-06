export interface User {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  profile: string;
  role: 'Admin' | 'User';
  created_at: string;
}

export interface Email {
  id: number;
  user_id: number;
  subject: string;
  recipient: string;
  purpose: string;
  tone: string;
  content: string;
  status: 'Generated' | 'Draft' | 'Sent' | 'Scheduled';
  created_at: string;
  sent_at?: string;
  updated_at?: string;
}

export interface Draft {
  id: number;
  user_id: number;
  subject: string;
  content: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: number;
  title: string;
  category: string;
  subject: string;
  body: string;
  is_default?: boolean;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  created_at: string;
}

export interface GrammarSuggestion {
  type: 'Grammar' | 'Spam' | 'Clarity' | 'Tone';
  issue: string;
  recommendation: string;
}

export interface GrammarAnalysis {
  readabilityScore: number;
  spamScore: number;
  toneDetected: string;
  grammarIssuesCount: number;
  spamKeywords: string[];
  suggestions: GrammarSuggestion[];
  improvedContent: string;
}

export interface SmartReply {
  label: string;
  subject: string;
  body: string;
}

export interface SmartReplyData {
  summary: string;
  keyActionItems: string[];
  replies: SmartReply[];
}

export interface GeneratorFormState {
  purpose: string;
  recipientName: string;
  company: string;
  position: string;
  subject: string;
  keywords: string;
  tone: string;
  length: 'Short' | 'Medium' | 'Long';
  language: string;
  extraInstructions: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'generator'
  | 'subject-generator'
  | 'smart-reply'
  | 'templates'
  | 'history'
  | 'smtp-sender'
  | 'admin'
  | 'profile'
  | 'wamp-guide';
