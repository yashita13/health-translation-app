# Healthcare Doctor-Patient Translation Web Application

A real-time translation platform facilitating medical consultations between doctors and patients speaking different languages.

## Features Implemented

✅ **Real-time Translation**
- Doctor ↔ Patient bidirectional translation
- Support for multiple languages (Spanish, French, Chinese, Arabic)
- Real-time WebSocket communication

✅ **Dual Interface Chat**
- Clean, intuitive chat UI with role-based theming
- Visual distinction between Doctor/Patient messages
- Message timestamps and status indicators

✅ **Audio Recording & Playback**
- Browser-based audio recording with visual feedback
- Audio messages displayed in conversation thread
- Playback controls for recorded messages

✅ **Conversation Logging**
- Persistent conversation storage in MongoDB
- Timestamps for all interactions
- User authentication and session management

✅ **AI-Powered Summarization**
- GPT-4 powered medical summary generation
- Extracts symptoms, diagnoses, medications, follow-ups
- Structured medical documentation

✅ **Search Functionality**
- Keyword search across conversation history
- Semantic search using embeddings
- Highlight matched content with context

## Tech Stack

**Frontend:**
- React 18 with Material-UI
- Socket.IO client for real-time communication
- Web Audio API for recording
- Axios for API calls

**Backend:**
- Node.js with Express
- Socket.IO for WebSockets
- MongoDB with Mongoose ODM
- OpenAI API (GPT-4, Whisper)

**AI/ML:**
- GPT-4 for translation and summarization
- Whisper for speech-to-text
- Embeddings for semantic search

**DevOps:**
- Docker containerization
- Environment-based configuration
- CORS-enabled API

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Docker (optional)
- OpenAI API key

### Local Development

1. **Clone repository:**
```bash
git clone <repository-url>
cd healthcare-translation-app