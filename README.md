# 🏥 Healthcare Doctor–Patient Translation Web Application

A full-stack AI-powered web application that enables multilingual medical consultations between doctors and patients using real-time text and audio translation powered by **Google Gemini (Generative AI).**

---

## 🚀 Overview

This application acts as a real-time translation bridge in clinical settings.  
It allows doctors and patients speaking different languages to communicate seamlessly via:

- Text messages
- Audio messages
- AI-powered summarization
- Search across consultation history

The system integrates **Google Gemini 2.5 models** for translation, transcription, and structured medical summarization.

---

# ✅ Features Implemented

## 1️⃣ Real-Time Multilingual Text Translation (GenAI-Powered)

- AI-powered translation using **Gemini 2.5 Flash / Flash-Lite**
- Bidirectional Doctor ↔ Patient communication
- Displays:
  - Original message
  - Translated message
- Role-based message styling
- Supports clinically relevant languages such as:
  - Spanish
  - French
  - Arabic
  - Chinese
  - Portuguese
  - Hindi
- Translation prompts optimized for **medical accuracy**

---

## 2️⃣ Audio Recording → AI Transcription → Translation

- Browser-based recording using **MediaRecorder API**
- Audio upload via multipart/form-data
- Gemini multimodal processing:
  - Audio → Transcription
  - Transcription → Target language translation
- Displays:
  - Playable audio
  - Original transcript
  - Translated transcript
- Fully AI-driven transcription (no hardcoded logic)

---

## 3️⃣ Conversation Management

- Unique conversation session initialization
- Backend-managed conversation context
- Message logging with timestamps
- Stores:
  - Sender role
  - Original text
  - Translated text
  - Audio file reference
- Designed for session continuity

---

## 4️⃣ AI-Powered Medical Summary

- Generates structured consultation summaries using Gemini
- Extracts and organizes:
  - Symptoms
  - Diagnoses
  - Medications
  - Follow-up instructions
- Returns structured JSON output
- Helps clinicians quickly review key consultation data

---

## 5️⃣ Conversation Search

- Keyword-based search across conversation history
- Highlights matched text
- Scroll-to-result behavior
- Enables fast retrieval of clinical information

---

## 6️⃣ Robust UI & Error Handling

- Prevents message sending before conversation initialization
- Handles backend cold starts (Render free tier)
- Graceful handling of:
  - API failures
  - Quota errors
  - Translation unavailability
- Defensive programming to prevent runtime crashes

---

# 🧠 AI & LLM Integration

This project leverages:

### Google Gemini API (AI Studio Key)
- `gemini-2.5-flash`
- `gemini-2.5-flash-lite`

Used for:
- Text translation
- Multimodal audio transcription
- Clinical summarization

### Prompt Engineering
- Medical context-aware translation prompts
- Structured JSON-only summary prompts
- Controlled response formatting for reliability

---

# 🛠 Tech Stack

## Frontend
- React (Create React App)
- Material UI (MUI)
- Axios
- MediaRecorder API

## Backend
- Node.js
- Express.js
- RESTful API architecture
- Multer for audio file uploads
- In-memory conversation storage (for evaluation/demo)

## AI Integration
- Google Gemini Generative AI API
- Multimodal audio input handling
- Structured JSON output parsing

## Deployment
- Frontend: **Vercel**
- Backend: **Render**
- Monorepo structure with separate frontend and backend directories
- Environment-based configuration for API keys

---

# 🔄 Application Flow

1. User opens the chat interface.
2. A new conversation is initialized via backend API.
3. Doctor or Patient sends text or audio.
4. Backend:
   - Translates text using Gemini
   - OR transcribes + translates audio using Gemini
5. Messages are rendered with original + translated versions.
6. Summary can be generated at any stage.
7. Search can retrieve specific clinical information.

---

# ⚠ Known Limitations / Trade-Offs

- In-memory storage (no database persistence across server restarts)
- Free-tier AI rate limits may temporarily restrict usage
- Audio processing dependent on Gemini API quotas
- Designed for demonstration under time constraints

---

Frontend:  
https://health-translation-app.vercel.app

---

# 🎯 Project Intent

This project was built under a strict time constraint to demonstrate:

- Full-stack architecture design
- Generative AI integration
- Multimodal data handling
- Prompt engineering
- API architecture
- Deployment strategy
- Practical problem-solving under constraints
