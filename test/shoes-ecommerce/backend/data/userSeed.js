import bcrypt from 'bcrypt';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123456', 10),
    role: 'admin',
    profilePic: 'https://via.placeholder.com/150',
    address: {
      street: '123 Admin Street',
      city: 'Admin City',
      state: 'Admin State',
      postalCode: '12345',
      country: 'USA'
    },
    phone: '555-123-4567'
  },
  {
    name: 'Demo User',
    email: 'demo@example.com',
    password: bcrypt.hashSync('demo123456', 10),
    role: 'user',
    profilePic: 'https://via.placeholder.com/150',
    address: {
      street: '456 Demo Street',
      city: 'Demo City',
      state: 'Demo State',
      postalCode: '67890',
      country: 'USA'
    },
    phone: '555-987-6543'
  }
];

export default users; 