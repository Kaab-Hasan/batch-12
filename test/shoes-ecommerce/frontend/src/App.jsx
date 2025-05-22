import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import theme from './theme';
import AppRoutes from './routes/AppRoutes';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 