import React, { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
  IconButton,
  Paper,
  TextField,
  Link,
  Card,
  CardContent,
  Alert,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { USE_MOCK_DATA } from '../config';

// Helper function to standardize item properties
const standardizeItem = (item) => {
  return {
    ...item,
    _id: item._id || item.id || `item-${Math.random()}`,
    image: item.images && item.images.length > 0 ? item.images[0] : (item.image || 'https://via.placeholder.com/300'),
  };
};

const CartPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { cart = [], addToCart, removeFromCart, clearCart, updateQuantity } = useContext(CartContext) || {};
  const cartItems = cart.map(standardizeItem); // Standardize all items
  const { user } = useContext(AuthContext) || {};
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Calculate cart totals
  const itemsPrice = cartItems && cartItems.length > 0
    ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) {
      // Use updateQuantity instead of addToCart to properly set the quantity
      updateQuantity(item._id, item.size, item.color, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    if (removeFromCart) {
      removeFromCart(itemId);
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    // Here you would typically validate the coupon with your backend
    if (couponCode.toUpperCase() === 'SAVE10') {
      setCouponSuccess('Coupon applied successfully! 10% discount added.');
    } else {
      setCouponError('Invalid or expired coupon code');
    }
  };

  const handleCheckout = () => {
    // If there's an error with the backend, warn the user we're using mock data
    if (USE_MOCK_DATA) {
      // Optionally display a message before proceeding
      // You could add a state for this warning and display it in the UI
      console.log('Using mock data for checkout process');
    }
    
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>Your Cart is Empty</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/products"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Shopping Cart
      </Typography>

      {USE_MOCK_DATA && (
        <Alert severity="info" sx={{ mb: 3 }}>
          The app is currently using sample data. Backend connection is unavailable.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Header */}
            {!isMobile && (
              <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Product</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Price</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Quantity</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Subtotal</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Divider />

            {/* Cart Items */}
            {cartItems.map((item) => (
              <Box key={`${item._id}-${item.size}`}>
                <Box sx={{ p: 2 }}>
                  {isMobile ? (
                    // Mobile layout
                    <Box>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{ width: 80, height: 80, objectFit: 'contain', mr: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" component={RouterLink} to={`/product/${item._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Size: {item.size}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                            ${item.price.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) handleQuantityChange(item, val);
                            }}
                            inputProps={{ min: 1, max: 10, style: { textAlign: 'center' } }}
                            sx={{ width: 40, mx: 1 }}
                            size="small"
                          />
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <IconButton 
                          color="error" 
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  ) : (
                    // Desktop layout
                    <Grid container alignItems="center">
                      <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{ width: 80, height: 80, objectFit: 'contain', mr: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle1" component={RouterLink} to={`/product/${item._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Size: {item.size}
                          </Typography>
                          <IconButton 
                            color="error" 
                            size="small" 
                            onClick={() => handleRemoveItem(item._id)}
                            sx={{ ml: -1, mt: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                            <Typography variant="caption" sx={{ ml: 0.5 }}>Remove</Typography>
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={2} sx={{ textAlign: 'center' }}>
                        <Typography>${item.price.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) handleQuantityChange(item, val);
                            }}
                            inputProps={{ min: 1, max: 10, style: { textAlign: 'center' } }}
                            sx={{ width: 40, mx: 1 }}
                            size="small"
                          />
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={2} sx={{ textAlign: 'right' }}>
                        <Typography fontWeight="bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </Box>
                <Divider />
              </Box>
            ))}

            {/* Cart Actions */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/products"
                startIcon={<ArrowBackIcon />}
              >
                Continue Shopping
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                onClick={() => clearCart()}
              >
                Clear Cart
              </Button>
            </Box>
          </Paper>

          {/* Additional Information */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Shipping</Typography>
                </Box>
                <Typography variant="body2">
                  Free shipping on orders over $100
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SecurityIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Secure Shopping</Typography>
                </Box>
                <Typography variant="body2">
                  Your payment information is processed securely
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} lg={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Order Summary
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal ({cartItems && cartItems.length > 0 ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0} items)</Typography>
                  <Typography variant="body1">${itemsPrice.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Shipping</Typography>
                  <Typography variant="body1">${shippingPrice.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Tax</Typography>
                  <Typography variant="body1">${taxPrice}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">${totalPrice}</Typography>
                </Box>
              </Box>

              {/* Coupon Code */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Promo Code
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </Button>
                </Box>
                
                {couponError && (
                  <Alert severity="error" sx={{ mt: 1 }} onClose={() => setCouponError('')}>
                    {couponError}
                  </Alert>
                )}
                
                {couponSuccess && (
                  <Alert severity="success" sx={{ mt: 1 }} onClose={() => setCouponSuccess('')}>
                    {couponSuccess}
                  </Alert>
                )}
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </Button>
              
              {!user && (
                <Typography variant="body2" align="center" color="text.secondary">
                  <Link component={RouterLink} to="/login?redirect=checkout">
                    Sign in
                  </Link> to checkout faster
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage; 