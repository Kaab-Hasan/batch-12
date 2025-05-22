import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Divider,
  Snackbar,
  Alert,
  Card,
  CardContent,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';

const ContactPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message should be at least 10 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real application, you would submit the form data to your backend
      console.log('Form submitted:', formData);
      
      // Show success message
      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Your message has been sent successfully! We will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } else {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Please fix the errors in the form before submitting.'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const contactInfo = [
    {
      icon: <LocationOnIcon color="primary" fontSize="large" />,
      title: 'Address',
      content: [
        '123 Shoe Street',
        'Footwear District',
        'New York, NY 10001'
      ]
    },
    {
      icon: <PhoneIcon color="primary" fontSize="large" />,
      title: 'Phone',
      content: [
        '+1 (555) 123-4567',
        '+1 (555) 987-6543'
      ]
    },
    {
      icon: <EmailIcon color="primary" fontSize="large" />,
      title: 'Email',
      content: [
        'contact@shoestop.com',
        'support@shoestop.com'
      ]
    },
    {
      icon: <AccessTimeIcon color="primary" fontSize="large" />,
      title: 'Working Hours',
      content: [
        'Monday - Friday: 9AM - 6PM',
        'Saturday: 10AM - 4PM',
        'Sunday: Closed'
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Have questions or feedback? We'd love to hear from you. Fill out the form below or reach out to us directly.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Send Us a Message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!formErrors.subject}
                    helperText={formErrors.subject}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!formErrors.message}
                    helperText={formErrors.message}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{ py: 1.5, px: 4 }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={5}>
          <Grid container spacing={3} direction="column">
            {contactInfo.map((info) => (
              <Grid item key={`contact-${info.title}`}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {info.icon}
                      <Typography variant="h6" sx={{ ml: 2, fontWeight: 'medium' }}>
                        {info.title}
                      </Typography>
                    </Box>
                    
                    {info.content.map((line, lineIndex) => (
                      <Typography 
                        key={`${info.title}-line-${lineIndex}`} 
                        variant="body1" 
                        sx={{ ml: isMobile ? 0 : 6 }}
                      >
                        {line}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Map Section */}
      <Box sx={{ mt: 8 }}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', p: 2 }}>
            Our Location
          </Typography>
          <Box
            component="iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1619653235170!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="ShoeStop location"
          />
        </Paper>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                How long does shipping take?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Standard shipping takes 3-5 business days within the continental US. 
                International shipping typically takes 7-14 business days depending on the destination.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                What is your return policy?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We offer a 30-day return policy for unworn items in their original packaging. 
                Please visit our Returns page for more details on the process.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Do you offer international shipping?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Yes, we ship to over 50 countries worldwide. Shipping rates and delivery times vary by location.
                You can check shipping costs during checkout.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                How do I track my order?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Once your order ships, you'll receive a confirmation email with a tracking number.
                You can also track your order by logging into your account and visiting the Order History section.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactPage; 