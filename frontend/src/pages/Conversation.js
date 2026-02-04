import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Paper,
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
    LinearProgress,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Conversation = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            senderId: '1',
            senderRole: 'doctor',
            originalText: 'Hello, how are you feeling today?',
            translatedText: 'Hola, ¿cómo te sientes hoy?',
            timestamp: new Date(Date.now() - 300000),
            language: 'es'
        },
        {
            id: 2,
            senderId: '2',
            senderRole: 'patient',
            originalText: 'I have a headache and fever',
            translatedText: 'Tengo dolor de cabeza y fiebre',
            timestamp: new Date(Date.now() - 240000),
            language: 'en'
        }
    ]);

    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [targetLanguage, setTargetLanguage] = useState('es');
    const [summary, setSummary] = useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [user, setUser] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !user) return;

        const newMessage = {
            id: Date.now(),
            senderId: user.id,
            senderRole: user.role,
            originalText: inputText,
            translatedText: `[${targetLanguage.toUpperCase()}] ${inputText}`,
            timestamp: new Date(),
            language: user.role === 'doctor' ? 'en' : targetLanguage
        };

        setMessages([...messages, newMessage]);
        setInputText('');
    };

    const toggleRecording = () => {
        if (isRecording) {
            // Stop recording
            setIsRecording(false);
            // Simulate audio message
            const audioMessage = {
                id: Date.now(),
                senderId: user.id,
                senderRole: user.role,
                originalText: '[Audio recording]',
                translatedText: `[${targetLanguage.toUpperCase()}] Audio message recorded`,
                timestamp: new Date(),
                language: user.role === 'doctor' ? 'en' : targetLanguage,
                isAudio: true
            };
            setMessages([...messages, audioMessage]);
        } else {
            // Start recording
            setIsRecording(true);
        }
    };

    const generateSummary = () => {
        setIsGeneratingSummary(true);
        // Simulate AI summary generation
        setTimeout(() => {
            setSummary(`Medical Summary:
      - Patient reported: headache and fever
      - Duration: 2 days
      - Severity: Moderate
      - Recommendations: Rest, hydration, follow-up in 48 hours
      - Prescription: Paracetamol 500mg as needed`);
            setIsGeneratingSummary(false);
        }, 1500);
    };

    const handleBack = () => {
        window.location.href = '/dashboard';
    };

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ mb: 2 }}
            >
                Back to Dashboard
            </Button>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6">
                                    {user.role === 'doctor' ? 'Patient Consultation' : 'Doctor Consultation'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Real-time translation active
                                </Typography>
                            </Box>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Translate to</InputLabel>
                                <Select
                                    value={targetLanguage}
                                    label="Translate to"
                                    onChange={(e) => setTargetLanguage(e.target.value)}
                                >
                                    <MenuItem value="es">Spanish</MenuItem>
                                    <MenuItem value="fr">French</MenuItem>
                                    <MenuItem value="zh">Chinese</MenuItem>
                                    <MenuItem value="ar">Arabic</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Messages Area */}
                        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50' }}>
                            {messages.map((msg) => (
                                <Box
                                    key={msg.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: msg.senderId === user.id ? 'flex-end' : 'flex-start',
                                        mb: 2
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            p: 2,
                                            maxWidth: '70%',
                                            bgcolor: msg.senderId === user.id ? 'primary.light' : 'white',
                                            color: msg.senderId === user.id ? 'white' : 'text.primary'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Chip
                                                label={msg.senderRole}
                                                size="small"
                                                sx={{
                                                    mr: 1,
                                                    bgcolor: msg.senderRole === 'doctor' ? 'primary.main' : 'secondary.main',
                                                    color: 'white'
                                                }}
                                            />
                                            <Typography variant="caption">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>

                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                            {msg.senderId === user.id ? msg.originalText : msg.translatedText}
                                        </Typography>

                                        {msg.senderId !== user.id && (
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'grey.600' }}>
                                                Original: {msg.originalText}
                                            </Typography>
                                        )}

                                        {msg.isAudio && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <IconButton size="small" color="inherit">
                                                    <MicIcon />
                                                </IconButton>
                                                <Typography variant="caption">Audio message</Typography>
                                            </Box>
                                        )}
                                    </Paper>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Input Area */}
                        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item>
                                    <IconButton
                                        color={isRecording ? "error" : "primary"}
                                        onClick={toggleRecording}
                                    >
                                        {isRecording ? <StopIcon /> : <MicIcon />}
                                    </IconButton>
                                </Grid>
                                <Grid item xs>
                                    <TextField
                                        fullWidth
                                        multiline
                                        maxRows={3}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type your message here..."
                                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        endIcon={<SendIcon />}
                                        onClick={handleSendMessage}
                                        disabled={!inputText.trim()}
                                    >
                                        Send
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Sidebar */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ height: '80vh', overflow: 'auto', p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Conversation Tools
                        </Typography>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<SummarizeIcon />}
                            onClick={generateSummary}
                            disabled={isGeneratingSummary}
                            sx={{ mb: 3 }}
                        >
                            Generate Medical Summary
                        </Button>

                        {isGeneratingSummary && <LinearProgress sx={{ mb: 2 }} />}

                        {summary && (
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="primary" gutterBottom>
                                        AI Medical Summary
                                    </Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                        {summary}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}

                        {/* Participants */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="subtitle2" gutterBottom>
                                    Participants
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Chip label="Doctor" color="primary" size="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2">Dr. Smith (English)</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Chip label="Patient" color="secondary" size="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2">John Doe (Spanish)</Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Translation Info */}
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle2" gutterBottom>
                                    Translation Settings
                                </Typography>
                                <Typography variant="body2">
                                    Current: English ↔ {targetLanguage.toUpperCase()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Messages auto-translate in real-time
                                </Typography>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Conversation;