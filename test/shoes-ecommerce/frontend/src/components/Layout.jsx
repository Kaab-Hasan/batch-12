import React from 'react';
import { Box } from '@mui/material';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import ChatWidget from './chat/ChatWidget';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 3, mt: 8 }}>
        {children}
      </Box>
      <Footer />
      <ChatWidget />
    </Box>
  );
};

export default Layout; 