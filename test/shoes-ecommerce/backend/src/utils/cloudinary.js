import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
export const uploadImage = async (fileBuffer, folder = 'shoes-ecommerce') => {
  try {
    // Convert buffer to base64
    const fileStr = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileStr, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1000, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Image upload failed');
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleImages = async (fileBuffers, folder = 'shoes-ecommerce') => {
  try {
    const uploadPromises = fileBuffers.map(file => 
      uploadImage(file.buffer, folder)
    );
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    throw new Error('Multiple image upload failed');
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { message: 'Image deleted successfully' };
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Image deletion failed');
  }
};
 