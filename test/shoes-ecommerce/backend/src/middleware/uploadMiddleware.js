import multer from 'multer';
import path from 'path';

// Set up storage using memory storage
const storage = multer.memoryStorage();

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
  }
};

// Initialize upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 } // 5MB max file size
});

// Middleware for single file upload
export const uploadSingle = upload.single('image');

// Middleware for multiple file upload
export const uploadMultiple = upload.array('images', 5); // max 5 images

// Middleware that handles multer errors
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size is too large. Max size is 5MB.' });
    }
    return res.status(400).json({ message: err.message });
  } 
  
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  
  next();
}; 