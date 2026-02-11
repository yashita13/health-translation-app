const express = require("express");
const http = require("http");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const geminiService = require("./services/geminiService");

const app = express();
const server = http.createServer(app);

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


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
    try {
        const { text, targetLanguage } = req.body;

        const translated = await geminiService.translateText(
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
    } catch (error) {
        console.error("Translation failed:", error);
        res.status(500).json({ success: false, message: "Translation failed" });
    }
});


// ==================== AUDIO ====================

app.post("/api/translate/audio", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false });
        }

        const { senderRole, targetLanguage, conversationId } = req.body;

        const conversation = conversations.find(
            (c) => c.id === conversationId
        );

        if (!conversation) {
            return res
                .status(404)
                .json({ success: false, message: "Conversation not found" });
        }

        // 🔥 REAL GEMINI TRANSCRIPTION
        const transcription = await geminiService.transcribeAudio(
            req.file.path
        );

        const translatedText = await geminiService.translateText(
            transcription,
            targetLanguage
        );

        const message = {
            id: "msg-" + Date.now(),
            senderRole,
            originalText: transcription,
            translatedText,
            audioUrl: `/uploads/audio/${req.file.filename}`,
            timestamp: new Date().toISOString(),
        };

        conversation.messages.push(message);

        res.status(201).json(message);

    } catch (error) {
        console.error("Audio processing failed:", error);
        res.status(500).json({ success: false, message: "Audio failed" });
    }
});



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

    res.status(201).json(conversation);
});

app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
        const conversation = conversations.find(
            (c) => c.id === req.params.id
        );

        if (!conversation) {
            return res
                .status(404)
                .json({ success: false, message: "Conversation not found" });
        }

        const { senderId, senderRole, originalText, targetLanguage } = req.body;

        const translatedText = await geminiService.translateText(
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

        res.status(201).json(message);
    }
    catch (error) {
        console.error("Message failed:", error);
        res.status(500).json({ success: false, message: "Message failed" });
    }
});

app.get("/api/models", async (req, res) => {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
});



// ==================== SUMMARY ====================

app.post("/api/summarize", async (req, res) => {
    const { conversationId } = req.body;

    const conversation = conversations.find(
        (c) => c.id === conversationId
    );

    if (!conversation) {
        return res
            .status(404)
            .json({ success: false, message: "Conversation not found" });
    }

    const summary = await geminiService.generateMedicalSummary(
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
    console.log(`Server running on port ${PORT}`);
});
