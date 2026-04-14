import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Trash2, Edit2, UserPlus } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', department: '', email: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ROLE_ADMIN';
  const isFaculty = user.role === 'ROLE_FACULTY';

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/students');
      setStudents(response.data.content);
    } catch (err) {
      showSnackbar('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/api/students/${editingId}`, formData);
        showSnackbar('Student updated successfully', 'success');
      } else {
        await api.post('/api/students', formData);
        showSnackbar('Student created successfully', 'success');
      }
      setOpen(false);
      setFormData({ name: '', department: '', email: '' });
      setEditingId(null);
      fetchStudents();
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/api/students/${id}`);
        showSnackbar('Student deleted successfully', 'success');
        fetchStudents();
      } catch (err) {
        showSnackbar('Failed to delete student', 'error');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'department', headerName: 'Department', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'createdBy', headerName: 'Created By', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => {
              setEditingId(params.row.id);
              setFormData({ name: params.row.name, department: params.row.department, email: params.row.email });
              setOpen(true);
            }}
            disabled={!isAdmin && user.email !== params.row.createdBy}
          >
            <Edit2 size={16} />
          </IconButton>
          {isAdmin && (
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
              <Trash2 size={16} />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Student Management</Typography>
        {(isAdmin || isFaculty) && (
          <Button
            variant="contained"
            startIcon={<UserPlus size={20} />}
            onClick={() => { setEditingId(null); setFormData({ name: '', department: '', email: '' }); setOpen(true); }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Add Student
          </Button>
        )}
      </Box>

      <Paper sx={{ height: 600, width: '100%', background: 'rgba(26, 26, 46, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 4 }}>
        <DataGrid
          rows={students}
          columns={columns}
          loading={loading}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25]}
          sx={{
            border: 'none',
            color: 'white',
            '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(255, 255, 255, 0.05)' },
            '& .MuiDataGrid-columnHeaders': { background: 'rgba(0, 0, 0, 0.2)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' },
            '& .MuiDataGrid-footerContainer': { borderTop: '1px solid rgba(255, 255, 255, 0.1)' },
          }}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { background: '#1A1A2E', backgroundImage: 'none' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <TextField
            fullWidth
            label="Name"
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Department"
            margin="dense"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email Address"
            margin="dense"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={editingId !== null}
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

export default Students;
