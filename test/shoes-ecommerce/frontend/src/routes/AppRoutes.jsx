import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

// Protected User Pages
import ProfilePage from '../pages/user/ProfilePage';
import OrdersPage from '../pages/user/OrdersPage';
import OrderDetailPage from '../pages/user/OrderDetailPage';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminProductEditPage from '../pages/admin/AdminProductEditPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';

// Routing Guards
import ProtectedRoute from '../components/routing/ProtectedRoute';
import AdminRoute from '../components/routing/AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Protected User Routes */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      } />
      <Route path="/order/:id" element={
        <ProtectedRoute>
          <OrderDetailPage />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboardPage />
        </AdminRoute>
      } />
      <Route path="/admin/products" element={
        <AdminRoute>
          <AdminProductsPage />
        </AdminRoute>
      } />
      <Route path="/admin/product/new" element={
        <AdminRoute>
          <AdminProductEditPage />
        </AdminRoute>
      } />
      <Route path="/admin/product/:id" element={
        <AdminRoute>
          <AdminProductEditPage />
        </AdminRoute>
      } />
      <Route path="/admin/orders" element={
        <AdminRoute>
          <AdminOrdersPage />
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminUsersPage />
        </AdminRoute>
      } />
    </Routes>
  );
};

export default AppRoutes; 