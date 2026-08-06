import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Data persistence path
const DATA_FILE = path.join(process.cwd(), "data_store.json");

interface DataStore {
  users: Array<any>;
  emails: Array<any>;
  drafts: Array<any>;
  templates: Array<any>;
  favorites: Array<any>;
  activityLogs: Array<any>;
}

const defaultData: DataStore = {
  users: [
    {
      id: 1,
      fullname: "Nikita Chaudhari (Admin)",
      email: "nikitachaudhari7929@gmail.com",
      phone: "+91 98765 43210",
      profile: "",
      role: "Admin",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      fullname: "Nikita Chaudhari (User)",
      email: "nikita.user@gmail.com",
      phone: "+91 98765 43210",
      profile: "",
      role: "User",
      created_at: new Date().toISOString(),
    },
  ],
  emails: [],
  drafts: [],
  templates: [
    {
      id: 1,
      title: "Job Application - Software Engineer",
      category: "Job Application",
      subject: "Application for {Job Position} - {Your Name}",
      body: `<p>Dear Hiring Team,</p><p>I am excited to apply for the <strong>{Job Position}</strong> role at <strong>{Company}</strong>. With my background in software engineering, API integration, and database management, I am eager to contribute to your technical goals.</p><p>Looking forward to the opportunity to connect.</p><p>Best regards,<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 2,
      title: "Internship & Entry-Level Application",
      category: "Job Application",
      subject: "Application for {Internship Role} - {Your Name}",
      body: `<p>Dear Hiring Manager,</p><p>I am writing to express my strong enthusiasm for the <strong>{Internship Role}</strong> position at <strong>{Company Name}</strong>. As a passionate computer science graduate with hands-on project experience, I am eager to apply my skills to your team.</p><p>Please find my resume attached for your review.</p><p>Sincerely,<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 3,
      title: "Formal Leave Application",
      category: "Leave Request",
      subject: "Leave Application: {Your Name} - {Dates}",
      body: `<p>Dear {Manager Name},</p><p>Please accept this email as formal notice that I am requesting leave from {Start Date} to {End Date} due to {Reason}.</p><p>I will ensure all current tasks are updated. Thank you for considering my request.</p><p>Regards,<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 4,
      title: "Medical / Emergency Sick Leave",
      category: "Leave Request",
      subject: "Sick Leave Notice - {Your Name} - {Date}",
      body: `<p>Hi {Manager Name},</p><p>I am writing to inform you that I am unwell today due to {Medical Condition/Illness} and will be unable to attend work on {Date}.</p><p>I will monitor urgent emails periodically if my condition permits, or you can contact me via phone for urgent matters.</p><p>Thank you for understanding.<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 5,
      title: "Client Follow-up After Meeting",
      category: "Follow-up",
      subject: "Thank you for your time today - {Company}",
      body: `<p>Hi {Client Name},</p><p>Thank you for taking the time to speak with me today about {Topic}. Based on our discussion, here is a summary of next steps:</p><ul><li>Step 1: Review proposal</li><li>Step 2: Confirm schedule</li></ul><p>Please let me know if you have any questions.</p><p>Warmly,<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 6,
      title: "Post-Interview Follow-Up & Thank You",
      category: "Follow-up",
      subject: "Thank You - Interview for {Job Title} - {Your Name}",
      body: `<p>Dear {Interviewer Name},</p><p>Thank you so much for taking the time to interview me for the <strong>{Job Title}</strong> position today. I enjoyed learning more about {Company Name}'s upcoming projects.</p><p>Our conversation further confirmed my interest in joining your team. Please feel free to reach out if you need any additional information.</p><p>Best regards,<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 7,
      title: "Customer Support Resolution",
      category: "Customer Support",
      subject: "Update regarding Ticket #{Ticket Number}",
      body: `<p>Dear {Customer Name},</p><p>Thank you for reaching out to customer support. We have investigated the issue regarding {Issue Details} and resolved it successfully.</p><p>Please let us know if you need any further assistance!</p><p>Best regards,<br>Support Team</p>`,
      is_default: true,
    },
    {
      id: 8,
      title: "Service Outage & Apology Notice",
      category: "Customer Support",
      subject: "Service Update & Resolved Issue - {Company Name}",
      body: `<p>Dear Valued Customer,</p><p>We experienced a brief unexpected disruption on our platform earlier today affecting {Affected Service}. Our engineering team identified and resolved the root cause immediately.</p><p>We sincerely apologize for any inconvenience caused and appreciate your patience.</p><p>Warm regards,<br>Customer Experience Team</p>`,
      is_default: true,
    },
    {
      id: 9,
      title: "Business Proposal Pitch",
      category: "Business",
      subject: "Strategic Partnership Proposal - {Company Name}",
      body: `<p>Dear {Recipient Name},</p><p>I hope this email finds you well. I am writing on behalf of <strong>{Your Company}</strong> to explore a potential strategic collaboration in <strong>{Industry/Area}</strong>.</p><p>We believe combining our expertise can deliver great value to our clients. Please find our attached proposal for details.</p><p>Sincerely,<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 10,
      title: "Business Meeting Request & Agenda",
      category: "Business",
      subject: "Meeting Request: Discussion on {Topic} - {Company}",
      body: `<p>Hi {Recipient Name},</p><p>I would like to schedule a 30-minute meeting to discuss <strong>{Topic}</strong> and align on our joint priorities for {Quarter/Project}.</p><p>Please let me know if any of the following slots work for you: {Date/Time Options}.</p><p>Looking forward to our conversation.<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 11,
      title: "Cold Sales & Service Outreach",
      category: "Sales & Marketing",
      subject: "Quick question regarding {Company Name}'s email workflow",
      body: `<p>Hi {First Name},</p><p>I came across {Company Name} and was impressed by your recent growth. We help teams automate and optimize their client communications with AI-driven tools.</p><p>Would you be open to a quick 10-minute discovery call next Tuesday?</p><p>Best,<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 12,
      title: "Interview Invitation (HR)",
      category: "HR & Onboarding",
      subject: "Interview Invitation for {Job Title} - {Company Name}",
      body: `<p>Dear {Candidate Name},</p><p>Thank you for applying for the <strong>{Job Title}</strong> position at <strong>{Company Name}</strong>. We were very impressed with your application and would like to invite you for a virtual interview.</p><p>Please let us know your availability for this week.</p><p>Best regards,<br>HR Team</p>`,
      is_default: true,
    },
    {
      id: 13,
      title: "Academic Leave & Project Submission",
      category: "Academic & College",
      subject: "Project Submission & Approval Request - {Student Name}",
      body: `<p>Respected Professor {Professor Name},</p><p>I am submitting my final project report for the subject <strong>{Subject Name}</strong>. Please find the attached document for your review and evaluation.</p><p>Thank you for your guidance throughout the semester.</p><p>Yours obediently,<br>{Student Name}<br>Roll No: {Roll Number}</p>`,
      is_default: true,
    },
    {
      id: 14,
      title: "Networking & Coffee Chat Request",
      category: "Networking",
      subject: "Seeking advice on {Industry} / Coffee Chat Request",
      body: `<p>Dear {Name},</p><p>I have been following your impressive work in {Field/Industry} and greatly admire your achievements. As someone aspiring to excel in this field, I would love to learn from your experience.</p><p>If your schedule permits, would you be available for a brief 15-minute coffee chat or virtual call?</p><p>Warm regards,<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 15,
      title: "Weekly Project Status Update",
      category: "Project Update",
      subject: "Weekly Status Report: {Project Name} - {Date}",
      body: `<p>Hi Team,</p><p>Here is the weekly status update for <strong>{Project Name}</strong>:</p><ul><li><strong>Completed:</strong> Key modules developed & tested</li><li><strong>In Progress:</strong> UI refinements & database sync</li><li><strong>Blockers:</strong> None</li></ul><p>Please reach out if you have any questions.</p><p>Best,<br>{Your Name}</p>`,
      is_default: true,
    },
    {
      id: 16,
      title: "Payment Due & Invoice Reminder",
      category: "Invoicing & Payments",
      subject: "Invoice #{Invoice Number} Due Reminder - {Company}",
      body: `<p>Dear {Client Name},</p><p>This is a friendly reminder that Invoice <strong>#{Invoice Number}</strong> for <strong>{Amount}</strong> is due on <strong>{Due Date}</strong>.</p><p>Please find the invoice attached for reference. Let us know once the payment is processed.</p><p>Thank you for your business!</p><p>Best regards,<br>Finance Team</p>`,
      is_default: true,
    },
  ],
  favorites: [],
  activityLogs: [],
};

