// src/pages/CreateUser.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  InputLabel,
  FormControl,
  Select,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    role: 'user',
    profileImg: null,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImg') {
      setFormData({ ...formData, profileImg: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await axios.post('https://app.balady-sa.pro/api/v1/user', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('تم إنشاء المستخدم بنجاح');
      setTimeout(() => navigate('/dashboard/users'), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'حدث خطأ أثناء إنشاء المستخدم.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        إنشاء مستخدم جديد
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          label="الاسم"
          name="userName"
          fullWidth
          margin="normal"
          required
          value={formData.userName}
          onChange={handleChange}
        />
        <TextField
          label="البريد الإلكتروني"
          name="email"
          fullWidth
          margin="normal"
          required
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="كلمة المرور"
          name="password"
          fullWidth
          margin="normal"
          required
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          label="تأكيد كلمة المرور"
          name="passwordConfirm"
          fullWidth
          margin="normal"
          required
          type="password"
          value={formData.passwordConfirm}
          onChange={handleChange}
        />
        <TextField
          label="رقم الهاتف (اختياري)"
          name="phone"
          fullWidth
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
        />
       <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
  <InputLabel>role</InputLabel>
  <Select name="role" value={formData.role} onChange={handleChange} required>
    <MenuItem value="user">user</MenuItem>
    <MenuItem value="admin">admin</MenuItem>
  </Select>
</FormControl>

<Box mt={3}>
  <Typography variant="subtitle1" sx={{ mb: 1 }}>
    صورة البروفايل
  </Typography>
  <TextField
    name="profileImg"
    type="file"
    fullWidth
    onChange={handleChange}
    inputProps={{ accept: 'image/*' }}
  />
</Box>


        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            إنشاء المستخدم
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateUser;
