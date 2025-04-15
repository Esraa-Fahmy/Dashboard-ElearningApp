import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button,
  IconButton, InputAdornment, Box, Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://app.balady-sa.pro/api/v1/auth/login', {
        email,
        password,
      });

      const user = res.data.data;
      const token = res.data.token;

      // تحقق إنه Admin
      if (user.role !== 'admin') {
        setError('هذا المستخدم ليس مسؤول (Admin)');
        return;
      }

      // حفظ التوكن في localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // توجيه للداشبورد
      navigate('/dashboard');
    } catch (err) {
      console.log(err.response); 
      setError('حدث خطأ أثناء تسجيل الدخول، تأكد من البيانات.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>تسجيل الدخول</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="البريد الإلكتروني"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="كلمة المرور"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          تسجيل الدخول
        </Button>

        <Button
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate('/forgot-password')}
        >
          هل نسيت كلمة المرور؟
        </Button>
        <Button
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate('/signup')}
        >
انشاء حساب ؟   </Button>
      </Box>
    </Container>
  );
};

export default Login;
