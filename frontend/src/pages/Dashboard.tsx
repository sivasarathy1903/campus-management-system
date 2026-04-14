import { Box, Grid, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { Users, CalendarDays, GraduationCap, ArrowRight, UserPlus, CalendarPlus, GraduationCap as FacultyIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
const { studentCount, eventCount, facultyCount, activities, loading, error } = useDashboard();

const stats = [
  { title: 'Students', value: studentCount, icon: <Users size={24} />, color: '#6C3CE1', path: '/students' },
  { title: 'Events', value: eventCount, icon: <CalendarDays size={24} />, color: '#00BFA5', path: '/events' },
  { title: 'Faculty', value: facultyCount, icon: <GraduationCap size={24} />, color: '#FFD700', path: '/faculty' },
];

  const quickActions = [
    { title: 'Add Student', icon: <UserPlus size={20} />, path: '/students' },
    { title: 'Create Event', icon: <CalendarPlus size={20} />, path: '/events' },
    { title: 'Add Faculty', icon: <FacultyIcon size={20} />, path: '/faculty' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7 }}>
          Welcome back, <Box component="span" sx={{ color: '#6C3CE1', fontWeight: 600 }}>{user.email}</Box>
        </Typography>
      </Box>
{loading && (
  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
    <CircularProgress color="inherit" />
  </Box>
)}
{error && (
  <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
)}

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(26, 26, 46, 0.4)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(26, 26, 46, 0.6)' }
                }}
                onClick={() => navigate(stat.path)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, background: `${stat.color}22`, color: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" sx={{ opacity: 0.8 }}>{stat.title}</Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, background: 'rgba(26, 26, 46, 0.4)', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Recent Activities</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activities?.length > 0 ? activities.map((activity) => (
                <Box key={activity.id} sx={{ p: 2, borderRadius: 2, background: 'rgba(255, 255, 255, 0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{activity.title}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.5 }}>{activity.subtitle}</Typography>
                  </Box>
                  <ArrowRight size={16} style={{ opacity: 0.5 }} />
                </Box>
              )) : (
                <Typography variant="body2" sx={{ opacity: 0.5, fontStyle: 'italic' }}>No recent activities found.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, background: 'rgba(26, 26, 46, 0.4)', borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Quick Actions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  fullWidth
                  variant="outlined"
                  startIcon={action.icon}
                  onClick={() => navigate(action.path)}
                  sx={{ justifyContent: 'flex-start', py: 1.5, borderColor: 'rgba(255, 255, 255, 0.1)', '&:hover': { borderColor: '#6C3CE1' } }}
                >
                  {action.title}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default Dashboard;
