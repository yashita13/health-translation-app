import { useEffect, useState } from "react";
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

    useEffect(() => {
        async function init() {
            const conv = await createConversation();
            setConversation(conv);
            setMessages(conv.messages || []);
        }
        init();
    }, []);

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
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f5f7fb",
            }}
        >
            <Box
                sx={{
                    p: 2,
                    backgroundColor: "#1e88e5",
                    color: "white",
                }}
            >
                <Typography variant="h6">
                    Doctor–Patient Translation
                </Typography>
            </Box>

            <Box sx={{ p: 2, display: "flex", gap: 2 }}>
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                    <MenuItem value="doctor">Doctor</MenuItem>
                    <MenuItem value="patient">Patient</MenuItem>
                </Select>

                <Select
                    value={targetLanguage}
                    onChange={(e) =>
                        setTargetLanguage(e.target.value)
                    }
                >
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="hi">Hindi</MenuItem>
                </Select>
            </Box>

            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    px: 2,
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
                            mb: 1,
                        }}
                    >
                        <Card
                            sx={{
                                maxWidth: "70%",
                                backgroundColor:
                                    msg.senderRole === "doctor"
                                        ? "#e3f2fd"
                                        : "#c8e6c9",
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="caption"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {msg.senderRole}
                                </Typography>
                                <Typography>{msg.originalText}</Typography>
                                <Typography
                                    sx={{ color: "green", mt: 0.5 }}
                                >
                                    {msg.translatedText}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>

            <Box
                sx={{
                    p: 2,
                    display: "flex",
                    gap: 1,
                    borderTop: "1px solid #ddd",
                    backgroundColor: "white",
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Type message…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button variant="contained" onClick={handleSend}>
                    Send
                </Button>
            </Box>

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
            </Box>

            <Box sx={{ p: 2 }}>
                <Button
                    variant="outlined"
                    onClick={async () =>
                        setSummary(
                            await generateSummary(conversation.id)
                        )
                    }
                >
                    Generate Medical Summary
                </Button>

                {summary && (
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <Typography variant="h6">
                                Consultation Summary
                            </Typography>
                            <Typography>
                                Symptoms:{" "}
                                {summary.symptoms.join(", ") || "None"}
                            </Typography>
                            <Typography>
                                Medications:{" "}
                                {summary.medications.join(", ") ||
                                    "None"}
                            </Typography>
                            <Typography>
                                Follow-up: {summary.followUp}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Box>
    );
}
