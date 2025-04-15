import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [resetCode, setResetCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleVerifyOTP = async () => {
    setError("");
    setSuccessMsg("");

    try {
      const response = await axios.post(
        "https://app.balady-sa.pro/api/v1/auth/verifyResetCode",
        { resetCode }
      );

      if (response.data.status === "Success") {
        setSuccessMsg("تم التحقق من الرمز بنجاح. يمكنك الآن تعيين كلمة المرور الجديدة.");
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء التحقق من الرمز");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2} bgcolor="#fff">
        <Typography variant="h5" textAlign="center" mb={2}>
          تحقق من رمز OTP
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}

        <TextField
          label="رمز OTP"
          variant="outlined"
          fullWidth
          margin="normal"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
        />

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleVerifyOTP}>
          تحقق من الرمز
        </Button>
      </Box>
    </Container>
  );
};

export default VerifyOTP;
