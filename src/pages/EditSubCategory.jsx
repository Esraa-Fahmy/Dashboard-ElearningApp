import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, CircularProgress, TextField,
  Button, Avatar, IconButton, FormControl, InputLabel,
  Select, MenuItem, Alert
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const EditSubCategory = () => {
  // eslint-disable-next-line no-unused-vars
  const [subCategory, setSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://app.balady-sa.pro/api/v1/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.data);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل التصنيفات.');
      }
    };

    const fetchSubCategory = async () => {
      try {
        const response = await axios.get(`https://app.balady-sa.pro/api/v1/subCategories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data;
        setSubCategory(data);
        setName(data.name || ''); // تأكد من أنه يمكن تركه فارغًا إذا لم يوجد قيمة
        setSelectedCategory(data.category._id || ''); // تأكد من أنه يمكن تركه فارغًا
        setImage(data.image || null); // رابط الصورة القديم
      } catch (err) {
        setError('حدث خطأ أثناء تحميل التصنيف الفرعي.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchSubCategory();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('name', name);
    if (image instanceof File) {
      formData.append('image', image);
    }
    formData.append('category', selectedCategory);

    try {
      await axios.put(`https://app.balady-sa.pro/api/v1/subCategories/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('تم التعديل بنجاح!');
      navigate('/dashboard/subcategories');
    } catch (err) {
      setError('خطا حدد البايانات كاملة');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  // تجهيز الصورة للعرض
  let imagePreview = null;
  if (image instanceof File) {
    imagePreview = URL.createObjectURL(image);
  } else if (typeof image === 'string') {
    imagePreview = image;
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>تعديل التصنيف الفرعي</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="اسم التصنيف الفرعي"
            variant="outlined"
            value={name || ''}  // التأكد من أن الحقل فارغ إذا لم يتم تحميل القيمة
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>اختر التصنيف الرئيسي</InputLabel>
            <Select
              value={selectedCategory || ''}  // التأكد من أن الحقل فارغ إذا لم يتم تحميل القيمة
              onChange={handleCategoryChange}
              label="اختر التصنيف الرئيسي"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 2 }}>
          {imagePreview && (
            <Avatar alt={name} src={imagePreview} sx={{ width: 100, height: 100, mb: 2 }} />
          )}
          <Button variant="outlined" component="label">
            اختر صورة
            <input type="file" hidden onChange={handleImageChange} />
          </Button>

          {image && (
            <IconButton color="error" onClick={handleDeleteImage} sx={{ ml: 2 }}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={updating}
          >
            {updating ? 'جاري التعديل...' : 'تعديل التصنيف'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditSubCategory;
