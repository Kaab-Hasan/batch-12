import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { format } from 'date-fns';
import { AuthContext } from '../../context/AuthContext';
import config from '../../config';

const steps = ['Order Placed', 'Payment Confirmed', 'Processing', 'Shipped', 'Delivered'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // In a real application, you would call your API
        // const response = await fetch(`${config.apiUrl}/api/orders/${id}`, {
        //   headers: {
        //     Authorization: `Bearer ${user.token}`,
        //   },
        // });
        
        // const data = await response.json();
        // if (!response.ok) throw new Error(data.message || 'Failed to fetch order details');
        
        // For demo purposes - mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockOrder = {
          _id: id,
          user: {
            name: user?.name || 'John Doe',
            email: user?.email || 'john.doe@example.com'
          },
          orderItems: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, i) => ({
            _id: `item-${i}`,
            name: `Nike Air Max ${i + 1}`,
            qty: Math.floor(Math.random() * 2) + 1,
            size: Math.floor(Math.random() * 5) + 7,
            image: 'https://via.placeholder.com/100',
            price: Math.floor(Math.random() * 50) + 70,
            product: `product-${i}`
          })),
          shippingAddress: {
            address: '123 Example St',
            city: 'New York',
            postalCode: '10001',
            country: 'USA',
            phoneNumber: '+1 555-123-4567'
          },
          paymentMethod: Math.random() > 0.5 ? 'creditCard' : 'paypal',
          paymentResult: Math.random() > 0.3 ? {
            id: `pay-${Math.random().toString(36).substring(2, 10)}`,
            status: 'COMPLETED',
            email_address: user?.email || 'john.doe@example.com',
            update_time: new Date().toISOString()
          } : null,
          itemsPrice: 0, // Calculated below
          taxPrice: 0, // Calculated below
          shippingPrice: 0, // Calculated below
          totalPrice: 0, // Calculated below
          isPaid: Math.random() > 0.3,
          paidAt: Math.random() > 0.3 ? new Date().toISOString() : null,
          isDelivered: Math.random() > 0.5,
          deliveredAt: Math.random() > 0.5 ? new Date().toISOString() : null,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
        };
        
        // Calculate prices
        mockOrder.itemsPrice = mockOrder.orderItems.reduce(
          (acc, item) => acc + item.price * item.qty,
          0
        );
        mockOrder.taxPrice = Number((0.15 * mockOrder.itemsPrice).toFixed(2));
        mockOrder.shippingPrice = mockOrder.itemsPrice > 100 ? 0 : 10;
        mockOrder.totalPrice = (
          mockOrder.itemsPrice +
          mockOrder.taxPrice +
          mockOrder.shippingPrice
        ).toFixed(2);
        
        setOrder(mockOrder);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, user]);

  const getActiveStep = () => {
    if (!order) return 0;
    
    if (order.isDelivered) return 4;
    if (order.isShipped) return 3;
    if (order.isPaid) return 2;
    if (order._id) return 0;
    
    return 0;
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          Order not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
        <Typography variant="h4" component="h1">
          Order Details
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Order #{order._id.substring(0, 8)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                </Typography>
              </Box>
              
              <Box>
                {order.isPaid ? (
                  <Chip 
                    label="Paid" 
                    color="success" 
                    sx={{ mr: 1 }}
                  />
                ) : (
                  <Chip 
                    label="Not Paid" 
                    color="error" 
                    sx={{ mr: 1 }}
                  />
                )}
                
                {order.isDelivered ? (
                  <Chip 
                    label="Delivered" 
                    color="success" 
                  />
                ) : (
                  <Chip 
                    label="Not Delivered" 
                    color={order.isPaid ? "primary" : "default"} 
                  />
                )}
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Stepper 
              activeStep={getActiveStep()} 
              alternativeLabel 
              sx={{ mb: 4 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: { xs: 4, md: 0 } }}>
            <Box sx={{ bgcolor: 'grey.100', p: 2 }}>
              <Typography variant="h6">
                Order Items
              </Typography>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{ width: 50, height: 50, objectFit: 'contain', mr: 2 }}
                          />
                          <Link
                            component={RouterLink}
                            to={`/product/${item.product}`}
                            underline="hover"
                            color="inherit"
                          >
                            {item.name}
                          </Link>
                        </Box>
                      </TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">{item.qty}</TableCell>
                      <TableCell align="right">${(item.price * item.qty).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Order Info */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                  <Typography variant="body1">Items</Typography>
                  <Typography variant="body1">${order.itemsPrice.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body1">${order.shippingPrice.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                  <Typography variant="body1">Tax</Typography>
                  <Typography variant="body1">${order.taxPrice.toFixed(2)}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">${order.totalPrice}</Typography>
                </Box>
                
                {!order.isPaid && (
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled // In a real app, this would trigger payment
                  >
                    Pay Now
                  </Button>
                )}
                
                {order.isPaid && !order.isDelivered && (
                  <Box sx={{ mt: 2, bgcolor: 'info.light', color: 'info.contrastText', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2">
                      Your order is being processed. We'll notify you once it ships.
                    </Typography>
                  </Box>
                )}
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ReceiptIcon />}
                  sx={{ mt: 2 }}
                >
                  Download Invoice
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Shipping Information
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {order.shippingAddress.address}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {order.shippingAddress.country}
                </Typography>
                <Typography variant="body1">
                  Phone: {order.shippingAddress.phoneNumber}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Information
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Method:</strong> {
                    order.paymentMethod === 'creditCard' 
                      ? 'Credit Card' 
                      : order.paymentMethod === 'paypal' 
                        ? 'PayPal' 
                        : 'Cash on Delivery'
                  }
                </Typography>
                
                {order.isPaid ? (
                  <>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Status:</strong> Paid
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Date:</strong> {format(new Date(order.paidAt), 'MMMM d, yyyy')}
                    </Typography>
                    {order.paymentResult && (
                      <Typography variant="body1">
                        <strong>Transaction ID:</strong> {order.paymentResult.id}
                      </Typography>
                    )}
                  </>
                ) : (
                  <Typography variant="body1">
                    <strong>Status:</strong> Not Paid
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailPage; 