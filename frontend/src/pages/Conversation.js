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

export default function Conversation() {
    const [conversation, setConversation] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [summary, setSummary] = useState(null);
    const [role, setRole] = useState("doctor");
    const [targetLanguage, setTargetLanguage] = useState("es");

    const chatEndRef = useRef(null);

    useEffect(() => {
        async function init() {
            const conv = await createConversation();
            setConversation(conv);
            setMessages(conv.messages || []);
        }
        init();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const newMsg = await sendMessage(
            conversation.id,
            role === "doctor" ? "1" : "2",
            role,
            message,
            targetLanguage
        );

        setMessages((prev) => [...prev, newMsg]);
        setMessage("");
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    background:
                        "linear-gradient(90deg, #1e3a8a, #2563eb)",
                    color: "white",
                }}
            >
                <Typography variant="h6">
                    Doctor–Patient Consultation
                </Typography>
            </Box>

            {/* Role & Language */}
            <Box sx={{ p: 2, display: "flex", gap: 2 }}>
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
            <Box sx={{ flex: 1, display: "grid", gridTemplateColumns: "2fr 1fr" }}>
                {/* CHAT COLUMN */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderRight: "1px solid #e5e7eb",
                    }}
                >
                    {/* Messages */}
                    <Box
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
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                        <div ref={chatEndRef} />
                    </Box>

                    {/* Input + Send */}
                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            gap: 1,
                            borderTop: "1px solid #e5e7eb",
                            backgroundColor: "white",
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

                    {/* Audio + Summary Button */}
                    <Box sx={{ p: 2 }}>
                        <AudioRecorder
                            senderRole={role}
                            targetLanguage={targetLanguage}
                            onAudioSent={(data) =>
                                setMessages((prev) => [
                                    ...prev,
                                    {
                                        id: Date.now(),
                                        senderRole: role,
                                        originalText: data.transcription,
                                        translatedText: data.translated,
                                    },
                                ])
                            }
                        />

                        <Button
                            variant="outlined"
                            sx={{ mt: 2 }}
                            onClick={async () =>
                                setSummary(await generateSummary(conversation.id))
                            }
                        >
                            Generate Medical Summary
                        </Button>
                    </Box>
                </Box>

                {/* SUMMARY COLUMN */}
                <Box sx={{ p: 3, backgroundColor: "#ffffff" }}>
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
