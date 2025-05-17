import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  Stack,
  TextField,
  Button,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { APP_NAME, SUPPORT_EMAIL, SUPPORT_PHONE, SOCIAL_MEDIA } from '../../config';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom fontWeight="bold">
              {APP_NAME}
            </Typography>
            <Typography variant="body2" paragraph>
              Premium footwear for every occasion. Quality, comfort, and style at affordable prices.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                aria-label="Facebook"
                href={SOCIAL_MEDIA.facebook}
                target="_blank"
                rel="noopener"
                sx={{ color: 'white' }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                href={SOCIAL_MEDIA.twitter}
                target="_blank"
                rel="noopener"
                sx={{ color: 'white' }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                href={SOCIAL_MEDIA.instagram}
                target="_blank"
                rel="noopener"
                sx={{ color: 'white' }}
              >
                <Instagram />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products"
                  color="inherit"
                  underline="hover"
                >
                  Shop
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/about"
                  color="inherit"
                  underline="hover"
                >
                  About Us
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/contact"
                  color="inherit"
                  underline="hover"
                >
                  Contact
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/profile"
                  color="inherit"
                  underline="hover"
                >
                  My Account
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/orders"
                  color="inherit"
                  underline="hover"
                >
                  My Orders
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom fontWeight="bold">
              Categories
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products?category=men"
                  color="inherit"
                  underline="hover"
                >
                  Men's Shoes
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products?category=women"
                  color="inherit"
                  underline="hover"
                >
                  Women's Shoes
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products?category=kids"
                  color="inherit"
                  underline="hover"
                >
                  Kids' Shoes
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products?category=sports"
                  color="inherit"
                  underline="hover"
                >
                  Sports
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link
                  component={RouterLink}
                  to="/products?category=casual"
                  color="inherit"
                  underline="hover"
                >
                  Casual
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Contact & Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" component="div" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <LocationOn sx={{ mr: 1 }} />
                <Typography variant="body2">
                  123 Shoe Street, Fashion District, City
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Email sx={{ mr: 1 }} />
                <Link href={`mailto:${SUPPORT_EMAIL}`} color="inherit" underline="hover">
                  {SUPPORT_EMAIL}
                </Link>
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Phone sx={{ mr: 1 }} />
                <Link href={`tel:${SUPPORT_PHONE}`} color="inherit" underline="hover">
                  {SUPPORT_PHONE}
                </Link>
              </Box>
            </Box>
            <Typography variant="subtitle2" gutterBottom>
              Subscribe to our newsletter
            </Typography>
            <Box component="form" sx={{ display: 'flex' }}>
              <TextField
                size="small"
                placeholder="Your email"
                variant="outlined"
                sx={{
                  mr: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  input: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                  },
                }}
              />
              <Button variant="contained" color="secondary">
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="white">
            © {year} {APP_NAME}. All rights reserved.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Link color="inherit" underline="hover" sx={{ mx: 1 }}>
              Privacy Policy
            </Link>
            |
            <Link color="inherit" underline="hover" sx={{ mx: 1 }}>
              Terms of Service
            </Link>
            |
            <Link color="inherit" underline="hover" sx={{ mx: 1 }}>
              Shipping & Returns
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 