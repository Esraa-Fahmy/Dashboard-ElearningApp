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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false); // لإعادة التحميل بعد الحذف

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const categoriesPerPage = 6;

  // Fetch Categories
  const fetchCategories = useCallback(async (currentPage = page) => {
    try {
      setLoading(true);
      const response = await axios.get('https://app.balady-sa.pro/api/v1/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search,
          page: currentPage,
        },
      });

      const totalItems = response.data.results;
      const newTotalPages = Math.ceil(totalItems / categoriesPerPage);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
        return;
      }

      setCategories(response.data.data);
      setTotalPages(newTotalPages);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء تحميل التصنيفات.');
    } finally {
      setLoading(false);
    }
  }, [token, search, page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refresh]);

  // Handle Search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Handle Page Change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const confirm = window.confirm("هل أنت متأكد من حذف هذا التصنيف؟");
    if (!confirm) return;

    try {
      await axios.delete(`https://app.balady-sa.pro/api/v1/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // إعادة التحميل بعد الحذف
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">قائمة التصنيفات</Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => navigate("/dashboard/categories/create")}
        >
          تصنيف جديد
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="ابحث عن تصنيف"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          fullWidth
          sx={{ mr: 2 }}
        />
        <IconButton onClick={() => fetchCategories()}>
          <SearchIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="Categories Table">
            <TableHead>
              <TableRow>
                <TableCell>الصورة</TableCell>
                <TableCell>اسم التصنيف</TableCell>
                <TableCell>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>
                    <Avatar alt={category.name} src={category.image} sx={{ width: 40, height: 40 }} />
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/dashboard/categories/${category._id}/edit`)} // التوجيه لصفحة التعديل
                      sx={{ mr: 1 }}
                    >
                      تعديل
                    </Button>

                    <IconButton color="error" onClick={() => handleDelete(category._id)}>
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

export default Categories;
