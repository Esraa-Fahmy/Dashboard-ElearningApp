import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  TextField,
  IconButton,
  Button,
  Avatar,
  Pagination,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const usersPerPage = 10;

  const fetchUsers = useCallback(async (currentPage = page) => {
    try {
      setLoading(true);
      const response = await axios.get('https://app.balady-sa.pro/api/v1/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: search,
          page: currentPage,
          limit: usersPerPage,
        },
      });

      const totalItems = response.data.totalItems;
      const newTotalPages = Math.ceil(totalItems / usersPerPage);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
        return;
      }

      setUsers(response.data.data);
      setTotalPages(newTotalPages);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل البيانات.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [search, page, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`https://app.balady-sa.pro/api/v1/user/${userIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOpenDeleteDialog(false);
      setUserIdToDelete(null);
      fetchUsers();
    } catch (err) {
      setError('حدث خطأ أثناء حذف المستخدم.');
      console.error('Error deleting user:', err);
    }
  };

  const openDeleteConfirmation = (userId) => {
    setUserIdToDelete(userId);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteDialog(false);
    setUserIdToDelete(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>قائمة المستخدمين</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <Box sx={{ display: 'flex', flex: 1, mr: 2 }}>
    <TextField
      label="ابحث عن مستخدم"
      variant="outlined"
      value={search}
      onChange={handleSearch}
      fullWidth
    />
    <IconButton onClick={() => fetchUsers()}>
      <SearchIcon />
    </IconButton>
  </Box>

  <Button
    variant="contained"
    color="success"
    onClick={() => navigate('/dashboard/users/create')}
    sx={{ whiteSpace: 'nowrap', ml: 2 }}
  >
    إضافة مستخدم جديد
  </Button>
</Box>


      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="Users Table">
            <TableHead>
              <TableRow>
                <TableCell>الصورة</TableCell>
                <TableCell>الاسم</TableCell>
                <TableCell>البريد الإلكتروني</TableCell>
                <TableCell>الدور</TableCell>
                <TableCell>رقم الهاتف</TableCell>
                <TableCell>الإجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Avatar alt={user.userName} src={user.profileImg} sx={{ width: 40, height: 40 }} />
                  </TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => navigate(`/dashboard/users/${user._id}/edit`)}
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => openDeleteConfirmation(user._id)}
                    >
                      حذف
                    </Button>
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

      <Dialog open={openDeleteDialog} onClose={closeDeleteConfirmation}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          <Typography>هل أنت متأكد من أنك تريد حذف هذا المستخدم؟</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            إلغاء
          </Button>
          <Button onClick={handleDeleteUser} color="secondary">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;
