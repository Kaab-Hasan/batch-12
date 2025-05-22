import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress,
  Pagination,
  TextField,
  InputAdornment,
  Drawer,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Divider,
  useMediaQuery,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductGrid from '../components/product/ProductGrid';
import ProductCard from '../components/product/ProductCard';
import config from '../config';

// Sample data for when API fails
const SAMPLE_PRODUCTS = Array.from({ length: 20 }, (_, i) => ({
  _id: `sample-${i + 1}`,
  name: `Sample Shoe ${i + 1}`,
  price: Math.floor(Math.random() * 200) + 50,
  images: ['https://via.placeholder.com/300'],
  brand: ['Nike', 'Adidas', 'Puma', 'Reebok'][Math.floor(Math.random() * 4)],
  category: ['Men', 'Women', 'Children'][Math.floor(Math.random() * 3)],
  rating: parseFloat((Math.random() * 5).toFixed(1)),
  numReviews: Math.floor(Math.random() * 100),
  sizes: [
    { size: '7', inStock: true },
    { size: '8', inStock: true },
    { size: '9', inStock: true },
  ],
  colors: ['Black', 'White', 'Red'],
  description: 'This is a sample shoe description.',
  isNewArrival: Math.random() > 0.7,
  isBestSeller: Math.random() > 0.7,
  discount: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0
}));

const ProductsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState({
    men: false,
    women: false,
    children: false,
    sport: false,
    casual: false,
    formal: false
  });
  const [brands, setBrands] = useState({
    nike: false,
    adidas: false,
    puma: false,
    reebok: false,
    vans: false,
    converse: false
  });

  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_URL}/products`);
        const data = await response.json();
        console.log("Fetched API data:", data);
    
        // Ensure we're dealing with an array and handle both response formats
        const productsArray = Array.isArray(data) ? data : 
                            Array.isArray(data.products) ? data.products : [];
        
        // Map the products to ensure consistent structure
        const mappedProducts = productsArray.map(product => ({
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images || ['https://via.placeholder.com/300'],
          brand: product.brand,
          category: product.category,
          rating: product.rating || 0,
          numReviews: product.numReviews || 0,
          sizes: product.sizes || [],
          colors: product.colors || [],
          description: product.description,
          isNewArrival: product.isNewArrival || false,
          isBestSeller: product.isBestSeller || false,
          discount: product.discount || 0
        }));

        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);

      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Failed to load products. Please try again later.');
        // Initialize with empty arrays on error
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, categories, brands, priceRange, products]);

  const applyFilters = () => {
    let result = [...products];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filters
    const selectedCategories = Object.entries(categories)
      .filter(([_, isSelected]) => isSelected)
      .map(([cat]) => cat);
      
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.some(cat => 
          product.category?.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }
    
    // Apply brand filters
    const selectedBrands = Object.entries(brands)
      .filter(([_, isSelected]) => isSelected)
      .map(([brand]) => brand);
      
    if (selectedBrands.length > 0) {
      result = result.filter(product => 
        selectedBrands.some(brand => 
          product.brand?.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }
    
    // Apply price filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(result);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategories({
      ...categories,
      [event.target.name]: event.target.checked
    });
  };

  const handleBrandChange = (event) => {
    setBrands({
      ...brands,
      [event.target.name]: event.target.checked
    });
  };

  const handlePriceChange = (_, newValue) => {
    setPriceRange(newValue);
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
    window.scrollTo(0, 0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  
  // Safely get current products - ensure filteredProducts is an array
  const currentProducts = Array.isArray(filteredProducts) 
    ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct) 
    : [];

  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

  const filterContent = (
    <Box sx={{ width: isMobile ? '100vw' : 250, p: 3 }}>
      <Typography variant="h6" gutterBottom>Filters</Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>Price Range</Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={500}
          sx={{ mt: 2, mb: 4 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Box>
      </Box>
      
      <Typography variant="subtitle1" gutterBottom>Categories</Typography>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormGroup>
          {Object.entries(categories).map(([category, checked]) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleCategoryChange}
                  name={category}
                />
              }
              label={category.charAt(0).toUpperCase() + category.slice(1)}
            />
          ))}
        </FormGroup>
      </FormControl>
      
      <Typography variant="subtitle1" gutterBottom>Brands</Typography>
      <FormControl component="fieldset">
        <FormGroup>
          {Object.entries(brands).map(([brand, checked]) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleBrandChange}
                  name={brand}
                />
              }
              label={brand.charAt(0).toUpperCase() + brand.slice(1)}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shop All Shoes
        </Typography>
        <Button 
          startIcon={<FilterListIcon />} 
          onClick={toggleDrawer} 
          variant="outlined" 
          sx={{ display: { md: 'none' } }}
        >
          Filters
        </Button>
      </Box>
      
      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search for shoes..."
        variant="outlined"
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      
      {/* Error Message */}
      {error && (
        <Alert severity="info" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Content */}
      <Grid container spacing={3}>
        {/* Filter Sidebar - Desktop */}
        <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          {filterContent}
        </Grid>
        
        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>
          ) : (
            <>
              <Grid container spacing={3}>
                {Array.isArray(currentProducts) && currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Alert severity="info">No products found matching your criteria.</Alert>
                  </Grid>
                )}
              </Grid>
              
              {/* Pagination */}
              {Array.isArray(filteredProducts) && filteredProducts.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination 
                    count={pageCount} 
                    page={currentPage} 
                    onChange={handlePageChange} 
                    color="primary" 
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
      
      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
      >
        {filterContent}
      </Drawer>
    </Container>
  );
};

export default ProductsPage; 