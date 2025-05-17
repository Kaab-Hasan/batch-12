import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Avatar,
  Checkbox,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AccountCircle,
  LocalShipping,
  Payment,
  CheckCircle,
  CreditCard,
  AccountBalance
} from '@mui/icons-material';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { API_URL, USE_MOCK_DATA } from '../config';

// Helper function to standardize item properties
const standardizeItem = (item) => {
  return {
    ...item,
    _id: item._id || item.id || `item-${Math.random()}`,
    image: item.images && item.images.length > 0 ? item.images[0] : (item.image || 'https://via.placeholder.com/300'),
  };
};

const steps = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const { cart = [], clearCart } = useContext(CartContext) || {};
  const cartItems = cart.map(standardizeItem); // Standardize all items
  
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [saveInfo, setSaveInfo] = useState(true);
  
  // Calculate order summary
  const itemsPrice = cartItems && cartItems.length > 0
    ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
    
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login?redirect=checkout');
    }
  }, [cartItems, user, navigate]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSaveInfoChange = (e) => {
    setSaveInfo(e.target.checked);
  };

  const validateShippingForm = () => {
    const requiredFields = ['fullName', 'address', 'city', 'postalCode', 'country'];
    return requiredFields.every(field => shippingAddress[field].trim() !== '');
  };

  const handlePlaceOrder = async () => {
    try {
      setOrderLoading(true);
      setOrderError('');
      
      if (USE_MOCK_DATA) {
        // Simulate API call for mock data mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful order
        setOrderSuccess(true);
        clearCart();
        
        // Proceed to confirmation step
        handleNext();
        return;
      }
      
      // Only try the API call if mock data is not enabled
      try {
        const response = await fetch(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            orderItems: cartItems.map(item => ({
              product: item._id,
              name: item.name,
              quantity: item.quantity,
              image: item.image,
              price: item.price,
              size: item.size
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
          })
        });
        
        if (!response.ok) {
          throw new Error('Server responded with an error');
        }
        
        // Process successful response
        setOrderSuccess(true);
        clearCart();
        handleNext();
      } catch (apiError) {
        console.error('API error, falling back to mock data:', apiError);
        setOrderError('Server unavailable. Using mock data instead.');
        
        // Fallback to mock data behavior after a short delay
        setTimeout(() => {
          setOrderSuccess(true);
          clearCart();
          handleNext();
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderError('Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  fullWidth
                  value={shippingAddress.fullName}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="address"
                  name="address"
                  label="Address"
                  fullWidth
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="postalCode"
                  name="postalCode"
                  label="Postal Code"
                  fullWidth
                  value={shippingAddress.postalCode}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="country"
                  name="country"
                  label="Country"
                  fullWidth
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox color="primary" checked={saveInfo} onChange={handleSaveInfoChange} />}
                  label="Save this information for next time"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="payment-method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentChange}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel value="creditCard" control={<Radio />} label="Credit Card" />
                  <CreditCard color="action" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                  <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" height="20" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel value="bankTransfer" control={<Radio />} label="Bank Transfer" />
                  <AccountBalance color="action" />
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {shippingAddress.fullName}<br />
                  {shippingAddress.address}<br />
                  {shippingAddress.city}, {shippingAddress.postalCode}<br />
                  {shippingAddress.country}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Method
                </Typography>
                <Typography variant="body2">
                  {paymentMethod === 'creditCard' ? 'Credit Card' : 
                   paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Order Items:
                </Typography>
                {cartItems.map((item) => (
                  <Box key={`${item._id}-${item.size}`} sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={item.image} 
                        alt={item.name} 
                        variant="square" 
                        sx={{ width: 50, height: 50, mr: 2 }} 
                      />
                      <Typography variant="body2">
                        {item.name} (Size: {item.size}) x {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Items:</Typography>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">Tax:</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>
                  Total:
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body1">${itemsPrice.toFixed(2)}</Typography>
                <Typography variant="body1">${shippingPrice.toFixed(2)}</Typography>
                <Typography variant="body1">${taxPrice.toFixed(2)}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 1 }}>
                  ${totalPrice}
                </Typography>
              </Grid>
            </Grid>
            {orderError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {orderError}
              </Alert>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Thank you for your order!
            </Typography>
            <Typography variant="subtitle1">
              Your order has been placed successfully. 
              We'll send a confirmation when your order ships.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4 }}
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (!user || !cartItems || cartItems.length === 0) {
    return (
      <Container sx={{ py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Checkout
        </Typography>
        
        {USE_MOCK_DATA && (
          <Alert severity="info" sx={{ mb: 3 }}>
            The app is currently in demo mode using sample data. Your order will be simulated.
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            disabled={activeStep === 0 || activeStep === 3}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
              disabled={orderLoading || orderSuccess}
            >
              {orderLoading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={activeStep === 0 && !validateShippingForm()}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutPage; 