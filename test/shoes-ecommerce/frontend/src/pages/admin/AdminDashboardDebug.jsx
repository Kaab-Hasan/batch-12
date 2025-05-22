import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';

const AdminDashboardDebug = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching dashboard stats with token:', user.token);
      const response = await fetch(`${config.API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dashboard data received:', data);
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchDashboardStats();
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard Debug</Typography>
      
      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={fetchDashboardStats} 
        sx={{ mb: 2 }}
      >
        Refresh Data
      </Button>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Raw Dashboard Data:</Typography>
        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflow: 'auto' }}>
          {dashboardData ? JSON.stringify(dashboardData, null, 2) : 'No data available'}
        </pre>
      </Paper>
    </Box>
  );
};

export default AdminDashboardDebug; 