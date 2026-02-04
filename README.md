# Healthcare Doctor–Patient Translation Web Application

A full-stack web application designed to facilitate multilingual medical consultations between doctors and patients using real-time text and audio translation.

---

## Features Implemented

### 1. Multilingual Text Translation
- Real-time text translation between doctor and patient
- Displays both original and translated messages
- Supports multiple target languages (Spanish, French, Hindi)
- Role-based message rendering for Doctor and Patient

### 2. Audio Recording, Transcription & Translation
- Browser-based audio recording using MediaRecorder API
- Uploads recorded audio to backend for processing
- Automatically transcribes audio and translates the transcription
- Displays playable audio messages within the chat thread

### 3. Conversation Management
- Each consultation initializes a unique conversation session
- All text and audio messages are stored within the conversation context
- Conversation state is persisted on the frontend for session continuity

### 4. AI-Powered Medical Summary
- Generates a concise medical summary at any point during the conversation
- Highlights medically important information such as:
  - Symptoms
  - Medications
  - Follow-up actions
- Helps clinicians quickly review key consultation details

### 5. Conversation Search
- Keyword-based search across the conversation history
- Highlights matching text within messages
- Automatically scrolls to the first matched result

### 6. Robust UI & Error Handling
- Graceful handling of backend cold starts on free hosting tiers
- Prevents user actions until the conversation is fully initialized
- Clear UI feedback for loading and disabled states
- Defensive checks to avoid runtime errors

---

## Tech Stack

### Frontend
- React (Create React App)
- Material UI (MUI) for layout and components
- Axios for REST API communication
- MediaRecorder API for audio recording

### Backend
- Node.js
- Express.js
- REST-based API architecture
- In-memory conversation storage (for demo and evaluation purposes)

### Deployment
- Frontend deployed on **Vercel**
- Backend deployed on **Render**
- Monorepo structure with separate frontend and backend directories
- Environment-based configuration for API URLs

---

## Application Flow

1. User opens the chat interface.
2. A new conversation is initialized via the backend API.
3. Doctor or patient sends text or audio messages.
4. Messages are translated and displayed in real time.
5. Audio messages are transcribed, translated, and playable.
6. A medical summary can be generated at any stage.
7. Users can search across the conversation history.

---

## Notes

- The application focuses on functional completeness rather than full production persistence.
- In-memory storage is used to simplify setup and evaluation.
- The project was built under time constraints to demonstrate problem-solving, architecture decisions, and effective use of available tools.

---

## Live Demo Link
https://health-translation-app.vercel.app  
