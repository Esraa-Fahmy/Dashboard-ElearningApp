import React, { useEffect, useState, useCallback  } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  TablePagination,
  Box,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Modal,
  IconButton,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const AllStories = () => {
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(6);
  const [total, setTotal] = useState(0);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStory, setEditStory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageCover: null,
    images: null,
    subCategory: '',
    oldImageCover: '',
    oldImages: [],
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchSubCategories = useCallback(async () => {
    try {
      const { data } = await axios.get('https://app.balady-sa.pro/api/v1/subCategories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(data.data);
    } catch (err) {
      console.error('Error fetching subCategories:', err);
    }
  }, [token]);

  // ⬇️ نفس الشيء هنا
  const fetchStories = useCallback(async () => {
    try {
      let url = 'https://app.balady-sa.pro/api/v1/story';
      let params = { search, page: page + 1 };

      if (selectedSubCategory) {
        url = `https://app.balady-sa.pro/api/v1/subCategories/${selectedSubCategory}/stories`;
        params = {};
      }

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setStories(data.data);
      setTotal(data.totalStories || data.data.length);
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  }, [search, page, selectedSubCategory, token]);

  // useEffect بعد ما الدوال بقت ثابتة
  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);
;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
    setPage(0);
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه القصة؟')) {
      try {
        await axios.delete(`https://app.balady-sa.pro/api/v1/story/${storyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchStories();
      } catch (err) {
        console.error('Error deleting story:', err);
      }
    }
  };

  const openEditModal = (story) => {
    setEditStory(story);
    setFormData({
      title: story.title || '',
      imageCover: null,
      images: null,
      subCategory: story.subCategory?._id || '',
      oldImageCover: story.imageCover || '',
      oldImages: story.images || [],
    });
    setEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveOldImageCover = () => {
    setFormData((prev) => ({ ...prev, oldImageCover: '' }));
  };

  const handleRemoveOldImage = (index) => {
    const updatedImages = [...formData.oldImages];
    updatedImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, oldImages: updatedImages }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    if (formData.title) body.append('title', formData.title);
    if (formData.imageCover) body.append('imageCover', formData.imageCover[0]);
    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        body.append('images', formData.images[i]);
      }
    }
    if (formData.subCategory) body.append('subCategory', formData.subCategory);

    try {
      await axios.put(`https://app.balady-sa.pro/api/v1/story/${editStory._id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditModalOpen(false);
      fetchStories();
    } catch (err) {
      console.error('Error updating story:', err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">القصص</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard/stories/add-story')}>
          إضافة قصة جديدة
        </Button>
      </Box>

      <Box mb={2} display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
        <TextField label="بحث" value={search} onChange={handleSearchChange} fullWidth />
        <FormControl fullWidth>
          <InputLabel>اختر تصنيف فرعي</InputLabel>
          <Select value={selectedSubCategory} onChange={handleSubCategoryChange} label="اختر تصنيف فرعي">
            <MenuItem value="">الكل</MenuItem>
            {subCategories.map((sub) => (
              <MenuItem key={sub._id} value={sub._id}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>صورة القصة</TableCell>
            <TableCell>صورة الغلاف</TableCell>
            <TableCell>العنوان</TableCell>
            <TableCell>التصنيف الرئيسي</TableCell>
            <TableCell>التصنيف الفرعي</TableCell>
            <TableCell>الإجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stories.map((story) => (
            <TableRow key={story._id}>
              <TableCell>
                <Avatar src={story.images?.[0]} variant="rounded" sx={{ width: 60, height: 60 }} />
              </TableCell>
              <TableCell>
                {story.imageCover ? (
                  <Avatar src={story.imageCover} variant="rounded" sx={{ width: 60, height: 60 }} />
                ) : (
                  '---'
                )}
              </TableCell>
              <TableCell>{story.title}</TableCell>
              <TableCell>{story.category?.name}</TableCell>
              <TableCell>{story.subCategory?.name}</TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => openEditModal(story)}>
                  تعديل
                </Button>
                <Button variant="contained" color="error" onClick={() => handleDeleteStory(story._id)}>
                  حذف
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[6]}
      />

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">تعديل القصة</Typography>
            <IconButton onClick={() => setEditModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <form onSubmit={handleEditSubmit}>
            {/* عنوان القصة */}
            <TextField
              name="title"
              label="العنوان"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={handleEditInputChange}
            />

            {/* التصنيف الفرعي */}
            <FormControl fullWidth margin="normal">
              <InputLabel>التصنيف الفرعي</InputLabel>
              <Select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleEditInputChange}
              >
                {subCategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="body2" mt={2}>صورة الغلاف</Typography>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
  {formData.oldImageCover && (
    <Box position="relative">
      <Avatar src={formData.oldImageCover} variant="rounded" sx={{ width: 60, height: 60 }} />
      <IconButton
        size="small"
        sx={{ position: 'absolute', top: -10, right: -10 }}
        onClick={handleRemoveOldImageCover}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  )}
  <Button variant="outlined" component="label">
    {formData.oldImageCover ? 'تغيير صورة الغلاف' : 'رفع صورة الغلاف'}
    <input
      type="file"
      name="imageCover"
      hidden
      onChange={handleEditInputChange}
    />
  </Button>
</Box>


            {/* الصور */}
            <Typography variant="body2" mt={2}>صورة القصة</Typography>
            <Grid container spacing={2}>
              {formData.oldImages.map((img, index) => (
                <Grid item key={index}>
                  <Box position="relative">
                    <Avatar src={img} variant="rounded" sx={{ width: 60, height: 60 }} />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: -10, right: -10 }}
                      onClick={() => handleRemoveOldImage(index)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              تغيير صورة القصة
              <input
                type="file"
                name="images"
                hidden
                multiple
                onChange={handleEditInputChange}
              />
            </Button>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button variant="contained" color="primary" type="submit">تحديث القصة</Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default AllStories;
