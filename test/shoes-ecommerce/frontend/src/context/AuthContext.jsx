import React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
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
      
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      
      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err.message || 'Authentication failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Admin login
  const adminLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Admin authentication failed');
      }

      const data = await response.json();
      
      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err.message || 'Admin authentication failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
      
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      const data = await response.json();
      
      // Update user in state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err.message || 'Profile update failed';
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