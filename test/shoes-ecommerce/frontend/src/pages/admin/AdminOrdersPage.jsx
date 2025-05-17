import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  MenuItem,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { AuthContext } from '../../context/AuthContext';
import config from '../../config';

const AdminOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        
        // In a real application, you would call your API
        // const response = await fetch(`${config.apiUrl}/api/orders`, {
        //   headers: {
        //     Authorization: `Bearer ${user.token}`,
        //   },
        // });
        
        // const data = await response.json();
        // if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
        
        // For demo purposes - mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockOrders = Array.from({ length: 25 }, (_, i) => ({
          _id: `order-${i + 1}`,
          user: {
            _id: `user-${Math.floor(Math.random() * 20) + 1}`,
            name: `Customer ${Math.floor(Math.random() * 20) + 1}`,
            email: `customer${Math.floor(Math.random() * 20) + 1}@example.com`
          },
          orderItems: Array.from(
            { length: Math.floor(Math.random() * 4) + 1 }, 
            (_, j) => ({
              _id: `item-${j}`,
              name: `Nike Air Max ${j + 1}`,
              qty: Math.floor(Math.random() * 2) + 1,
              image: 'https://via.placeholder.com/50',
              price: Math.floor(Math.random() * 50) + 70,
              product: `product-${j}`
            })
          ),
          shippingAddress: {
            address: '123 Example St',
            city: 'New York',
            postalCode: '10001',
            country: 'USA'
          },
          paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'PayPal',
          totalPrice: Math.floor(Math.random() * 300) + 50,
          isPaid: Math.random() > 0.3,
          paidAt: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000) : null,
          isDelivered: Math.random() > 0.6,
          deliveredAt: Math.random() > 0.6 ? new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000) : null,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        }));
        
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'paid') {
        result = result.filter(order => order.isPaid && !order.isDelivered);
      } else if (statusFilter === 'unpaid') {
        result = result.filter(order => !order.isPaid);
      } else if (statusFilter === 'delivered') {
        result = result.filter(order => order.isDelivered);
      }
    }
    
    setFilteredOrders(result);
    setPage(1);
  }, [searchTerm, statusFilter, orders]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleActionClick = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
    setActionDialogOpen(true);
    setActionError('');
    setActionSuccess('');
  };

  const handleActionCancel = () => {
    setActionDialogOpen(false);
    setSelectedOrder(null);
    setActionType('');
  };

  const handleActionConfirm = async () => {
    if (!selectedOrder) return;
    
    try {
      setActionLoading(true);
      setActionError('');
      
      let endpoint = '';
      let method = 'PUT';
      let actionName = '';
      
      // In a real application, you would call your API
      if (actionType === 'markPaid') {
        endpoint = `${config.API_URL}/api/orders/${selectedOrder._id}/pay`;
        actionName = 'marked as paid';
      } else if (actionType === 'markDelivered') {
        endpoint = `${config.API_URL}/api/orders/${selectedOrder._id}/deliver`;
        actionName = 'marked as delivered';
      } else if (actionType === 'delete') {
        endpoint = `${config.API_URL}/api/orders/${selectedOrder._id}`;
        method = 'DELETE';
        actionName = 'deleted';
      }
      
      // const response = await fetch(endpoint, {
      //   method,
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || `Failed to ${actionType} order`);
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status in state
      const updatedOrders = orders.map(order => {
        if (order._id === selectedOrder._id) {
          if (actionType === 'markPaid') {
            return { ...order, isPaid: true, paidAt: new Date() };
          } else if (actionType === 'markDelivered') {
            return { ...order, isDelivered: true, deliveredAt: new Date() };
          }
        }
        return order;
      });
      
      // Remove order if deleted
      if (actionType === 'delete') {
        setOrders(orders.filter(order => order._id !== selectedOrder._id));
      } else {
        setOrders(updatedOrders);
      }
      
      setActionSuccess(`Order successfully ${actionName}`);
      setActionLoading(false);
      setActionDialogOpen(false);
      setSelectedOrder(null);
      setActionType('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setActionSuccess('');
      }, 3000);
      
    } catch (err) {
      setActionError(err.message || `Failed to ${actionType} order`);
      setActionLoading(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const displayedOrders = filteredOrders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  const getOrderStatusChip = (order) => {
    if (order.isDelivered) {
      return <Chip label="Delivered" color="success" size="small" />;
    } else if (order.isPaid) {
      return <Chip label="Processing" color="primary" size="small" />;
    } else {
      return <Chip label="Pending Payment" color="warning" size="small" />;
    }
  };

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
        Manage Orders
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 3 }}>
          <TextField
            sx={{ flexGrow: 1 }}
            variant="outlined"
            placeholder="Search orders by ID, customer name, or email..."
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
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Order Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Order Status"
            >
              <MenuItem value="all">All Orders</MenuItem>
              <MenuItem value="unpaid">Pending Payment</MenuItem>
              <MenuItem value="paid">Processing</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedOrders.length > 0 ? (
                displayedOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {order.user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.user.email}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {order.isPaid ? (
                        <Box>
                          <Typography variant="body2" color="success.main">
                            Paid
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(order.paidAt), 'MMM d, yyyy')}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="error.main">
                          Not Paid
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {getOrderStatusChip(order)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        component={RouterLink}
                        to={`/admin/order/${order._id}`}
                        size="small"
                        sx={{ mr: 1 }}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      
                      {!order.isPaid && (
                        <IconButton
                          size="small"
                          sx={{ mr: 1 }}
                          color="success"
                          onClick={() => handleActionClick(order, 'markPaid')}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      
                      {order.isPaid && !order.isDelivered && (
                        <IconButton
                          size="small"
                          sx={{ mr: 1 }}
                          color="info"
                          onClick={() => handleActionClick(order, 'markDelivered')}
                        >
                          <ShippingIcon />
                        </IconButton>
                      )}
                      
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleActionClick(order, 'delete')}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      No orders found
                    </Typography>
                    {(searchTerm || statusFilter !== 'all') && (
                      <Button
                        variant="text"
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                        }}
                        sx={{ mt: 1 }}
                      >
                        Clear filters
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
      
      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={handleActionCancel}
      >
        <DialogTitle>
          {actionType === 'markPaid' 
            ? 'Mark Order as Paid' 
            : actionType === 'markDelivered'
              ? 'Mark Order as Delivered'
              : 'Delete Order'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === 'markPaid' 
              ? `Are you sure you want to mark order ${selectedOrder?._id} as paid?` 
              : actionType === 'markDelivered'
                ? `Are you sure you want to mark order ${selectedOrder?._id} as delivered?`
                : `Are you sure you want to delete order ${selectedOrder?._id}? This action cannot be undone.`}
          </DialogContentText>
          {actionError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {actionError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActionCancel} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleActionConfirm} 
            color={actionType === 'delete' ? 'error' : 'primary'} 
            disabled={actionLoading}
            startIcon={actionLoading && <CircularProgress size={20} />}
          >
            {actionLoading 
              ? 'Processing...' 
              : actionType === 'markPaid'
                ? 'Mark as Paid'
                : actionType === 'markDelivered'
                  ? 'Mark as Delivered'
                  : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminOrdersPage; 