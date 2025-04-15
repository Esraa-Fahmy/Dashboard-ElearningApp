import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image) {
      setError('الرجاء إدخال اسم التصنيف والصورة.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      await axios.post('https://app.balady-sa.pro/api/v1/categories', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/dashboard/categories'); // العودة إلى صفحة التصنيفات بعد النجاح
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إضافة التصنيف.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>إضافة تصنيف جديد</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="اسم التصنيف"
            variant="outlined"
            fullWidth
            value={name}
            onChange={handleNameChange}
            required
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" fullWidth type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'إضافة التصنيف'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateCategory;
