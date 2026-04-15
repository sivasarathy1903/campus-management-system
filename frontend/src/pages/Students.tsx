import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Avatar } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Trash2, Edit2, UserPlus, Upload, X } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', department: '', email: '', imageUrl: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar('File size exceeds 2MB limit', 'error');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async () => {
    try {
      let studentId = editingId;
      if (editingId) {
        await api.put(`/api/students/${editingId}`, formData);
      } else {
        const response = await api.post('/api/students', formData);
        studentId = response.data.id;
      }

      // Handle File Upload
      if (selectedFile && studentId) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        await api.post(`/api/students/${studentId}/photo`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      showSnackbar(`Student ${editingId ? 'updated' : 'created'} successfully`, 'success');
      setOpen(false);
      resetForm();
      fetchStudents();
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', department: '', email: '', imageUrl: '' });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDelete = async (id: string) => {
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
    { 
      field: 'profilePhoto', 
      headerName: 'Photo', 
      width: 80,
      renderCell: (params) => (
        <Avatar 
          src={params.row.imageUrl || (params.value?.startsWith('http') ? params.value : `${import.meta.env.VITE_API_URL}${params.value}`)} 
          sx={{ width: 40, height: 40, border: '2px solid rgba(255,255,255,0.1)' }}
        />
      )
    },
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
              setFormData({ name: params.row.name, department: params.row.department, email: params.row.email, imageUrl: params.row.imageUrl || '' });
              setPreviewUrl(params.row.imageUrl || (params.row.profilePhoto?.startsWith('http') ? params.row.profilePhoto : `${import.meta.env.VITE_API_URL}${params.row.profilePhoto}`));
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
            onClick={() => { resetForm(); setOpen(true); }}
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

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { background: '#1A1A2E', backgroundImage: 'none', borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={previewUrl || ''}
                sx={{ width: 100, height: 100, mb: 2, border: '3px solid #3f51b5' }}
              />
              <IconButton
                component="label"
                sx={{ position: 'absolute', bottom: 10, right: -10, bgcolor: '#3f51b5', '&:hover': { bgcolor: '#303f9f' } }}
                size="small"
              >
                <Upload size={16} color="white" />
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </IconButton>
              {previewUrl && (
                <IconButton
                  sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'rgba(255,0,0,0.8)', '&:hover': { bgcolor: 'red' } }}
                  size="small"
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                >
                  <X size={12} color="white" />
                </IconButton>
              )}
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Allowed: JPG, PNG (Max 2MB)</Typography>
          </Box>

          <TextField
            fullWidth
            label="Name"
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Image URL (Optional)"
            margin="dense"
            placeholder="https://example.com/image.jpg"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ px: 4, borderRadius: 2 }}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </motion.div>
  );
};

export default Students;
