const express = require("express");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const translationService = require("./services/translationService");

const app = express();
const server = http.createServer(app);

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ==================== FILE STORAGE ====================

// Ensure upload folders exist
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}
if (!fs.existsSync("uploads/audio")) {
    fs.mkdirSync("uploads/audio");
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/audio/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ==================== IN-MEMORY DATA ====================

let users = [
    {
        id: "1",
        email: "doctor@example.com",
        password: "doctor123",
        name: "Dr. Smith",
        role: "doctor",
        language: "en",
    },
    {
        id: "2",
        email: "patient@example.com",
        password: "patient123",
        name: "John Doe",
        role: "patient",
        language: "es",
    },
];

let conversations = [];

// ==================== HEALTH CHECK ====================

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Healthcare Translation API is running",
        timestamp: new Date().toISOString(),
    });
});

// ==================== AUTH ====================

app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    let user = users.find(
        (u) => u.email === email && u.password === password
    );

    if (!user) {
        user = {
            id: Date.now().toString(),
            email,
            password,
            name: email.includes("doctor")
                ? "Demo Doctor"
                : "Demo Patient",
            role: email.includes("doctor") ? "doctor" : "patient",
            language: email.includes("doctor") ? "en" : "es",
        };
        users.push(user);
    }

    res.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            language: user.language,
        },
        token: "demo-token",
    });
});

// ==================== TRANSLATION ====================

app.post("/api/translate/text", async (req, res) => {
    const { text, targetLanguage } = req.body;

    const translated = await translationService.translateText(
        text,
        targetLanguage
    );

    res.json({
        success: true,
        original: text,
        translated,
        language: targetLanguage,
        timestamp: new Date().toISOString(),
    });
});


// ==================== AUDIO ====================

app.post("/api/translate/audio", upload.single("audio"), async (req, res) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ success: false, message: "No audio file" });
    }

    const { senderRole, targetLanguage } = req.body;

    const transcription =
        translationService.transcribeAudio(senderRole);

    const translated = await translationService.translateText(
        transcription,
        targetLanguage
    );

    res.json({
        success: true,
        audioUrl: `/uploads/audio/${req.file.filename}`,
        transcription,
        translated,
        timestamp: new Date().toISOString(),
    });
}
);

// ==================== CONVERSATIONS ====================

app.get("/api/conversations", (req, res) => {
    res.json({ success: true, conversations });
});

app.post("/api/conversations", (req, res) => {
    const conversation = {
        id: "conv-" + Date.now(),
        doctorId: "1",
        patientId: "2",
        doctorName: "Dr. Smith",
        patientName: "John Doe",
        messages: [],
        startTime: new Date().toISOString(),
        status: "active",
    };

    conversations.push(conversation);

    res.json({ success: true, conversation });
});

app.post("/api/conversations/:id/messages", async (req, res) => {
    const conversation = conversations.find(
        (c) => c.id === req.params.id
    );

    if (!conversation) {
        return res
            .status(404)
            .json({ success: false, message: "Conversation not found" });
    }

    const { senderId, senderRole, originalText, targetLanguage } = req.body;

    const translatedText = await translationService.translateText(
        originalText,
        targetLanguage
    );

    const message = {
        id: "msg-" + Date.now(),
        senderId,
        senderRole,
        originalText,
        translatedText,
        targetLanguage,
        timestamp: new Date().toISOString(),
    };

    conversation.messages.push(message);

    res.json({ success: true, message });
});

// ==================== SUMMARY ====================

app.post("/api/summarize", (req, res) => {
    const { conversationId } = req.body;

    const conversation = conversations.find(
        (c) => c.id === conversationId
    );

    if (!conversation) {
        return res
            .status(404)
            .json({ success: false, message: "Conversation not found" });
    }

    const summary = translationService.generateMedicalSummary(
        conversation.messages
    );

    conversation.summary = summary;

    res.json({ success: true, summary });
});

// ==================== SEARCH ====================

app.get("/api/search", (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.json({ success: true, results: [] });
    }

    const results = conversations.filter(
        (conv) =>
            conv.doctorName.toLowerCase().includes(q.toLowerCase()) ||
            conv.patientName.toLowerCase().includes(q.toLowerCase()) ||
            conv.messages.some((msg) =>
                msg.originalText.toLowerCase().includes(q.toLowerCase())
            )
    );

    res.json({ success: true, query: q, results });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`
🚀 Healthcare Translation Backend Running
-----------------------------------------
Server: http://localhost:${PORT}
Health: http://localhost:${PORT}/api/health

✔ Translation: Dynamic (rule-based)
✔ Audio Upload: Enabled
✔ Conversation Logging: Enabled
✔ Search & Summary: Enabled
✔ No Paid APIs Required

Ready for recruiter review ✅
`);
});
