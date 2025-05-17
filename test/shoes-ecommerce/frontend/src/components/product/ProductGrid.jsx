import React from 'react';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error, title, noProductsMessage }) => {
  // Show loading spinner when data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error message if there's an error
  if (error && typeof error === 'string') {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  // Show message if no products
  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          {noProductsMessage || 'No products found.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      {title && (
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          {title}
        </Typography>
      )}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product?._id || `product-${Math.random()}`} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid; 