import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const handleResetPassword = async () => {
    setError("");
    setSuccessMsg("");
  
    // التحقق من تطابق كلمات المرور
    if (newPassword !== confirmNewPassword) {
      setError("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }
  
    console.log("newPassword:", newPassword);
    console.log("confirmNewPassword:", confirmNewPassword);
  
    try {
      // إرسال طلب التغيير إلى API
      const response = await axios.put(
        "https://app.balady-sa.pro/api/v1/auth/resetPassword",
        { newPassword, confirmNewPassword }
      );
  
      console.log("Response:", response.data);  // طباعة الاستجابة للتأكد من أنها صحيحة
  
      if (response.data.status?.toLowerCase() === "success") {
        setSuccessMsg("تم تغيير كلمة المرور بنجاح.");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError("حدث خطأ أثناء تغيير كلمة المرور");
      }
      
    } catch (err) {
      console.error("Error during password reset:", err);  // طباعة الخطأ في الكونسول
      setError(err.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور");
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box mt={10} p={4} boxShadow={3} borderRadius={2} bgcolor="#fff">
        <Typography variant="h5" textAlign="center" mb={2}>
          إعادة تعيين كلمة المرور
        </Typography>

        {/* عرض الرسالة إذا كانت هناك أخطاء */}
        {error && <Alert severity="error">{error}</Alert>}
        
        {/* عرض الرسالة عند النجاح */}
        {successMsg && <Alert severity="success">{successMsg}</Alert>}

        {/* حقل كلمة المرور الجديدة */}
        <TextField
          label="كلمة المرور الجديدة"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {/* حقل تأكيد كلمة المرور */}
        <TextField
          label="تأكيد كلمة المرور"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />

        {/* زر تغيير كلمة المرور */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleResetPassword}
        >
          تغيير كلمة المرور
        </Button>
      </Box>
    </Container>
  );
};

export default ResetPassword;
