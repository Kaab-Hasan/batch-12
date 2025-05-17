import Product from '../models/productModel.js';
import { uploadImage, uploadMultipleImages } from '../utils/cloudinary.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = 10; // Default products per page
    const page = Number(req.query.page) || 1;
    
    // Build query based on filters
    const query = {};
    
    // Search by keyword (name or description)
    if (req.query.keyword) {
      query.$text = { $search: req.query.keyword };
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by brand
    if (req.query.brand) {
      query.brand = req.query.brand;
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }
    
    // Count total products matching the query
    const count = await Product.countDocuments(query);
    
    // Get products with pagination
    const products = await Product.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });
    
    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category,
      brand,
      sizes,
      colors,
      featured,
      isBestSeller,
      isNewArrival 
    } = req.body;

    // Upload product images if provided
    let productImages = [];
    if (req.files && req.files.length > 0) {
      try {
        productImages = await uploadMultipleImages(req.files, 'shoes-ecommerce/products');
      } catch (error) {
        return res.status(400).json({ message: 'Image upload failed' });
      }
    }

    // Create new product
    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      brand,
      sizes: JSON.parse(sizes || '[]'),
      colors: JSON.parse(colors || '[]'),
      images: productImages,
      featured: featured === 'true',
      isBestSeller: isBestSeller === 'true',
      isNewArrival: isNewArrival === 'true'
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category,
      brand,
      sizes,
      colors,
      featured,
      isBestSeller,
      isNewArrival 
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = Number(price) || product.price;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      
      // Parse arrays if provided
      if (sizes) {
        product.sizes = JSON.parse(sizes);
      }
      
      if (colors) {
        product.colors = JSON.parse(colors);
      }
      
      // Update boolean flags if provided
      if (featured !== undefined) {
        product.featured = featured === 'true';
      }
      
      if (isBestSeller !== undefined) {
        product.isBestSeller = isBestSeller === 'true';
      }
      
      if (isNewArrival !== undefined) {
        product.isNewArrival = isNewArrival === 'true';
      }

      // Upload and add new images if provided
      if (req.files && req.files.length > 0) {
        try {
          const newImages = await uploadMultipleImages(req.files, 'shoes-ecommerce/products');
          // Append new images to existing ones
          product.images = [...product.images, ...newImages];
        } catch (error) {
          return res.status(400).json({ message: 'Image upload failed' });
        }
      }

      // Save updated product
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/:id/images/:imageIndex
// @access  Private/Admin
export const deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const imageIndex = parseInt(req.params.imageIndex);

    if (product && imageIndex >= 0 && imageIndex < product.images.length) {
      // Remove the image from the array
      product.images.splice(imageIndex, 1);
      
      // Save updated product
      await product.save();
      
      res.json({ message: 'Image removed', product });
    } else {
      res.status(404).json({ message: 'Product or image not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const featuredProducts = await Product.find({ featured: true })
      .limit(limit)
      .sort({ createdAt: -1 });
    
    res.json(featuredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get best selling products
// @route   GET /api/products/bestsellers
// @access  Public
export const getBestSellerProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const bestSellers = await Product.find({ isBestSeller: true })
      .limit(limit)
      .sort({ createdAt: -1 });
    
    res.json(bestSellers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get new arrival products
// @route   GET /api/products/new
// @access  Public
export const getNewArrivalProducts = async (req, res) => {
  try {
    const newArrivals = await Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(newArrivals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch new arrivals' });
  }
}; 