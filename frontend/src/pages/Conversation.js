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
    const [searchQuery, setSearchQuery] = useState("");

    const chatContainerRef = useRef(null);
    const matchRefs = useRef([]);

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

    useEffect(() => {
        console.log("Conversation object:", conversation);
        console.log("conversation.id:", conversation?.id);
        console.log("conversation._id:", conversation?._id);
    }, [conversation]);


    // ================= AUTO SCROLL (CHAT ONLY) =================
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // ================= SCROLL TO FIRST SEARCH MATCH =================
    useEffect(() => {
        if (searchQuery && matchRefs.current[0]) {
            matchRefs.current[0].scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [searchQuery]);

    // ================= HIGHLIGHT HELPER =================
    const highlightText = (text = "", query) => {
        if (!text || !query) return text || "";

        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${escapedQuery})`, "gi");

        return text.split(regex).map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <mark
                    key={i}
                    style={{
                        backgroundColor: "#fde68a",
                        padding: "0 2px",
                    }}
                >
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };


    // ================= SEND MESSAGE =================
    const handleSend = async () => {
        if (!conversation?.id) {
            alert("Conversation not ready yet");
            return;
        }

        if (!message.trim() || !conversation) return;

        try {
            const newMsg = await sendMessage(
                conversation.id,
                role === "doctor" ? "1" : "2",
                role,
                message,
                targetLanguage
            );

            if (!newMsg) return;

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
            const backendMsg = err?.response?.data?.message;

            console.error("Send message failed:", err);

            // 🔥 IMPORTANT: handle backend memory reset
            if (backendMsg === "Conversation not found") {
                alert("Conversation expired. Creating a new one…");

                try {
                    const newConv = await createConversation();
                    setConversation(newConv);
                    setMessages([]);
                    localStorage.setItem(
                        STORAGE_KEY,
                        JSON.stringify(newConv)
                    );
                } catch (e) {
                    alert("Failed to recreate conversation");
                }
                return;
            }

            alert("Message could not be sent");
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

    matchRefs.current = [];

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
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
            <Box sx={{ p: 2, display: "flex", gap: 2, flexShrink: 0 }}>
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

                {/* 🔍 SEARCH */}
                <TextField
                    fullWidth
                    placeholder="Search conversation…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>

            {/* Main Layout */}
            <Box
                sx={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    overflow: "hidden",
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
                    {/* Messages */}
                    <Box
                        ref={chatContainerRef}
                        sx={{
                            flex: 1,
                            px: 3,
                            py: 2,
                            overflowY: "auto",
                            backgroundColor: "#f8fafc",
                        }}
                    >
                        {messages
                            .filter(Boolean)
                            .map((msg, idx) => {
                                const originalText = msg?.originalText || "";
                                const translatedText = msg?.translatedText || "";

                                const isMatch =
                                    searchQuery &&
                                    (
                                        originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        translatedText.toLowerCase().includes(searchQuery.toLowerCase())
                                    );

                                return (
                                    <Box
                                        key={msg.id}
                                        ref={(el) =>
                                            isMatch &&
                                            matchRefs.current.push(el)
                                        }
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
                                                width: "fit-content",
                                                maxWidth: "70%",
                                                minWidth: msg.audioUrl ? 260 : "auto",
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
                                                    {highlightText(
                                                        msg.originalText,
                                                        searchQuery
                                                    )}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        mt: 0.5,
                                                        color: "#2563eb",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    {highlightText(
                                                        msg.translatedText,
                                                        searchQuery
                                                    )}
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
                                );
                            })}
                    </Box>

                    {/* Input */}
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
                        <Button variant="contained" onClick={handleSend}>
                            Send
                        </Button>
                    </Box>

                    {/* Audio + Summary */}
                    <Box sx={{ p: 2 }}>
                        {conversation && (
                            <AudioRecorder
                                senderRole={role}
                                targetLanguage={targetLanguage}
                                conversationId={conversation.id}
                                onAudioSent={(message) => {
                                    if (!message) return;

                                    setMessages((prev) => [...prev, message]);

                                    const updatedConversation = {
                                        ...conversation,
                                        messages: [...conversation.messages, message],
                                    };

                                    setConversation(updatedConversation);
                                    localStorage.setItem(
                                        STORAGE_KEY,
                                        JSON.stringify(updatedConversation)
                                    );
                                }}
                            />
                        )}



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
                <Box sx={{ p: 3, overflowY: "auto" }}>
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
