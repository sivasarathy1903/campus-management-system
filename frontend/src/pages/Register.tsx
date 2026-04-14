import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Container, Alert, Link, MenuItem } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_STUDENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'ROLE_STUDENT', label: 'Student' },
    { value: 'ROLE_FACULTY', label: 'Faculty' },
    { value: 'ROLE_ADMIN', label: 'Administrator' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
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
      setError(error.response?.data?.message || 'Registration failed.');
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
        <Box sx={{ mt: 6, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              Join Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', opacity: 0.7 }}>
              Create your campus account
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                fullWidth
                select
                label="I am a..."
                margin="normal"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {roles.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                margin="normal"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" sx={{ color: '#6C3CE1', fontWeight: 600, textDecoration: 'none' }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Register;
