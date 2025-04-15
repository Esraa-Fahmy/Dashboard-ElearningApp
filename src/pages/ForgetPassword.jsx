import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");

    try {
      const response = await axios.post(
        "https://app.balady-sa.pro/api/v1/auth/forgetPassword",
        { email }
      );
      setSuccessMsg(response.data.message);
      
      // تخزين البريد الإلكتروني في localStorage
      localStorage.setItem("email", email);

      navigate("/verify-reset-code");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء إرسال الرمز");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2} bgcolor="#fff">
        <Typography variant="h5" textAlign="center" mb={2}>
          استرجاع كلمة المرور
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}

        <TextField
          label="البريد الإلكتروني"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          إرسال الرمز
        </Button>
      </Box>
    </Container>
  );
};

export default ForgetPassword;
