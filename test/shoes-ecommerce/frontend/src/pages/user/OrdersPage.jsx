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
  Chip,
  Button,
  CircularProgress,
  Alert,
  Pagination
} from '@mui/material';
import { format } from 'date-fns';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AuthContext } from '../../context/AuthContext';
import config from '../../config';

const OrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
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
        
        const mockOrders = Array.from({ length: 15 }, (_, i) => ({
          _id: `order-${i + 1}`,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          totalPrice: Math.floor(Math.random() * 300) + 50,
          isPaid: Math.random() > 0.3,
          paidAt: Math.random() > 0.3 ? new Date() : null,
          isDelivered: Math.random() > 0.5,
          deliveredAt: Math.random() > 0.5 ? new Date() : null,
          orderItems: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => ({
            name: `Product ${j + 1}`,
            qty: Math.floor(Math.random() * 3) + 1,
            image: 'https://via.placeholder.com/50',
            price: Math.floor(Math.random() * 100) + 20,
            product: `product-${j + 1}`,
          })),
        }));
        
        setOrders(mockOrders);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const displayedOrders = orders.slice(
    (page - 1) * ordersPerPage,
    page * ordersPerPage
  );

  const getOrderStatusLabel = (order) => {
    if (order.isDelivered) {
      return (
        <Chip 
          label="Delivered" 
          color="success" 
          size="small" 
        />
      );
    } else if (order.isPaid) {
      return (
        <Chip 
          label="Processing" 
          color="primary" 
          size="small" 
        />
      );
    } else {
      return (
        <Chip 
          label="Pending Payment" 
          color="warning" 
          size="small" 
        />
      );
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
        My Orders
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {orders.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            No Orders Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't placed any orders yet.
          </Typography>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/products"
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2, mb: 4 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.100' }}>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {order._id.substring(0, 10)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>{getOrderStatusLabel(order)}</TableCell>
                    <TableCell align="right">
                      <Button
                        component={RouterLink}
                        to={`/order/${order._id}`}
                        startIcon={<VisibilityIcon />}
                        size="small"
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default OrdersPage; 