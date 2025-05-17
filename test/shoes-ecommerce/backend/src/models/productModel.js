import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  category: { 
    type: String,
    required: true,
    enum: ['men', 'women', 'kids', 'sports', 'casual', 'formal']
  },
  images: [{ 
    type: String, 
    required: true,
    trim: true 
  }],
  sizes: [{
    size: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 }
  }],
  colors: [String],
  brand: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Text index on name and description for search
productSchema.index({ name: 'text', description: 'text' });  

// Index on price for filtering
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product; 