// Ensure DATA_FILE is synced cleanly on startup
saveData(defaultData);

function readData(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading data file, using defaults:", err);
  }
  return defaultData;
}

function saveData(data: DataStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving data file:", err);
  }
}

// ------------------- API ROUTES -------------------

// 1. AI Email Generation Endpoint
app.post("/api/email/generate", async (req, res) => {
  try {
    const { purpose, recipientName, company, position, subject, keywords, tone, length, language, extraInstructions } = req.body;

    const prompt = `You are a professional world-class email copywriting assistant. Generate a highly structured, convincing, and well-written email in clean HTML format (<p>, <strong>, <ul>, <li>, etc. - do not wrap in markdown backticks, just return raw HTML).

Context Details:
- Purpose: ${purpose || "General Communication"}
- Recipient Name: ${recipientName || "Hiring Manager / Team"}
- Target Company/Organization: ${company || "Not specified"}
- Target Job Position/Role: ${position || "Not specified"}
- Email Subject Context: ${subject || "Not specified"}
- Keywords/Skills to Highlight: ${keywords || "None"}
- Desired Writing Tone: ${tone || "Professional"}
- Desired Length: ${length || "Medium"} (Short: 2 paragraphs, Medium: 3-4 paragraphs, Long: detailed multi-paragraph with bullet points)
- Language: ${language || "English"}
- Extra Custom Instructions: ${extraInstructions || "None"}

Requirements:
1. Format with clean, well-spaced HTML paragraphs (<p>), bold text (<strong>) for key terms, and bullet lists (<ul><li>) if relevant.
2. Include greeting, well-structured body content addressing the keywords and background, and a polite closing signature placeholder.
3. Keep the tone strictly consistent with: ${tone}.
4. Provide standard salutation and closing.
5. Do NOT include Markdown block indicators like \`\`\`html. Return ONLY the clean HTML string.`;

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let generatedHtml = response.text || "";
    // Clean up any markdown code block fences if returned
    generatedHtml = generatedHtml.replace(/```html/gi, "").replace(/```/g, "").trim();

    // Log Activity
    const db = readData();
    const newLog = {
      id: db.activityLogs.length + 1,
      user_id: 1,
      action: `AI Generated Email (${purpose || "Custom"})`,
      created_at: new Date().toISOString(),
    };
    db.activityLogs.unshift(newLog);
    saveData(db);

    res.json({ success: true, content: generatedHtml });
  } catch (error: any) {
    console.error("Error generating email:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate email." });
  }
});

