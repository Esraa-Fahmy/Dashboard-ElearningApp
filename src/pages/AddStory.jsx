// src/pages/AddStory.jsx
import React, { useEffect, useState, useCallback} from 'react';
import {
  Container, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStory = () => {
    const [formData, setFormData] = useState({
      title: '',
      imageCover: null,
      images: null,
      subCategory: '',
    });
    const [subCategories, setSubCategories] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
  
    // ⬇️ تعريف الدالة باستخدام useCallback
    const fetchSubCategories = useCallback(async () => {
      try {
        const { data } = await axios.get('https://app.balady-sa.pro/api/v1/subCategories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubCategories(data.data);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
      }
    }, [token]);
  
    useEffect(() => {
      fetchSubCategories();
    }, [fetchSubCategories]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append('title', formData.title);
    if (formData.imageCover) body.append('imageCover', formData.imageCover[0]);
    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        body.append('images', formData.images[i]);
      }
    }
    body.append('subCategory', formData.subCategory);

    try {
      await axios.post('https://app.balady-sa.pro/api/v1/story', body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard/stories'); // رجوع لصفحة القصص
    } catch (err) {
      console.error('Error adding story:', err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" mb={3}>إضافة قصة جديدة</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="title"
          label="العنوان"
          fullWidth
          margin="normal"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>التصنيف الفرعي</InputLabel>
          <Select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleInputChange}
            required
          >
            {subCategories.map((sub) => (
              <MenuItem key={sub._id} value={sub._id}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" mt={2}>صورة الغلاف (اختياري)</Typography>
        <input
          type="file"
          name="imageCover"
          accept="image/*"
          onChange={handleInputChange}
        />
        <Typography variant="body2" mt={2}>صور القصة</Typography>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleInputChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
        >
          إضافة القصة
        </Button>
      </form>
    </Container>
  );
};

export default AddStory;
