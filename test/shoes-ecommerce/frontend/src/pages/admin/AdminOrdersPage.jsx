import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
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
  DialogTitle,
  Grid,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as ShippingIcon,
  ViewList
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

const AdminOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const { id: orderId } = useParams(); // Get order ID from URL params
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
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
    // If orderId is provided, fetch specific order details
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          setLoading(true);
          setError('');
          
          const response = await fetch(`${config.API_URL}/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Failed to fetch order details');
          
          setOrderDetails(data);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching order details:', err);
          setError(err.message || 'Failed to load order details');
          setLoading(false);
        }
      };

      fetchOrderDetails();
    } else {
      // Fetch all orders if no orderId
      const fetchOrders = async () => {
        try {
          setLoading(true);
          setError('');
          
          const response = await fetch(`${config.API_URL}/orders`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
          
          // Ensure we're working with an array
          const ordersArray = Array.isArray(data) ? data : 
                             (data.orders ? data.orders : []);
          
          setOrders(ordersArray);
          setFilteredOrders(ordersArray);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching orders:', err);
          setError(err.message || 'Failed to load orders. Using sample data temporarily.');
          
          // Fallback to mock data if API fails
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
        }
      };

      fetchOrders();
    }
  }, [user, orderId]);

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
      let requestBody = undefined;
      
      if (actionType === 'markPaid') {
        endpoint = `${config.API_URL}/orders/${selectedOrder._id}/status`;
        actionName = 'marked as paid';
        requestBody = { status: 'processing' };
      } else if (actionType === 'markDelivered') {
        endpoint = `${config.API_URL}/orders/${selectedOrder._id}/status`;
        actionName = 'marked as delivered';
        requestBody = { status: 'delivered' };
      } else if (actionType === 'delete') {
        endpoint = `${config.API_URL}/orders/${selectedOrder._id}`;
        method = 'DELETE';
        actionName = 'deleted';
      }
      
      console.log(`Sending request to ${endpoint} with method ${method} and body:`, requestBody);
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: requestBody ? JSON.stringify(requestBody) : undefined
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${actionType} order`);
      }
      
      // For non-delete actions, get the updated order data
      let updatedOrder;
      if (actionType !== 'delete') {
        updatedOrder = await response.json();
        console.log('Received updated order:', updatedOrder);
      }
      
      // Update orders list after successful action
      if (actionType === 'delete') {
        setOrders(orders.filter(order => order._id !== selectedOrder._id));
      } else {
        // Use the returned order data from the API
        setOrders(orders.map(order => 
          order._id === selectedOrder._id ? updatedOrder : order
        ));
        
        // If we're viewing order details, update that too
        if (orderId) {
          setOrderDetails(updatedOrder);
        }
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
      console.error('Error updating order:', err);
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
    // Use the status field directly
    switch(order.status) {
      case 'delivered':
        return <Chip label="Delivered" color="success" size="small" />;
      case 'processing':
        return <Chip label="Processing" color="primary" size="small" />;
      case 'shipped':
        return <Chip label="Shipped" color="info" size="small" />;
      case 'cancelled':
        return <Chip label="Cancelled" color="error" size="small" />;
      case 'pending':
      default:
        return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  // Order Detail Rendering
  const renderOrderDetails = () => {
    if (!orderDetails) return null;
    
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Order Details: #{orderDetails._id}
          </Typography>
          <Button 
            component={RouterLink}
            to="/admin/orders"
            startIcon={<ViewList />}
            variant="outlined"
          >
            Back to Orders
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Items
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetails.orderItems?.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            width="50" 
                            height="50" 
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">${item.price?.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.qty}</TableCell>
                        <TableCell align="right">${(item.price * item.qty)?.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Information
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {orderDetails.user?.name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {orderDetails.user?.email}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {orderDetails.shippingAddress?.address}, 
                {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.postalCode}, 
                {orderDetails.shippingAddress?.country}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  <strong>Delivery Status:</strong>
                </Typography>
                {orderDetails.isDelivered ? (
                  <Chip 
                    label={`Delivered on ${formatDate(orderDetails.deliveredAt)}`} 
                    color="success" 
                    variant="outlined" 
                  />
                ) : (
                  <Chip 
                    label="Not Delivered" 
                    color="error" 
                    variant="outlined" 
                  />
                )}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Items</Typography>
                <Typography variant="body1">${orderDetails.itemsPrice?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">${orderDetails.shippingPrice?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tax</Typography>
                <Typography variant="body1">${orderDetails.taxPrice?.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${orderDetails.totalPrice?.toFixed(2)}</Typography>
              </Box>
            </Paper>
            
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Payment Information
              </Typography>
              <Typography variant="body1">
                <strong>Method:</strong> {orderDetails.paymentMethod}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  <strong>Payment Status:</strong>
                </Typography>
                {orderDetails.isPaid ? (
                  <Chip 
                    label={`Paid on ${formatDate(orderDetails.paidAt)}`} 
                    color="success" 
                    variant="outlined" 
                  />
                ) : (
                  <Chip 
                    label="Not Paid" 
                    color="error" 
                    variant="outlined" 
                  />
                )}
              </Box>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              
              <Grid container spacing={2}>
                {orderDetails.status === 'pending' && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleActionClick(orderDetails, 'markPaid')}
                    >
                      Mark as Paid
                    </Button>
                  </Grid>
                )}
                
                {orderDetails.status === 'processing' && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={() => handleActionClick(orderDetails, 'markDelivered')}
                    >
                      Mark as Delivered
                    </Button>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => handleActionClick(orderDetails, 'delete')}
                  >
                    Delete Order
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }
  
  // If orderId is provided, render order details page
  if (orderId) {
    return renderOrderDetails();
  }

  // Otherwise render orders list page
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
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
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
                      {order.isPaid || order.status !== 'pending' ? (
                        <Box>
                          <Typography variant="body2" color="success.main">
                            Paid
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(order.paidAt)}
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
                      
                      {order.status === 'pending' && (
                        <IconButton
                          size="small"
                          sx={{ mr: 1 }}
                          color="success"
                          onClick={() => handleActionClick(order, 'markPaid')}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      
                      {order.status === 'processing' && (
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