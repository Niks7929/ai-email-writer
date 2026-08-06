import React, { useState } from 'react';
import { BookOpen, Copy, Check, Download, Database, Terminal, Server, Code, FileCode } from 'lucide-react';

export const WampSetupGuideModal: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyCode = (code: string, sectionKey: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlSchema = `-- ===================================================
-- AI EMAIL WRITER - MYSQL DATABASE SCHEMA (WAMP / phpMyAdmin)
-- Database Name: ai_email_writer
-- ===================================================

CREATE DATABASE IF NOT EXISTS \`ai_email_writer\`;
USE \`ai_email_writer\`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`fullname\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL UNIQUE,
  \`phone\` VARCHAR(20),
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('Admin', 'User') DEFAULT 'User',
  \`profile\` VARCHAR(255) DEFAULT 'default_avatar.png',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Emails Table
CREATE TABLE IF NOT EXISTS \`emails\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`subject\` VARCHAR(255) NOT NULL,
  \`recipient\` VARCHAR(255) NOT NULL,
  \`purpose\` VARCHAR(100) NOT NULL,
  \`tone\` VARCHAR(100) NOT NULL,
  \`content\` LONGTEXT NOT NULL,
  \`status\` VARCHAR(50) DEFAULT 'Draft',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Drafts Table
CREATE TABLE IF NOT EXISTS \`drafts\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`subject\` VARCHAR(255),
  \`content\` LONGTEXT,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Templates Table
CREATE TABLE IF NOT EXISTS \`templates\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`title\` VARCHAR(200) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`subject\` VARCHAR(255) NOT NULL,
  \`body\` LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Favorites Table
CREATE TABLE IF NOT EXISTS \`favorites\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`template_id\` INT NOT NULL,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`template_id\`) REFERENCES \`templates\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Activity Logs Table
CREATE TABLE IF NOT EXISTS \`activity_logs\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT NOT NULL,
  \`action\` VARCHAR(255) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Seed Admin & Initial User
INSERT INTO \`users\` (\`fullname\`, \`email\`, \`phone\`, \`password\`) VALUES 
('Nikita Chaudhari', 'nikitachaudhari7929@gmail.com', '+919876543210', '$2b$12$eImiTXuWVxfM37uY4JANjOL.88F9A4GfQ8iZ0I1dJ.vR/8Ie7c80S'),
('Alex Morgan', 'alex.morgan@company.com', '+1987654321', '$2b$12$eImiTXuWVxfM37uY4JANjOL.88F9A4GfQ8iZ0I1dJ.vR/8Ie7c80S');
`;

  const flaskConfigPy = `# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'ai_email_writer_super_secret_key_2026'
    
    # WAMP MySQL Database Connection Config
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = ''  # Default WAMP password is blank
    MYSQL_DB = 'ai_email_writer'
    MYSQL_CURSORCLASS = 'DictCursor'
    
    # AI API Keys
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
`;

  const flaskAppPy = `# app.py
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_mysqldb import MySQL
from config import Config
import google.generativeai as genai
import os

app = Flask(__name__)
app.config.from_object(Config)

mysql = MySQL(app)

# Configure Gemini AI
if app.config['GEMINI_API_KEY']:
    genai.configure(api_key=app.config['GEMINI_API_KEY'])

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/api/generate-email', methods=['POST'])
def generate_email():
    data = request.json
    purpose = data.get('purpose', 'General')
    recipient = data.get('recipientName', 'Team')
    company = data.get('company', '')
    keywords = data.get('keywords', '')
    tone = data.get('tone', 'Professional')
    
    prompt = f"Write a professional email for purpose: {purpose}, to recipient: {recipient} at company: {company}. Key skills: {keywords}. Tone: {tone}."
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        email_content = response.text
        
        # Save to WAMP MySQL Database
        cur = mysql.connection.cursor()
        cur.execute(
            "INSERT INTO emails (user_id, subject, recipient, purpose, tone, content, status) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (1, f"Email for {purpose}", recipient, purpose, tone, email_content, 'Generated')
        )
        mysql.connection.commit()
        cur.close()
        
        return jsonify({'success': True, 'content': email_content})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
`;

  const requirementsTxt = `Flask==3.0.3
flask-mysqldb==1.0.1
google-generativeai==0.8.3
python-dotenv==1.0.1
bcrypt==4.2.0
Flask-Login==0.6.3
requests==2.32.3
`;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-md">
            <BookOpen className="h-6 w-6 text-emerald-200" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Local WAMP & Python Setup Guide</h2>
            <p className="text-xs text-emerald-100">
              Complete instructions to export this application as a ZIP and run Python Flask + MySQL locally on WAMP Server.
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Exporting Project ZIP */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <Download className="h-4 w-4 text-emerald-600" /> Step 1: Export Project as a ZIP File
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Look at the top-right menu or left-hand panel in the editor.
        </p>
        <ol className="mt-2 list-decimal pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <li>Look at the top-right header menu or left-hand panel in <strong>Google AI Studio</strong>.</li>
          <li>Click on <strong>Settings / Export</strong>.</li>
          <li>Select <strong>Export to ZIP</strong> or <strong>Export to GitHub</strong>.</li>
          <li>Save the generated ZIP archive onto your computer and extract it!</li>
        </ol>
      </div>

      {/* Step 2: WAMP MySQL Database Setup */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-indigo-600" /> Step 2: WAMP Server MySQL Database Setup
          </h3>
          <button
            onClick={() => copyCode(sqlSchema, 'sql')}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {copiedSection === 'sql' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            <span>{copiedSection === 'sql' ? 'Copied SQL' : 'Copy SQL Script'}</span>
          </button>
        </div>

        <ol className="list-decimal pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1 mb-3">
          <li>Start <strong>WAMP Server</strong> on your Windows machine (the WAMP icon turns green).</li>
          <li>Open your browser and navigate to <code>http://localhost/phpmyadmin</code>.</li>
          <li>Click on <strong>SQL</strong> tab at the top.</li>
          <li>Paste the SQL script below and click <strong>Go</strong> to auto-create the database and tables!</li>
        </ol>

        <pre className="max-h-56 overflow-y-auto rounded-xl bg-slate-950 p-3.5 font-mono text-[11px] text-emerald-400">
          {sqlSchema}
        </pre>
      </div>

      {/* Step 3: Python Flask Code Snippets */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* config.py */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileCode className="h-4 w-4 text-amber-500" /> config.py
            </span>
            <button
              onClick={() => copyCode(flaskConfigPy, 'config')}
              className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {copiedSection === 'config' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <pre className="max-h-40 overflow-y-auto rounded-lg bg-slate-950 p-3 font-mono text-[10px] text-amber-300">
            {flaskConfigPy}
          </pre>
        </div>

        {/* requirements.txt */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-blue-500" /> requirements.txt
            </span>
            <button
              onClick={() => copyCode(requirementsTxt, 'req')}
              className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {copiedSection === 'req' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <pre className="max-h-40 overflow-y-auto rounded-lg bg-slate-950 p-3 font-mono text-[10px] text-blue-300">
            {requirementsTxt}
          </pre>
        </div>
      </div>
    </div>
  );
};
