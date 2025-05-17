import jwt from 'jsonwebtoken';

// Generate JWT token for a user
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

export default generateToken; 