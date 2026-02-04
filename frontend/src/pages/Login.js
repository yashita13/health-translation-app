import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('doctor');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Mock login - no actual API call needed
            localStorage.setItem('user', JSON.stringify({
                id: role === 'doctor' ? '1' : '2',
                name: role === 'doctor' ? 'Dr. Smith' : 'John Doe',
                email: email || `${role}@example.com`,
                role: role,
                language: role === 'doctor' ? 'en' : 'es'
            }));

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <MedicalServicesIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" gutterBottom>
                        Health Translation
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Doctor-Patient Communication Platform
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleLogin}>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={role}
                            label="Role"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="doctor">Doctor</MenuItem>
                            <MenuItem value="patient">Patient</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                        placeholder="doctor@example.com or patient@example.com"
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                        placeholder="Enter any password for demo"
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3 }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                        Demo credentials: Use any email/password
                    </Typography>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;