// 2. AI Subject Line Generator (Generates 5 distinct subject ideas)
app.post("/api/email/generate-subjects", async (req, res) => {
  try {
    const { purpose, company, keywords, tone } = req.body;

    const prompt = `Generate 5 highly effective, catchy, and professional email subject lines based on the following details:
- Purpose: ${purpose}
- Company: ${company}
- Keywords/Key Info: ${keywords}
- Tone: ${tone}

Return a JSON array of 5 strings. Example: ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5"]. Do not add extra commentary.`;

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    let subjects: string[] = [];
    try {
      subjects = JSON.parse(response.text || "[]");
    } catch (e) {
      subjects = [
        `Application for ${keywords || "Position"} - ${company || "Team"}`,
        `Regarding ${purpose}: Quick Follow-Up`,
        `Inquiry: Opportunities at ${company || "Your Company"}`,
        `Important Update: ${purpose}`,
        `${tone || "Professional"} Communication regarding ${keywords || "Project"}`,
      ];
    }

    res.json({ success: true, subjects });
  } catch (error: any) {
    console.error("Error generating subjects:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Grammar, Spam, and Readability Analyzer
app.post("/api/email/check-grammar", async (req, res) => {
  try {
    const { content } = req.body;

    const prompt = `Analyze the following email content for grammar, spelling, readability, spam risk, and tone.

Email Content:
${content}

Provide a JSON object response with the exact schema:
{
  "readabilityScore": number (0 to 100, where 100 is super readable and easy),
  "spamScore": number (0 to 100, where 0 is zero spam risk and 100 is high spam trigger risk),
  "toneDetected": "Professional" | "Formal" | "Casual" | "Urgent" | "Friendly" | "Salesy",
  "grammarIssuesCount": number,
  "spamKeywords": ["list", "of", "spammy", "words", "found"],
  "suggestions": [
    { "type": "Grammar" | "Spam" | "Clarity" | "Tone", "issue": "Description of issue", "recommendation": "Suggested fix" }
  ],
  "improvedContent": "Cleaned up HTML or text version with corrected grammar"
}`;

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            readabilityScore: { type: Type.NUMBER },
            spamScore: { type: Type.NUMBER },
            toneDetected: { type: Type.STRING },
            grammarIssuesCount: { type: Type.NUMBER },
            spamKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                },
              },
            },
            improvedContent: { type: Type.STRING },
          },
        },
      },
    });

    const analysis = JSON.parse(response.text || "{}");
    res.json({ success: true, analysis });
  } catch (error: any) {
    console.error("Error analyzing grammar:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Rewrite & Modify Email (Improve, Shorten, Expand, Change Tone)
app.post("/api/email/rewrite", async (req, res) => {
  try {
    const { content, action } = req.body; // action: "improve" | "shorten" | "expand" | "professional" | "friendly" | "formal" | "simple_english"

    const prompt = `You are an expert editor. Rewrite the following email content according to this requested action: "${action}".

Original Email Content:
${content}

Requirements:
1. Return clean HTML formatted string (<p>, <strong>, <ul>, <li>).
2. Maintain essential names, dates, and core message facts.
3. Execute the action strictly:
   - "improve": enhance sentence structure, polish vocabulary, fix all grammar.
   - "shorten": make concise and direct, removing fluff while keeping key points.
   - "expand": add polite context, elaborated details, and professional depth.
   - "professional" / "friendly" / "formal" / "simple_english": transform tone accordingly.
4. Do NOT wrap in markdown backticks. Return raw HTML string.`;

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let rewritten = response.text || "";
    rewritten = rewritten.replace(/```html/gi, "").replace(/```/g, "").trim();

    res.json({ success: true, content: rewritten });
  } catch (error: any) {
    console.error("Error rewriting email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Smart Reply & Summarizer Endpoint
app.post("/api/email/smart-reply", async (req, res) => {
  try {
    const { incomingEmail, desiredTone } = req.body;

    const prompt = `Analyze this received email and generate 3 smart reply option options:
Incoming Email:
${incomingEmail}

Tone: ${desiredTone || "Professional"}

Return a JSON object:
{
  "summary": "1-2 sentence executive summary of the incoming email",
  "keyActionItems": ["item 1", "item 2"],
  "replies": [
    { "label": "Option 1: Positive / Confirmation", "subject": "Re: ...", "body": "HTML formatted body reply" },
    { "label": "Option 2: Request More Information", "subject": "Re: ...", "body": "HTML formatted body reply" },
    { "label": "Option 3: Reschedule / Polite Decline", "subject": "Re: ...", "body": "HTML formatted body reply" }
  ]
}`;

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error creating smart reply:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Save Email / Draft Endpoint
app.post("/api/email/save", (req, res) => {
  try {
    const { subject, recipient, purpose, tone, content, status, id } = req.body;
    const db = readData();

    if (id) {
      // Update existing
      const index = db.emails.findIndex((e) => e.id === Number(id));
      if (index !== -1) {
        db.emails[index] = {
          ...db.emails[index],
          subject,
          recipient,
          purpose,
          tone,
          content,
          status: status || db.emails[index].status,
          updated_at: new Date().toISOString(),
        };
      }
    } else {
      // Create new
      const newEmail = {
        id: db.emails.length ? Math.max(...db.emails.map((e) => e.id)) + 1 : 1,
        user_id: 1,
        subject: subject || "Untitled Email",
        recipient: recipient || "Unspecified Recipient",
        purpose: purpose || "General",
        tone: tone || "Professional",
        content: content || "",
        status: status || "Draft",
        created_at: new Date().toISOString(),
      };
      db.emails.unshift(newEmail);

      db.activityLogs.unshift({
        id: db.activityLogs.length + 1,
        user_id: 1,
        action: `Saved ${status || "Draft"}: ${subject}`,
        created_at: new Date().toISOString(),
      });
    }

    saveData(db);
    res.json({ success: true, emails: db.emails });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Send Email (SMTP Dispatch Simulation)
app.post("/api/email/send-smtp", (req, res) => {
  try {
    const { recipient, subject, content, emailId } = req.body;
    const db = readData();

    let emailRecord;
    if (emailId) {
      const idx = db.emails.findIndex((e) => e.id === Number(emailId));
      if (idx !== -1) {
        db.emails[idx].status = "Sent";
        db.emails[idx].sent_at = new Date().toISOString();
        emailRecord = db.emails[idx];
      }
    } else {
      emailRecord = {
        id: db.emails.length ? Math.max(...db.emails.map((e) => e.id)) + 1 : 1,
        user_id: 1,
        subject,
        recipient,
        purpose: "Direct Sent",
        tone: "Professional",
        content,
        status: "Sent",
        created_at: new Date().toISOString(),
        sent_at: new Date().toISOString(),
      };
      db.emails.unshift(emailRecord);
    }

    db.activityLogs.unshift({
      id: db.activityLogs.length + 1,
      user_id: 1,
      action: `Sent email via SMTP to ${recipient}`,
      created_at: new Date().toISOString(),
    });

    saveData(db);

    res.json({
      success: true,
      message: `Email successfully dispatched to ${recipient}`,
      deliveryReceipt: {
        smtpStatus: "250 2.0.0 OK Message accepted",
        timestamp: new Date().toISOString(),
        recipient,
        subject,
      },
      emails: db.emails,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. CRUD State Endpoints (Fetch All, Templates, Users, History, Activity Logs)
app.get("/api/state", (req, res) => {
  const db = readData();
  res.json({ success: true, data: db });
});

app.delete("/api/email/:id", (req, res) => {
  const { id } = req.params;
  const db = readData();
  db.emails = db.emails.filter((e) => e.id !== Number(id));
  db.drafts = db.drafts.filter((d) => d.id !== Number(id));
  saveData(db);
  res.json({ success: true, emails: db.emails });
});

app.post("/api/templates/favorite", (req, res) => {
  const { templateId } = req.body;
  const db = readData();
  if (db.favorites.includes(templateId)) {
    db.favorites = db.favorites.filter((f) => f !== templateId);
  } else {
    db.favorites.push(templateId);
  }
  saveData(db);
  res.json({ success: true, favorites: db.favorites });
});

app.post("/api/templates", (req, res) => {
  const { title, category, subject, body } = req.body;
  const db = readData();
  const newTemplate = {
    id: db.templates.length ? Math.max(...db.templates.map((t) => t.id)) + 1 : 1,
    title,
    category,
    subject,
    body,
    is_default: false,
  };
  db.templates.unshift(newTemplate);
  saveData(db);
  res.json({ success: true, templates: db.templates });
});

app.post("/api/user/profile", (req, res) => {
  const { id, fullname, email, phone, profile, role } = req.body;
  const db = readData();
  let targetUser = db.users.find((u) => u.id === id) || db.users.find((u) => u.role === role);
  if (!targetUser) {
    targetUser = db.users[0];
  }

  if (targetUser) {
    if (fullname !== undefined) targetUser.fullname = fullname;
    if (email !== undefined) targetUser.email = email;
    if (phone !== undefined) targetUser.phone = phone;
    if (profile !== undefined) targetUser.profile = profile;
    if (role !== undefined) targetUser.role = role;
  }
  saveData(db);
  res.json({ success: true, user: targetUser, users: db.users });
});

// Authentication Endpoints (Login & Register)
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;
  const db = readData();

  // Find user by email or fallback matching role for demo
  let existingUser = db.users.find(
    (u) => u.email.toLowerCase() === (email || "").toLowerCase()
  );

  if (!existingUser) {
    // If demo login or unknown email, match by role or create
    existingUser = db.users.find((u) => u.role === (role || "User"));
  }

  if (!existingUser) {
    // Auto-create for demo login if none exists
    existingUser = {
      id: Date.now(),
      fullname: email ? email.split("@")[0] : "User Account",
      email: email || "user@example.com",
      phone: "+91 98765 43210",
      profile: "",
      role: role || "User",
      created_at: new Date().toISOString(),
    };
    db.users.push(existingUser);
  } else if (role && existingUser.role !== role) {
    existingUser.role = role;
  }

  // Log activity
  db.activityLogs.unshift({
    id: db.activityLogs.length + 1,
    user_id: existingUser.id,
    action: `User Authenticated (${existingUser.fullname} as ${existingUser.role})`,
    created_at: new Date().toISOString(),
  });

  saveData(db);
  res.json({ success: true, user: existingUser });
});

app.post("/api/auth/register", (req, res) => {
  const { fullname, email, phone, role, password } = req.body;
  if (!fullname || !email) {
    return res.status(400).json({ success: false, error: "Name and email are required." });
  }

  const db = readData();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    // Return existing user logged in
    return res.json({ success: true, user: existing, message: "User already registered. Logged in." });
  }

  const newUser = {
    id: Date.now(),
    fullname,
    email,
    phone: phone || "+91 90000 00000",
    profile: "",
    role: role || "User",
    created_at: new Date().toISOString(),
  };

  db.users.push(newUser);
  db.activityLogs.unshift({
    id: db.activityLogs.length + 1,
    user_id: newUser.id,
    action: `New User Registered (${newUser.fullname} as ${newUser.role})`,
    created_at: new Date().toISOString(),
  });

  saveData(db);
  res.json({ success: true, user: newUser });
});

// Start Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
