import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, Alert, InputAdornment, IconButton, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        role: response.data.role,
        id: response.data.id
      }));
      navigate('/dashboard');
    } catch (error: any) {
      console.log('Error Data:', error.response?.data);
      console.log('Error Status:', error.response?.status);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
              background: 'rgba(26, 26, 46, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 4,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center', background: 'linear-gradient(45deg, #6C3CE1, #00BFA5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', opacity: 0.7 }}>
              Secure access to Campus Management System
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(108, 60, 225, 0.3)',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" sx={{ color: '#6C3CE1', fontWeight: 600, textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Login;
