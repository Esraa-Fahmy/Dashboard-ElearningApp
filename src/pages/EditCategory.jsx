import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Avatar, IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete'; // استيراد أيقونة الحذف

const EditCategory = () => {
  const { id } = useParams(); // جلب الـ ID من الـ URL
  const [category, setCategory] = useState({ name: '', image: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null); // لتحميل الصورة
  const [imageError, setImageError] = useState(''); // لتخزين رسالة الخطأ في حال عدم وجود صورة
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // جلب بيانات التصنيف من الـ API
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`https://app.balady-sa.pro/api/v1/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategory(response.data.data);
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات التصنيف.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, token]);

  // التعامل مع التغيير في الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  // التعامل مع تغيير الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageError(''); // إزالة أي رسالة خطأ عند تحديد صورة جديدة
    }
  };

  // حذف الصورة
  const handleDeleteImage = () => {
    setImageFile(null); // مسح الصورة
    setCategory((prevCategory) => ({
      ...prevCategory,
      image: '', // مسح رابط الصورة من بيانات التصنيف
    }));
  };

  // حفظ التعديلات
  const handleSave = async () => {
    // التحقق من وجود صورة
    if (!category.image && !imageFile) {
      setImageError('يجب إدخال صورة للتصنيف'); // عرض رسالة الخطأ إذا لم يكن هناك صورة
      return;
    }

    const formData = new FormData();
    formData.append('name', category.name);
    if (imageFile) {
      formData.append('image', imageFile); // إضافة الصورة إلى الـ FormData
    }

    try {
      await axios.put(`https://app.balady-sa.pro/api/v1/categories/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // تحديد نوع المحتوى لرفع الملفات
        },
      });
      navigate('/dashboard/categories'); // الرجوع إلى صفحة التصنيفات بعد التعديل
    } catch (err) {
      setError('حدث خطأ أثناء حفظ التعديلات.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>تعديل التصنيف</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {loading ? (
        <Typography>جاري تحميل البيانات...</Typography>
      ) : (
        <Box component="form" sx={{ mt: 2 }} encType="multipart/form-data">
          {category.image || imageFile ? (
            <Avatar src={imageFile ? URL.createObjectURL(imageFile) : category.image} sx={{ width: 100, height: 100, marginBottom: 2 }} />
          ) : null}

          {category.image || imageFile ? (
            <IconButton onClick={handleDeleteImage} color="secondary">
              <DeleteIcon />
            </IconButton>
          ) : null}

          <TextField
            fullWidth
            label="اسم التصنيف"
            variant="outlined"
            value={category.name}
            name="name"
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: '16px' }}
          />
          {imageError && <Typography color="error">{imageError}</Typography>} {/* عرض رسالة الخطأ إذا كانت الصورة مفقودة */}
          <Button variant="contained" color="primary" onClick={handleSave}>
            حفظ التعديلات
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default EditCategory;
