import React, { useEffect, useState, useCallback} from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const AccountSettings = () => {
  const [admin, setAdmin] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const token = localStorage.getItem("token");

  const fetchAdminData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://app.balady-sa.pro/api/v1/user/getMe",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAdmin(response.data.data);
    } catch (error) {
      console.error("فشل في جلب بيانات الأدمن:", error);
    }
  }, [token]);
  
  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImg", file);

    try {
      await axios.put("https://app.balady-sa.pro/api/v1/user/updateMyData", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAdminData();
    } catch (error) {
      console.error("فشل رفع الصورة:", error);
    }
  };

  const handleDeleteImage = async () => {
    const formData = new FormData();
    formData.append("profileImg", "");

    try {
      await axios.put("https://app.balady-sa.pro/api/v1/user/updateMyData", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAdminData();
    } catch (error) {
      console.error("فشل حذف الصورة:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("https://app.balady-sa.pro/api/v1/user/deleteMyAcc", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("فشل حذف الحساب:", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put(
        "https://app.balady-sa.pro/api/v1/user/changeMyPasswordAccount",
        {
          currentPassword: passwords.currentPassword,
          password: passwords.newPassword,
          passwordConfirm: passwords.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowPasswordForm(false);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("فشل تغيير كلمة المرور:", error);
    }
  };

  const handleEditField = (field) => {
    setEditField(field);
    setEditValue(admin[field]);
    setOpenDialog(true);
  };

  const handleSaveField = async () => {
    const formData = new FormData();
    formData.append(editField, editValue);

    try {
      await axios.put("https://app.balady-sa.pro/api/v1/user/updateMyData", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpenDialog(false);
      fetchAdminData();
    } catch (error) {
      console.error("فشل تعديل البيانات:", error);
    }
  };

  if (!admin) {
    return <Typography>جاري تحميل البيانات...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        {/* صورة البروفايل */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            alt={admin.userName}
            src={admin.profileImg}
            sx={{ width: 100, height: 100 }}
          />
          <Box>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{ mr: 1 }}
            >
              تغيير الصورة
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteImage}
            >
              حذف الصورة
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* بيانات الأدمن */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { label: "Name", value: admin.userName, field: "userName" },
            { label: "Email", value: admin.email, field: "email" },
            { label: "Phone", value: admin.phone, field: "phone" },
            { label: "Role", value: admin.role, field: "role" },
          ].map((item) => (
            <Box
              key={item.field}
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <Typography variant="body1">
                <strong>{item.label}:</strong> {item.value}
              </Typography>
              <IconButton onClick={() => handleEditField(item.field)}>
                <EditIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* تغيير الباسورد */}
        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            تغيير كلمة المرور
          </Button>

          {showPasswordForm && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <TextField
                label="كلمة المرور الحالية"
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
              <TextField
                label="كلمة المرور الجديدة"
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              />
              <TextField
                label="تأكيد كلمة المرور"
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirmPassword: e.target.value })
                }
              />
              <Button variant="contained" onClick={handleChangePassword}>
                حفظ كلمة المرور
              </Button>
            </Box>
          )}
        </Box>

        {/* حذف الحساب */}
        <Box sx={{ mt: 5 }}>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setOpenConfirmDialog(true)}
          >
            حذف الحساب نهائيًا
          </Button>
        </Box>
      </Paper>

      {/* مودال التعديل */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>تعديل {editField}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label={`ادخل ${editField}`}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>إلغاء</Button>
          <Button variant="contained" onClick={handleSaveField}>
            حفظ
          </Button>
        </DialogActions>
      </Dialog>

      {/* تأكيد حذف الحساب */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد أنك تريد حذف حسابك نهائيًا؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>إلغاء</Button>
          <Button variant="contained" color="error" onClick={handleDeleteAccount}>
            نعم، احذف الحساب
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountSettings;
