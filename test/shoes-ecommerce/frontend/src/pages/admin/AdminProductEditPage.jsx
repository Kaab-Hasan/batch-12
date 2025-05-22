import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Divider,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  IconButton,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Card,
  CardMedia,
  Tooltip,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../../context/AuthContext';
import config from '../../config';
import { Add } from '@mui/icons-material';

// Categories and other data for the product form
const categories = ['men', 'women', 'kids', 'sports', 'casual', 'formal'];
const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance', 'Vans', 'Converse', 'Under Armour', 'Asics', 'Fila'];
const availableSizes = ['5', '6', '7', '8', '9', '10', '11', '12', '13'];
const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Grey', 'Brown', 'Navy', 'Purple', 'Orange', 'Pink', 'Multicolor'];

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAddMode = !id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    images: [],
    sizes: [],
    colors: [],
    featured: false,
    isBestSeller: false,
    isNewArrival: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (!isAddMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch product');
      }

      const data = await response.json();
      
      // Map the data to the form structure
      setFormData({
        name: data.name || '',
        brand: data.brand || '',
        category: data.category || '',
        description: data.description || '',
        price: data.price || '',
        images: data.images || [],
        sizes: data.sizes || [],
        colors: data.colors || [],
        featured: data.featured || false,
        isBestSeller: data.isBestSeller || false,
        isNewArrival: data.isNewArrival || false
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.brand) {
      errors.brand = 'Brand is required';
      isValid = false;
    }

    if (!formData.category) {
      errors.category = 'Category is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.price) {
      errors.price = 'Price is required';
      isValid = false;
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
      isValid = false;
    }

    if ((isAddMode && formData.images.length === 0 && selectedFiles.length === 0) || 
        (!isAddMode && formData.images.length === 0)) {
      errors.images = 'At least one image is required';
      isValid = false;
    }

    if (formData.sizes.length === 0) {
      errors.sizes = 'At least one size must be selected';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (name === 'price') {
      // Allow only numbers and decimal point for price
      if (!/^[0-9]*\.?[0-9]*$/.test(value)) return;
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSizeSelect = (size) => {
    // Check if this size is already in the sizes array
    const sizeExists = formData.sizes.find(s => s.size === size);
    
    if (sizeExists) {
      // If size exists, remove it
      setFormData({
        ...formData,
        sizes: formData.sizes.filter(s => s.size !== size)
      });
    } else {
      // Otherwise, add it with default stock of 0
      setFormData({
        ...formData,
        sizes: [...formData.sizes, { size, stock: 0 }]
      });
    }
  };

  const handleSizeStockChange = (size, stock) => {
    const newSizes = formData.sizes.map(s => {
      if (s.size === size) {
        return { ...s, stock: Number(stock) };
      }
      return s;
    });
    
    setFormData({
      ...formData,
      sizes: newSizes
    });
  };

  const handleColorToggle = (color) => {
    if (formData.colors.includes(color)) {
      setFormData({
        ...formData,
        colors: formData.colors.filter(c => c !== color)
      });
    } else {
      setFormData({
        ...formData,
        colors: [...formData.colors, color]
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...filesArray]);
    }
  };

  const removeSelectedFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const removeExistingImage = async (index) => {
    if (!isAddMode) {
      try {
        const response = await fetch(`${config.API_URL}/products/${id}/images/${index}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete image');
        }
        
        // Update the state after successful deletion
        const updatedImages = [...formData.images];
        updatedImages.splice(index, 1);
        setFormData({
          ...formData,
          images: updatedImages
        });
      } catch (err) {
        setError(err.message || 'Failed to delete image');
      }
    } else {
      // For new products, simply update the state
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData({
        ...formData,
        images: updatedImages
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Create FormData object to handle file uploads
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('brand', formData.brand);
      formDataObj.append('category', formData.category);
      formDataObj.append('description', formData.description);
      formDataObj.append('price', formData.price);
      formDataObj.append('sizes', JSON.stringify(formData.sizes));
      formDataObj.append('colors', JSON.stringify(formData.colors));
      formDataObj.append('featured', formData.featured);
      formDataObj.append('isBestSeller', formData.isBestSeller);
      formDataObj.append('isNewArrival', formData.isNewArrival);
      
      // Append image files if any
      selectedFiles.forEach(file => {
        formDataObj.append('images', file);
      });
      
      // Set the appropriate method and URL for create or update
      const apiUrl = isAddMode
        ? `${config.API_URL}/products`
        : `${config.API_URL}/products/${id}`;
      
      const response = await fetch(apiUrl, {
        method: isAddMode ? 'POST' : 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formDataObj
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save product');
      }
      
      setSuccess(`Product ${isAddMode ? 'created' : 'updated'} successfully!`);
      
      // Redirect to products list after a short delay
      setTimeout(() => {
        navigate('/admin/products');
      }, 2000);
      
      setSaving(false);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setSaving(false);
    }
  };

  const goBack = () => {
    navigate('/admin/products');
  };

  if (loading && !isAddMode) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link color="inherit" onClick={goBack} sx={{ cursor: 'pointer' }}>
              Admin Dashboard
        </Link>
            <Link color="inherit" onClick={goBack} sx={{ cursor: 'pointer' }}>
          Products
        </Link>
        <Typography color="text.primary">
              {isAddMode ? 'Add Product' : 'Edit Product'}
        </Typography>
      </Breadcrumbs>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            {isAddMode ? 'Add Product' : 'Edit Product'}
          </Typography>
          
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={goBack}
        >
          Back to Products
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {success}
        </Alert>
      )}
      
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="text"
                error={!!formErrors.price}
                helperText={formErrors.price}
                InputProps={{
                  startAdornment: '$',
                }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.brand} required>
                <InputLabel>Brand</InputLabel>
                <Select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  label="Brand"
                >
                  {brands.map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.brand && <FormHelperText>{formErrors.brand}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.category} required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.category && <FormHelperText>{formErrors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
              />
            </Grid>
            
            {/* Sizes */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Sizes & Stock
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.sizes}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Select Available Sizes
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {availableSizes.map((size) => {
                    const isSelected = formData.sizes.some(s => s.size === size);
                    return (
                      <Chip
                        key={size}
                        label={size}
                        onClick={() => handleSizeSelect(size)}
                        color={isSelected ? "primary" : "default"}
                        variant={isSelected ? "filled" : "outlined"}
                        sx={{ mb: 1 }}
                      />
                    );
                  })}
                </Stack>
                {formErrors.sizes && <FormHelperText>{formErrors.sizes}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {/* Stock inputs for selected sizes */}
            {formData.sizes.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Enter Stock Quantity for Each Size
                </Typography>
                <Grid container spacing={2}>
                  {formData.sizes.map((sizeObj) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={sizeObj.size}>
                      <TextField
                        fullWidth
                        label={`Size ${sizeObj.size} Stock`}
                        type="number"
                        value={sizeObj.stock}
                        onChange={(e) => handleSizeStockChange(sizeObj.size, e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
            
            {/* Colors */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Colors
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {colors.map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    onClick={() => handleColorToggle(color)}
                    color={formData.colors.includes(color) ? "primary" : "default"}
                    variant={formData.colors.includes(color) ? "filled" : "outlined"}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
          </Grid>
          
            {/* Product Images */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Product Images
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.images}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  multiple
                  type="file"
                  onChange={handleFileChange}
                  disabled={uploadingImages}
                />
                <label htmlFor="image-upload">
            <Button
              variant="outlined"
                    component="span"
                    startIcon={<AddPhotoAlternateIcon />}
                    disabled={uploadingImages}
            >
                    Add Images
            </Button>
                </label>
                {formErrors.images && <FormHelperText>{formErrors.images}</FormHelperText>}
              </FormControl>
            </Grid>
            
            {/* Preview of existing images */}
            {formData.images && formData.images.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Existing Images
                </Typography>
                <Grid container spacing={2}>
                  {formData.images.map((image, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={image}
                          alt={`Product Image ${index + 1}`}
                        />
                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="Remove Image">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => removeExistingImage(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
            
            {/* Preview of selected files */}
            {selectedFiles.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  New Images to Upload
                </Typography>
                <Grid container spacing={2}>
                  {selectedFiles.map((file, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="140"
                          image={URL.createObjectURL(file)}
                          alt={`New Product Image ${index + 1}`}
                        />
                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="Remove Image">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => removeSelectedFile(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
            
            {/* Product Features */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Product Features
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={handleChange}
                    name="featured"
                  />
                }
                label="Featured Product"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isBestSeller}
                    onChange={handleChange}
                    name="isBestSeller"
                  />
                }
                label="Best Seller"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isNewArrival}
                    onChange={handleChange}
                    name="isNewArrival"
                  />
                }
                label="New Arrival"
              />
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
              disabled={saving}
                  sx={{ px: 4, py: 1 }}
            >
                  {saving ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                      Saving...
                    </>
                  ) : (
                    'Save Product'
                  )}
            </Button>
          </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminProductEditPage; 