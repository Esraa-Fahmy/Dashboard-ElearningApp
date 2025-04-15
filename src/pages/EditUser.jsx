import React, { useState, useEffect } from 'react';
import { Button, TextField, Avatar, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams();
  const [userName, setUserName] = useState('');  // نبدأ بقيمة فاضية
  const [email, setEmail] = useState('');        // نبدأ بقيمة فاضية
  const [phone, setPhone] = useState('');        // نبدأ بقيمة فاضية
  const [role, setRole] = useState('');          // نبدأ بقيمة فاضية
  const [profileImg, setProfileImg] = useState(null); // لحفظ الصورة
  const [previewImg, setPreviewImg] = useState(''); // لعرض الصورة المؤقتة في الـ Avatar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://app.balady-sa.pro/api/v1/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // جلب البيانات من الـ API
        const { profileImg } = response.data.data;

        // لا يتم تعبئة الـ inputs تلقائيًا بالقيم عند فتح الصفحة
        // عرض صورة البروفايل فقط إذا كانت موجودة
        setPreviewImg(profileImg || ''); 
      } catch (error) {
        console.log('Error response:', error.response?.data);
        setError(error.response?.data?.message || 'حدث خطأ أثناء تحديث البيانات.');
      }
    };

    fetchUserData();
  }, [id, token]);

  const handleUpdateUser = async () => {
    const formData = new FormData();

    if (userName) formData.append('userName', userName);
    if (phone) formData.append('phone', phone);
    if (role) formData.append('role', role);
    if (email) formData.append('email', email);
    if (profileImg) formData.append('profileImg', profileImg);  // إضافة الصورة إلى الـ FormData

    try {
      setLoading(true);
      await axios.put(`https://app.balady-sa.pro/api/v1/user/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('تم تحديث البيانات بنجاح!');
      navigate('/dashboard/users');
    } catch (error) {
      setError('حدث خطأ أثناء تحديث البيانات.');
      console.error('Error updating user:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <h2>تعديل بيانات المستخدم</h2>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <TextField
        label="الاسم"
        value={userName}  // خلي الـ input فاضي علشان تقدر تكتب فيه
        onChange={(e) => setUserName(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="البريد الإلكتروني"
        value={email}  // خلي الـ input فاضي علشان تقدر تكتب فيه
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="رقم الهاتف"
        value={phone}  // خلي الـ input فاضي علشان تقدر تكتب فيه
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="الدور"
        value={role}  // خلي الـ input فاضي علشان تقدر تكتب فيه
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        margin="normal"
      />

      {/* عرض صورة البروفايل في حالة وجودها */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          alt={userName}
          src={profileImg ? URL.createObjectURL(profileImg) : previewImg}  // لو في صورة محلية تم رفعها، هنعرضها
          sx={{ width: 56, height: 56, mr: 2 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImg(e.target.files[0])}  // حفظ الصورة المرفوعة
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdateUser}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'تحديث'}
      </Button>
    </Box>
  );
};

export default EditUser;
