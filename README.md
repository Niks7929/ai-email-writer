# AI Email Writer

## Overview

AI Email Writer is an AI-powered web application that helps users create professional, personalized, and well-structured emails within seconds using the Google Gemini AI API. The application allows users to generate emails in multiple tones, save drafts, manage templates, and organize email history through a modern and responsive interface.

---

## Features

- 🤖 AI-powered email generation using Google Gemini AI
- ✍️ Multiple writing tones (Professional, Formal, Friendly, Persuasive, Apologetic, Urgent, Sales, Networking)
- 👤 User authentication and role-based access (Admin & User)
- 📄 Save and manage email drafts
- 📁 Create and manage reusable email templates
- 📊 Email history and activity tracking
- 🌙 Dark and Light mode support
- 📱 Fully responsive user interface

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

### Backend
- Node.js
- Express.js
- Google Gemini AI API

### Database / Storage
- JSON Data Store

---

## Installation

### Clone the repository

```bash
git clone https://github.com/Niks7929/ai-email-writer.git
cd ai-email-writer
```

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file and add your Gemini API key.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### Run the application

```bash
npm run dev
```

---

## Project Structure

```
ai-email-writer/
├── src/
├── components/
├── pages/
├── services/
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

---

## Future Enhancements

- Email scheduling
- Attachment support
- Export emails as PDF
- Rich text editor
- Multi-language email generation
- Email sentiment analysis

---

## Author

**Nikita Chaudhari**

GitHub: https://github.com/Niks7929

---

## License

This project is developed for educational and portfolio purposes.
