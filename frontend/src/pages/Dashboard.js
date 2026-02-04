import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    Box,
    TextField,
    InputAdornment,
    IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const startNewConversation = () => {
        window.location.href = '/conversation';
    };

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5">
                        Welcome, {user.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {user.role === 'doctor' ? 'Medical Practitioner' : 'Patient'}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<ExitToAppIcon />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Paper>

            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search past conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Quick Actions */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <AddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                New Consultation
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Start a new conversation with {user.role === 'doctor' ? 'a patient' : 'your doctor'}
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={startNewConversation}
                            >
                                Start Now
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <ChatIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Active Conversations
                            </Typography>
                            <Typography variant="h3" color="primary">
                                0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                No active conversations
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <HistoryIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Past Consultations
                            </Typography>
                            <Typography variant="h3" color="primary">
                                0
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Start your first conversation
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <Paper sx={{ p: 3, mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Getting Started
                </Typography>
                <Typography paragraph>
                    1. Click "Start Now" to begin a new consultation
                </Typography>
                <Typography paragraph>
                    2. Type your message in English or your preferred language
                </Typography>
                <Typography paragraph>
                    3. Use the microphone icon to record audio messages
                </Typography>
                <Typography paragraph>
                    4. View real-time translations during the conversation
                </Typography>
            </Paper>
        </Container>
    );
};

export default Dashboard;