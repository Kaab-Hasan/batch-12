import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  SupervisorAccount as AdminIcon
} from '@mui/icons-material';
import { format, isValid, parseISO } from 'date-fns';
import { AuthContext } from '../../context/AuthContext';
import config from '../../config';

// Helper function to safely format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    // Try to parse the date string
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isValid(date)) {
      return format(date, 'MMM d, yyyy');
    }
    
    return 'Invalid date';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const AdminUsersPage = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    isAdmin: false
  });

  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`${config.API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
        
        // Ensure we're working with an array
        const usersArray = Array.isArray(data) ? data : 
                          (data.users ? data.users : []);
        
        setUsers(usersArray);
        setFilteredUsers(usersArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to load users. Using sample data temporarily.');
        
        // Fallback to mock data if API fails
        const mockUsers = Array.from({ length: 25 }, (_, i) => ({
          _id: `user-${i + 1}`,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          isAdmin: i < 3, // First 3 users are admins
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000)
        }));
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setPage(1);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      isAdmin: Boolean(user.isAdmin)
    });
    setEditDialogOpen(true);
    setActionError('');
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
    setActionError('');
  };

  const handleEditChange = (e) => {
    const { name, value, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === 'isAdmin' ? checked : value
    });
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      setActionError('');
      setActionSuccess('');
      
      const response = await fetch(`${config.API_URL}/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editFormData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      
      const responseData = await response.json();
      // Make sure we get a valid user object back
      const updatedUser = responseData.user || responseData;
      
      const updatedUsers = users.map(u => 
        u._id === selectedUser._id 
          ? updatedUser
          : u
      );
      
      setUsers(updatedUsers);
      setActionSuccess(`User ${editFormData.name} updated successfully`);
      setActionLoading(false);
      setEditDialogOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess('');
      }, 3000);
      
    } catch (err) {
      setActionError(err.message || 'Failed to update user');
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      setActionError('');
      setActionSuccess('');
      
      const response = await fetch(`${config.API_URL}/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      
      const updatedUsers = users.filter(u => u._id !== selectedUser._id);
      
      setUsers(updatedUsers);
      setActionSuccess(`User ${selectedUser.name} deleted successfully`);
      setActionLoading(false);
      setDeleteDialogOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess('');
      }, 3000);
      
    } catch (err) {
      setActionError(err.message || 'Failed to delete user');
      setActionLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedUser(null);
    setActionError('');
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        User Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {actionSuccess}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4, p: 2, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <Chip 
                          icon={<AdminIcon />}
                          label="Admin" 
                          color="primary" 
                          size="small" 
                        />
                      ) : (
                        <Chip 
                          icon={<PersonIcon />}
                          label="Customer" 
                          variant="outlined" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(user)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(user)}
                        size="small"
                        disabled={user._id === 'user-1'} // Don't allow deleting the first user (for demo)
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No users found
                    </Typography>
                    {searchTerm && (
                      <Button
                        variant="text"
                        onClick={() => setSearchTerm('')}
                        sx={{ mt: 1 }}
                      >
                        Clear search
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Paper>
      
      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={editFormData.name}
              onChange={handleEditChange}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={editFormData.email}
              onChange={handleEditChange}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={editFormData.isAdmin}
                  onChange={handleEditChange}
                  name="isAdmin"
                  color="primary"
                />
              }
              label="Admin Privileges"
              sx={{ mt: 2 }}
            />
          </Box>
          
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            color="primary" 
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={20} />}
          >
            {actionLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
          </DialogContentText>
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={20} />}
          >
            {actionLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsersPage; 