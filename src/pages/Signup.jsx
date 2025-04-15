import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSignup = async () => {
    setError("");
    setSuccessMsg("");

    if (password !== passwordConfirm) {
      setError("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    try {
      const { data } = await axios.post(
        "https://app.balady-sa.pro/api/v1/auth/signup",
        {
          userName,
          email,
          password,
          passwordConfirm,
        }
      );

      console.log(data);

      setSuccessMsg("تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err.response);
      setError(
        err.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب"
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2} bgcolor="#fff">
        <Typography variant="h5" textAlign="center" mb={2}>
          إنشاء حساب جديد
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}

        <TextField
          label="الاسم"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <TextField
          label="الإيميل"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="كلمة المرور"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="تأكيد كلمة المرور"
          type={showPasswordConfirm ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPasswordConfirm((prev) => !prev)}
                  edge="end"
                >
                  {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
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
          onClick={handleSignup}
        >
          إنشاء الحساب
        </Button>

        <Button onClick={() => navigate("/")} fullWidth sx={{ mt: 2 }}>
          لدي حساب بالفعل
        </Button>
      </Box>
    </Container>
  );
};

export default Signup;
