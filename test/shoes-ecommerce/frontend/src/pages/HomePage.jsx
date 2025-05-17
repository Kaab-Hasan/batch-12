import React from 'react';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  useTheme,
  Alert,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import ProductGrid from '../components/product/ProductGrid';
import { API_URL, USE_MOCK_DATA } from '../config';

// Sample hero image (replace with your own)
const HERO_IMAGE = 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80';

// Mock data for when API fails
const MOCK_PRODUCTS = [
  {
    _id: '1',
    name: 'Premium Running Shoes',
    brand: 'SportMax',
    price: 129.99,
    rating: 4.5,
    numReviews: 42,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
    isNewArrival: true,
    isBestSeller: true,
    sizes: [{ size: '42', stock: 10 }],
    colors: ['Red']
  },
  {
    _id: '2',
    name: 'Classic Leather Boots',
    brand: 'Urban Walker',
    price: 159.99,
    rating: 4.2,
    numReviews: 28,
    images: ['https://images.unsplash.com/photo-1608256246200-55ac5d285d2e'],
    isNewArrival: false,
    isBestSeller: true,
    sizes: [{ size: '42', stock: 10 }],
    colors: ['Brown']
  },
  {
    _id: '3',
    name: 'Casual Canvas Sneakers',
    brand: 'Street Style',
    price: 89.99,
    rating: 4.0,
    numReviews: 35,
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77'],
    isNewArrival: true,
    isBestSeller: false,
    sizes: [{ size: '42', stock: 10 }],
    colors: ['White']
  },
  {
    _id: '4',
    name: 'Hiking Trail Boots',
    brand: 'Mountain Trek',
    price: 199.99,
    rating: 4.8,
    numReviews: 18,
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa'],
    isNewArrival: false,
    isBestSeller: false,
    sizes: [{ size: '42', stock: 10 }],
    colors: ['Green']
  },
];

const HomePage = () => {
  const theme = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If USE_MOCK_DATA is true, use mock data immediately without API call
        // if (USE_MOCK_DATA) {
        //   setFeaturedProducts(MOCK_PRODUCTS);
        //   setNewArrivals(MOCK_PRODUCTS.filter(p => p.isNewArrival));
        //   setBestSellers(MOCK_PRODUCTS.filter(p => p.isBestSeller));
        //   setLoading(false);
        //   return;
        // }

        // Otherwise try to fetch from API
        // Fetch featured products
        // const featuredResponse = await fetch(`${API_URL}/api/products/featured`);
        // if (!featuredResponse.ok) {
        //   throw new Error('Failed to fetch featured products');
        // }
        // const featured = await featuredResponse.json();
        // setFeaturedProducts(featured);

        // Fetch new arrivals
        // const newArrivalsResponse = await fetch(`${API_URL}/api/products/new`);
        // if (!newArrivalsResponse.ok) {
        //   throw new Error('Failed to fetch new arrivals');
        // }
        // const newArrivalsData = await newArrivalsResponse.json();
        // setNewArrivals(newArrivalsData);

        // Fetch best sellers
      //   const bestSellersResponse = await fetch(`${API_URL}/api/products/bestsellers`);
      //   if (!bestSellersResponse.ok) {
      //     throw new Error('Failed to fetch best sellers');
      //   }
      //   const bestSellersData = await bestSellersResponse.json();
      //   setBestSellers(bestSellersData);
      // } catch (err) {
      //   console.error('Error fetching product data:', err);
      //   setError('Using sample product data until the API is available.');
        
        // Use mock data when API fails
        // setFeaturedProducts(MOCK_PRODUCTS);
        // setNewArrivals(MOCK_PRODUCTS.filter(p => p.isNewArrival));
        // setBestSellers(MOCK_PRODUCTS.filter(p => p.isBestSeller));
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: { xs: '50vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: { xs: '100%', md: '60%' }, color: 'white' }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              Step into Style and Comfort
            </Typography>
            <Typography
              variant="h5"
              sx={{ mb: 4, fontWeight: 300 }}
            >
              Discover the perfect shoes for every occasion with our premium collection
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/products"
              endIcon={<ArrowForward />}
              sx={{ fontWeight: 600, py: 1.5, px: 4 }}
            >
              Shop Now
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {error && (
          <Alert severity="info" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Categories Section */}
        <Box sx={{ my: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Shop by Category
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Find the perfect shoes for every style and occasion
          </Typography>

          <Grid container spacing={3}>
            {['Men', 'Women', 'Kids', 'Sport'].map((category) => (
              <Grid item xs={6} md={3} key={category}>
                <Paper
                  component={RouterLink}
                  to={`/products?category=${category.toLowerCase()}`}
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    height: 180,
                    justifyContent: 'center',
                    textDecoration: 'none',
                    color: 'text.primary',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Typography variant="h5" component="h3" gutterBottom>
                    {category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Explore {category.toLowerCase()} collection
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Featured Products */}
        <ProductGrid
          products={featuredProducts}
          loading={loading}
          error={error}
          title="Featured Products"
          noProductsMessage="No featured products available at the moment."
        />

        <Box sx={{ textAlign: 'center', mt: 2, mb: 6 }}>
          <Button
            variant="outlined"
            color="primary"
            component={RouterLink}
            to="/products"
            endIcon={<ArrowForward />}
          >
            View All Products
          </Button>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* New Arrivals */}
        <ProductGrid
          products={newArrivals}
          loading={loading}
          error={error}
          title="New Arrivals"
          noProductsMessage="No new arrivals available at the moment."
        />

        <Divider sx={{ my: 6 }} />

        {/* Best Sellers */}
        <ProductGrid
          products={bestSellers}
          loading={loading}
          error={error}
          title="Best Sellers"
          noProductsMessage="No best sellers available at the moment."
        />

        {/* Call to Action */}
        <Box
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            py: 6,
            px: 4,
            my: 8,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Join Our Community
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Subscribe to our newsletter for exclusive offers, new arrivals, and fashion tips straight to your inbox.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ fontWeight: 500 }}
          >
            Subscribe Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage; 