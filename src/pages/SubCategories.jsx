import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Pagination,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const subCategoriesPerPage = 6;

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('https://app.balady-sa.pro/api/v1/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.data); // تخزين الـ Categories
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء تحميل التصنيفات.');
    }
  }, [token]);

  // Fetch SubCategories
  const fetchSubCategories = useCallback(async (currentPage = page, categoryId = selectedCategory) => {
    try {
      setLoading(true);
      let url = 'https://app.balady-sa.pro/api/v1/subCategories';
      const params = {
        search,
        page: currentPage,
      };
      if (categoryId) {
        url = `https://app.balady-sa.pro/api/v1/categories/${categoryId}/subcategories`; // استخدم الـ ID الخاص بالـ Category
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      const totalItems = response.data.totalSubCategories;
      const newTotalPages = Math.ceil(totalItems / subCategoriesPerPage);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
        return;
      }

      setSubCategories(response.data.data);
      setTotalPages(newTotalPages);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء تحميل التصنيفات الفرعية.');
    } finally {
      setLoading(false);
    }
  }, [token, search, page, selectedCategory]);

  useEffect(() => {
    fetchCategories(); // جلب الـ Categories عند تحميل الصفحة
    fetchSubCategories(); // جلب الـ SubCategories الافتراضي
  }, [fetchCategories, fetchSubCategories]);

  // Handle Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Handle Category Change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  // Handle Page Change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("هل أنت متأكد من حذف هذا التصنيف الفرعي؟");
    if (!confirm) return;
  
    try {
      await axios.delete(`https://app.balady-sa.pro/api/v1/subCategories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // إزالة التصنيف المحذوف من الـ state مباشرة
      setSubCategories(prevSubCategories => prevSubCategories.filter(subCategory => subCategory._id !== id));
  
      alert("تم الحذف بنجاح!");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف.");
    }
  };
  

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">قائمة التصنيفات الفرعية</Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => navigate("/dashboard/subcategories/create")} // هذا هو الرابط الخاص بصفحة CreateSubCategory
        >
          تصنيف فرعي جديد
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="ابحث عن تصنيف فرعي"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          fullWidth
          sx={{ mr: 2 }}
        />
        <IconButton onClick={() => fetchSubCategories()}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Dropdown for Categories */}
      <Box sx={{ mb: 2, width: '200px' }}>
        <FormControl fullWidth>
          <InputLabel>اختر تصنيف رئيسي</InputLabel>
          <Select
            value={selectedCategory}
            label="اختر تصنيف رئيسي"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">الكل</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="SubCategories Table">
            <TableHead>
              <TableRow>
                <TableCell>الصورة</TableCell>
                <TableCell>اسم التصنيف الفرعي</TableCell>
                <TableCell>اسم التصنيف الرئيسي</TableCell>
                <TableCell>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subCategories.map((subCategory) => (
                <TableRow key={subCategory._id}>
                  <TableCell>
                    <Avatar alt={subCategory.name} src={subCategory.image} sx={{ width: 40, height: 40 }} />
                  </TableCell>
                  <TableCell>{subCategory.name}</TableCell>
                  <TableCell>{subCategory.category.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/dashboard/subcategories/${subCategory._id}/edit`)}
                      sx={{ mr: 1 }}
                    >
                      تعديل
                    </Button>

                    <IconButton color="error" onClick={() => handleDelete(subCategory._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
      />
    </Container>
  );
};

export default SubCategories;
