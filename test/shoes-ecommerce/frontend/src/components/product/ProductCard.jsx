import React from 'react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Rating,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [favorite, setFavorite] = useState(false);

  // Default size and color for quick add to cart
  const defaultSize = product?.sizes && product.sizes.length > 0 
    ? (typeof product.sizes[0] === 'object' ? product.sizes[0].size : product.sizes[0]) 
    : '';
  const defaultColor = product?.colors && product.colors.length > 0 ? product.colors[0] : '';

  const handleAddToCart = () => {
    addToCart(product, 1, defaultSize, defaultColor);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };

  // Add a placeholder image if product images are undefined or empty
  const productImage = product?.images && product.images.length > 0 
    ? product.images[0] 
    : (product?.image || 'https://via.placeholder.com/300');

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Favorite button */}
      <IconButton
        aria-label="add to favorites"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
        onClick={toggleFavorite}
      >
        {favorite ? <Favorite color="secondary" /> : <FavoriteBorder />}
      </IconButton>

      {/* Product badges */}
      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
        {product?.isNewArrival && (
          <Chip
            label="New"
            color="primary"
            size="small"
            sx={{ mb: 0.5, fontWeight: 'bold' }}
          />
        )}
        {product?.isBestSeller && (
          <Chip
            label="Best Seller"
            color="secondary"
            size="small"
            sx={{ mb: 0.5, fontWeight: 'bold' }}
          />
        )}
        {product?.discount > 0 && (
          <Chip
            label={`${product.discount}% OFF`}
            color="error"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        )}
      </Box>

      <CardActionArea component={RouterLink} to={`/product/${product?._id}`}>
        <CardMedia
          component="img"
          height="200"
          image={productImage}
          alt={product?.name || 'Product'}
          sx={{ objectFit: 'contain', p: 2 }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" component="div" noWrap fontWeight="500">
            {product?.name || 'Product Name'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {product?.brand || 'Brand'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating 
              value={product?.rating || 0} 
              precision={0.5} 
              size="small" 
              readOnly 
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              ({product?.numReviews || 0})
            </Typography>
          </Box>
          <Typography variant="h6" color="primary" fontWeight="600">
            ${product?.price ? product.price.toFixed(2) : '0.00'}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/product/${product?._id}`}
          color="primary"
        >
          View Details
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={!product?.sizes || product.sizes.length === 0}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 