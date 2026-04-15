import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Avatar } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Trash2, Edit2, UserPlus, Upload, X } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', department: '', designation: '', imageUrl: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ROLE_ADMIN';
  const isFacultyRole = user.role === 'ROLE_FACULTY';

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/faculty');
      setFaculty(response.data.content);
    } catch (err) {
      showSnackbar('Failed to fetch faculty data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
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
      let facultyId = editingId;
      if (editingId) {
        await api.put(`/api/faculty/${editingId}`, formData);
      } else {
        const response = await api.post('/api/faculty', formData);
        facultyId = response.data.id;
      }

      // Handle File Upload
      if (selectedFile && facultyId) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);
        await api.post(`/api/faculty/${facultyId}/photo`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      showSnackbar(`Faculty ${editingId ? 'updated' : 'added'} successfully`, 'success');
      setOpen(false);
      resetForm();
      fetchFaculty();
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', department: '', designation: '', imageUrl: '' });
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        await api.delete(`/api/faculty/${id}`);
        showSnackbar('Faculty deleted successfully', 'success');
        fetchFaculty();
      } catch (err) {
        showSnackbar('Failed to delete faculty', 'error');
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
    { field: 'designation', headerName: 'Designation', flex: 1 },
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
              setFormData({ name: params.row.name, department: params.row.department, designation: params.row.designation, imageUrl: params.row.imageUrl || '' });
              setPreviewUrl(params.row.imageUrl || (params.row.profilePhoto?.startsWith('http') ? params.row.profilePhoto : `${import.meta.env.VITE_API_URL}${params.row.profilePhoto}`));
              setOpen(true);
            }}
            disabled={!isAdmin && !isFacultyRole}
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
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Faculty Management</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<UserPlus size={20} />}
            onClick={() => { resetForm(); setOpen(true); }}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Add Faculty
          </Button>
        )}
      </Box>

      <Paper sx={{ height: 600, width: '100%', background: 'rgba(26, 26, 46, 0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 4 }}>
        <DataGrid
          rows={faculty}
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
        <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Faculty' : 'Add New Faculty'}</DialogTitle>
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
            label="Designation"
            margin="dense"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
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

export default Faculty;
