import React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Set axios default headers with token
        if (parsedUser.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${API_URL}/api/users`, userData);
      
      // Save user to state and localStorage
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // Set axios default headers with token
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${API_URL}/api/users/login`, { email, password });
      
      // Save user to state and localStorage
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // Set axios default headers with token
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Authentication failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Admin login
  const adminLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`${API_URL}/api/auth/admin/login`, { email, password });
      
      // Save user to state and localStorage
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // Set axios default headers with token
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Admin authentication failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      
      // Append text fields
      Object.keys(userData).forEach(key => {
        if (key !== 'profilePicture') {
          formData.append(key, userData[key]);
        }
      });
      
      // Append profile picture if exists
      if (userData.profilePicture) {
        formData.append('image', userData.profilePicture);
      }
      
      const res = await axios.put(`${API_URL}/api/users/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update user in state and localStorage
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Profile update failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    adminLogin,
    logout,
    updateProfile,
    isAuthenticated,
    isAdmin,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 