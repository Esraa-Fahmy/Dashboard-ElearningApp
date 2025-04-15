import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateSubCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://app.balady-sa.pro/api/v1/categories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data.data);
      } catch (err) {
        console.error(err);
        setError('حدث خطأ أثناء تحميل التصنيفات.');
      }
    };
    fetchCategories();
  }, [token]);

  // Handle Form Submit for Adding SubCategory
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !name || !image) {
      setError('يرجى ملء جميع الحقول.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('image', image);
      formData.append('category', selectedCategory);

      await axios.post(`https://app.balady-sa.pro/api/v1/categories/${selectedCategory}/subcategories`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      navigate('/dashboard/subcategories'); /// العودة إلى صفحة SubCategories بعد الإضافة
    } catch (err) {
      setLoading(false);
      console.error(err);
      setError('حدث خطأ أثناء إضافة التصنيف الفرعي.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>إضافة تصنيف فرعي جديد</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleFormSubmit}>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>اختر تصنيف رئيسي</InputLabel>
            <Select
              value={selectedCategory}
              label="اختر تصنيف رئيسي"
              onChange={(e) => setSelectedCategory(e.target.value)}
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
          <TextField
            label="اسم التصنيف الفرعي"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
  <input
    accept="image/*"
    style={{ display: 'none' }}
    id="upload-image"
    type="file"
    onChange={(e) => setImage(e.target.files[0])}
  />
  <label htmlFor="upload-image">
    <Button variant="outlined" component="span" fullWidth>
      {image ? `✔ تم اختيار: ${image.name}` : 'اختر صورة التصنيف الفرعي'}
    </Button>
  </label>
</Box>


        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            type="submit"
            disabled={loading}
          >
            {loading ? 'جاري الإضافة...' : 'إضافة'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/subcategories')} // العودة إلى صفحة SubCategories
          >
            إلغاء
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateSubCategory;
