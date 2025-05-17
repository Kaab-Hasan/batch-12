import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  TextField,
  CircularProgress,
  Breadcrumbs,
  Link,
  Paper,
  Tabs,
  Tab,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import config from '../config';

// Sample product for when API fails
const createSampleProduct = (id) => ({
  _id: id,
  name: `Sample Nike Air Max ${id}`,
  price: 129.99,
  description: "Premium athletic shoes with excellent comfort and durability. Featuring breathable mesh upper, cushioned insole, and responsive midsole for energy return with every step. Rubber outsole provides excellent traction on various surfaces.",
  images: ['https://via.placeholder.com/500'],
  brand: 'Nike',
  category: 'Men',
  rating: 4.5,
  numReviews: 12,
  stock: 15,
  sizes: [
    { size: '7', inStock: true },
    { size: '8', inStock: true },
    { size: '9', inStock: true },
    { size: '10', inStock: true },
    { size: '11', inStock: true }
  ],
  colors: ['Black', 'White', 'Red']
});

// Sample related products
const SAMPLE_RELATED = Array.from({ length: 4 }, (_, i) => ({
  _id: `related-${i + 1}`,
  name: `Related Shoe ${i + 1}`,
  price: Math.floor(Math.random() * 200) + 50,
  images: ['https://via.placeholder.com/300'],
  brand: 'Nike',
  category: 'Men',
  rating: parseFloat((Math.random() * 5).toFixed(1)),
  sizes: [{ size: '9', inStock: true }],
  colors: ['Black']
}));

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If USE_MOCK_DATA is true, use sample data immediately without API call
        if (config.USE_MOCK_DATA) {
          setProduct(createSampleProduct(id));
          setRelatedProducts(SAMPLE_RELATED);
          setError('Using sample product data until the API is available.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${config.API_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        
        // Fetch related products
        const relatedResponse = await fetch(`${config.API_URL}/api/products?category=${data.category}&limit=4`);
        if (!relatedResponse.ok) {
          throw new Error(`Error fetching related products: ${relatedResponse.status}`);
        }
        const relatedData = await relatedResponse.json();
        setRelatedProducts(relatedData.filter(p => p._id !== data._id).slice(0, 4));
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Using sample product data until the API is available.');
        
        // Use sample data if API fails
        setProduct(createSampleProduct(id));
        setRelatedProducts(SAMPLE_RELATED);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };

  const handleSizeChange = (event) => {
    setSize(event.target.value);
  };

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const handleAddToCart = () => {
    if (!size) {
      alert('Please select a size');
      return;
    }
    
    const selectedSize = typeof size === 'object' ? size.size : size;
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : '';
    
    addToCart({
      ...product,
      quantity,
      size: selectedSize,
      color,
    });
    navigate('/cart');
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', my: 5 }}>
          <Typography variant="h5">Product not found</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/products')}
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => navigate('/')}
          sx={{ cursor: 'pointer' }}
        >
          Home
        </Link>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={() => navigate('/products')}
          sx={{ cursor: 'pointer' }}
        >
          Products
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      {/* Error Message */}
      {error && (
        <Alert severity="info" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Product Details */}
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2, overflow: 'hidden' }}>
            <Box
              component="img"
              src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/500'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: 1
              }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {product.numReviews} reviews
            </Typography>
          </Box>
          
          <Chip 
            label={product.brand} 
            size="small" 
            sx={{ mr: 1, mb: 2 }} 
          />
          <Chip 
            label={product.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ mb: 2 }} 
          />
          
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            ${product.price.toFixed(2)}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Available Sizes:
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="size-select-label">Size</InputLabel>
              <Select
                labelId="size-select-label"
                value={size}
                label="Size"
                onChange={handleSizeChange}
              >
                {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  product.sizes.map((sizeObj) => (
                    <MenuItem key={typeof sizeObj === 'object' ? sizeObj.size : sizeObj} value={typeof sizeObj === 'object' ? sizeObj.size : sizeObj}>
                      {typeof sizeObj === 'object' ? sizeObj.size : sizeObj}
                    </MenuItem>
                  ))
                ) : (
                  [7, 8, 9, 10, 11].map(size => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 'bold' }}>
                Quantity:
              </Typography>
              <TextField
                type="number"
                InputProps={{ inputProps: { min: 1, max: product.countInStock || 10 } }}
                value={quantity}
                onChange={handleQuantityChange}
                size="small"
                sx={{ width: 70 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {product.countInStock ? `${product.countInStock} available` : 'In stock'}
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              fullWidth
              disabled={!product.countInStock && product.countInStock !== undefined}
            >
              Add to Cart
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Reviews" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <Typography variant="body1">
                {product.description || 'No detailed description available for this product.'}
              </Typography>
            )}
            
            {tabValue === 1 && (
              <Box>
                <Typography variant="body1" paragraph>
                  <strong>Brand:</strong> {product.brand}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Category:</strong> {product.category}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Material:</strong> Synthetic leather, mesh
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Sole:</strong> Rubber
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Closure:</strong> Lace-up
                </Typography>
              </Box>
            )}
            
            {tabValue === 2 && (
              <Box>
                <Typography variant="body1" paragraph>
                  Customer reviews coming soon.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Related Products
          </Typography>
          
          <Grid container spacing={3}>
            {relatedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetailPage; 