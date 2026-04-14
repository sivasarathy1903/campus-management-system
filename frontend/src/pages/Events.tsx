import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid, Card, CardContent, CardActions, Chip } from '@mui/material';
import { CalendarDays, MapPin, Plus, Trash2, Edit2, Clock } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', date: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canManage = ['ROLE_ADMIN', 'ROLE_FACULTY'].includes(user.role);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/events');
      setEvents(response.data.content);
    } catch (err) {
      showSnackbar('Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/api/events/${editingId}`, formData);
        showSnackbar('Event updated successfully', 'success');
      } else {
        await api.post('/api/events', formData);
        showSnackbar('Event created successfully', 'success');
      }
      setOpen(false);
      setFormData({ name: '', location: '', date: '', description: '' });
      setEditingId(null);
      fetchEvents();
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/api/events/${id}`);
        showSnackbar('Event deleted successfully', 'success');
        fetchEvents();
      } catch (err) {
        showSnackbar('Failed to delete event', 'error');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Campus Events</Typography>
        {canManage && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => { setEditingId(null); setFormData({ name: '', location: '', date: '', description: '' }); setOpen(true); }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Create Event
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {events.map((event: any, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card sx={{ background: 'rgba(26, 26, 46, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 4, position: 'relative' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#6C3CE1' }}>{event.name}</Typography>
                    <Chip label="Upcoming" size="small" sx={{ background: 'rgba(0, 191, 165, 0.1)', color: '#00BFA5' }} />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, opacity: 0.7 }}>
                    <CalendarDays size={16} />
                    <Typography variant="body2">{event.date}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, opacity: 0.7 }}>
                    <MapPin size={16} />
                    <Typography variant="body2">{event.location}</Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ opacity: 0.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.description}
                  </Typography>
                </CardContent>
                {canManage && (
                  <CardActions sx={{ justifyContent: 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.05)', p: 1 }}>
                    <IconButton size="small" onClick={() => {
                      setEditingId(event.id);
                      setFormData({ name: event.name, location: event.location, date: event.date, description: event.description });
                      setOpen(true);
                    }}>
                      <Edit2 size={16} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(event.id)}>
                      <Trash2 size={16} />
                    </IconButton>
                  </CardActions>
                )}
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { background: '#1A1A2E', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            fullWidth
            label="Event Name"
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Location"
            margin="dense"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            margin="dense"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            margin="dense"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ px: 4 }}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </motion.div>
  );
};

export default Events;
