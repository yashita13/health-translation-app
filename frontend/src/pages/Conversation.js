import { useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import {
    createConversation,
    sendMessage,
    generateSummary,
} from "../services/translationService";
import AudioRecorder from "../components/AudioRecorder";

const STORAGE_KEY = "active_conversation";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Conversation() {
    const [conversation, setConversation] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [summary, setSummary] = useState(null);
    const [role, setRole] = useState("doctor");
    const [targetLanguage, setTargetLanguage] = useState("es");

    const chatContainerRef = useRef(null);

    // ================= INIT =================
    useEffect(() => {
        async function init() {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (stored) {
                const parsed = JSON.parse(stored);
                setConversation(parsed);
                setMessages(parsed.messages || []);
                setSummary(parsed.summary || null);
            } else {
                const conv = await createConversation();
                setConversation(conv);
                setMessages(conv.messages || []);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(conv));
            }
        }
        init();
    }, []);

    // ================= AUTO SCROLL (CHAT ONLY) =================
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // ================= SEND MESSAGE =================
    const handleSend = async () => {
        if (!message.trim() || !conversation) return;

        try {
            const newMsg = await sendMessage(
                conversation.id,
                role === "doctor" ? "1" : "2",
                role,
                message,
                targetLanguage
            );

            const updatedMessages = [...messages, newMsg];
            const updatedConversation = {
                ...conversation,
                messages: updatedMessages,
            };

            setMessages(updatedMessages);
            setConversation(updatedConversation);
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(updatedConversation)
            );

            setMessage("");
        } catch (err) {
            alert("Message could not be sent");
            console.error(err);
        }
    };

    // ================= GENERATE SUMMARY =================
    const handleGenerateSummary = async () => {
        if (!conversation) return;

        const generated = await generateSummary(conversation.id);

        const updatedConversation = {
            ...conversation,
            summary: generated,
        };

        setSummary(generated);
        setConversation(updatedConversation);
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedConversation)
        );
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden", // 🔒 lock page scroll
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    background:
                        "linear-gradient(90deg, #1e3a8a, #2563eb)",
                    color: "white",
                    flexShrink: 0,
                }}
            >
                <Typography variant="h6">
                    Doctor–Patient Consultation
                </Typography>
            </Box>

            {/* Controls */}
            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    gap: 2,
                    flexShrink: 0,
                }}
            >
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                    <MenuItem value="doctor">Doctor</MenuItem>
                    <MenuItem value="patient">Patient</MenuItem>
                </Select>

                <Select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                >
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="hi">Hindi</MenuItem>
                </Select>
            </Box>

            {/* Main Layout */}
            <Box
                sx={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    overflow: "hidden", // 🔒 critical
                }}
            >
                {/* CHAT */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderRight: "1px solid #e5e7eb",
                        overflow: "hidden",
                    }}
                >
                    {/* Messages (ONLY SCROLLABLE AREA) */}
                    <Box
                        ref={chatContainerRef}
                        sx={{
                            flex: 1,
                            p: 2,
                            overflowY: "auto",
                            backgroundColor: "#f8fafc",
                        }}
                    >
                        {messages.map((msg) => (
                            <Box
                                key={msg.id}
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        msg.senderRole === "doctor"
                                            ? "flex-start"
                                            : "flex-end",
                                    mb: 2,
                                }}
                            >
                                <Card
                                    sx={{
                                        maxWidth: "75%",
                                        backgroundColor:
                                            msg.senderRole === "doctor"
                                                ? "#e0f2fe"
                                                : "#ecfdf5",
                                        borderRadius: 3,
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="caption"
                                            sx={{ fontWeight: 700 }}
                                        >
                                            {msg.senderRole}
                                        </Typography>

                                        <Typography sx={{ mt: 0.5 }}>
                                            {msg.originalText}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                color: "#2563eb",
                                                fontSize: 14,
                                            }}
                                        >
                                            {msg.translatedText}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            sx={{
                                                opacity: 0.6,
                                                display: "block",
                                                mt: 0.5,
                                            }}
                                        >
                                            {msg.timestamp
                                                ? new Date(
                                                    msg.timestamp
                                                ).toLocaleString()
                                                : new Date().toLocaleString()}
                                        </Typography>

                                        {msg.audioUrl && (
                                            <audio
                                                controls
                                                src={`${API_BASE_URL}${msg.audioUrl}`}
                                                style={{
                                                    marginTop: 8,
                                                    width: "100%",
                                                }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Box>

                    {/* Input */}
                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            gap: 1,
                            borderTop: "1px solid #e5e7eb",
                            backgroundColor: "white",
                            flexShrink: 0,
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Type message…"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSend}
                            sx={{ px: 4 }}
                        >
                            Send
                        </Button>
                    </Box>

                    {/* Audio + Summary Actions */}
                    <Box sx={{ p: 2, flexShrink: 0 }}>
                        <AudioRecorder
                            senderRole={role}
                            targetLanguage={targetLanguage}
                            onAudioSent={(data) => {
                                const updated = [
                                    ...messages,
                                    {
                                        id: Date.now(),
                                        senderRole: role,
                                        originalText: data.transcription,
                                        translatedText: data.translated,
                                        audioUrl: data.audioUrl,
                                        timestamp: new Date().toISOString(),
                                    },
                                ];

                                const updatedConversation = {
                                    ...conversation,
                                    messages: updated,
                                };

                                setMessages(updated);
                                setConversation(updatedConversation);
                                localStorage.setItem(
                                    STORAGE_KEY,
                                    JSON.stringify(updatedConversation)
                                );
                            }}
                        />

                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={handleGenerateSummary}
                        >
                            Generate Medical Summary
                        </Button>
                    </Box>
                </Box>

                {/* SUMMARY */}
                <Box
                    sx={{
                        p: 3,
                        overflowY: "auto", // summary scrolls independently
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Consultation Summary
                    </Typography>

                    {summary ? (
                        <Card>
                            <CardContent>
                                <Typography>
                                    <b>Symptoms:</b>{" "}
                                    {summary.symptoms.join(", ") || "None"}
                                </Typography>
                                <Typography>
                                    <b>Medications:</b>{" "}
                                    {summary.medications.join(", ") || "None"}
                                </Typography>
                                <Typography>
                                    <b>Follow-up:</b> {summary.followUp}
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <Typography sx={{ opacity: 0.6 }}>
                            Generate summary to view details
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
