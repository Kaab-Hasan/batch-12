import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  PeopleOutline,
  Inventory,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  Person,
  ViewList,
  LocalShipping,
  Add,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '@mui/material/styles';
import { API_URL, USE_MOCK_DATA } from '../../config';

// Mock data for dashboard
const mockStats = {
  totalSales: 15780.45,
  totalOrders: 124,
  totalProducts: 57,
  totalCustomers: 345,
  recentOrders: [
    { id: '1001', customer: 'John Doe', date: '2023-05-15', total: 126.50, status: 'Delivered' },
    { id: '1002', customer: 'Jane Smith', date: '2023-05-14', total: 89.99, status: 'Processing' },
    { id: '1003', customer: 'Bob Johnson', date: '2023-05-13', total: 210.75, status: 'Shipped' },
    { id: '1004', customer: 'Alice Brown', date: '2023-05-12', total: 55.20, status: 'Pending' },
    { id: '1005', customer: 'Charlie Wilson', date: '2023-05-11', total: 175.00, status: 'Delivered' },
  ],
  popularProducts: [
    { id: '101', name: 'Nike Air Max', stock: 23, sold: 45, price: 129.99 },
    { id: '102', name: 'Adidas Ultraboost', stock: 15, sold: 37, price: 149.99 },
    { id: '103', name: 'Puma RS-X', stock: 8, sold: 25, price: 110.00 },
    { id: '104', name: 'New Balance 990', stock: 12, sold: 18, price: 174.99 },
    { id: '105', name: 'Converse Chuck Taylor', stock: 30, sold: 15, price: 60.00 },
  ]
};

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const theme = useTheme();

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from API
        const response = await fetch(`${API_URL}/dashboard/stats`, {
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
        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Unable to load dashboard data. Using sample data temporarily.');
        setStats(mockStats); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user.token]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Welcome back, {user?.name || 'Admin'}!
        </Typography>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'warning.light' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <AttachMoney />
              </Avatar>
              <Box>
                <Typography variant="h6" component="div">
                  {formatCurrency(stats?.totalSales || 0)}
                </Typography>
                <Typography variant="body2">Total Sales</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                <ShoppingCart />
              </Avatar>
              <Box>
                <Typography variant="h6" component="div">
                  {stats?.totalOrders || 0}
                </Typography>
                <Typography variant="body2">Orders</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <Inventory />
              </Avatar>
              <Box>
                <Typography variant="h6" component="div">
                  {stats?.totalProducts || 0}
                </Typography>
                <Typography variant="body2">Products</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                <PeopleOutline />
              </Avatar>
              <Box>
                <Typography variant="h6" component="div">
                  {stats?.totalCustomers || 0}
                </Typography>
                <Typography variant="body2">Customers</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Orders */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 450,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Recent Orders
              </Typography>
              <Button 
                component={RouterLink} 
                to="/admin/orders" 
                size="small" 
                startIcon={<ViewList />}
              >
                View All
              </Button>
            </Box>
            <TableContainer sx={{ maxHeight: 350 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats?.recentOrders?.map((order, index) => (
                    <TableRow key={`order-${order.id || index}`} hover>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            bgcolor: 
                              order.status === 'Delivered' ? 'success.light' : 
                              order.status === 'Processing' ? 'warning.light' : 
                              order.status === 'Shipped' ? 'info.light' : 
                              'error.light',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block'
                          }}
                        >
                          {order.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Quick Actions & Popular Products */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              mb: 3,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              <ListItem key="manage-orders" button component={RouterLink} to="/admin/orders">
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Manage Orders" />
              </ListItem>
              <ListItem key="manage-users" button component={RouterLink} to="/admin/users">
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Manage Users" />
              </ListItem>
              <ListItem key="manage-inventory" button component={RouterLink} to="/admin/products">
                <ListItemIcon>
                  <Inventory />
                </ListItemIcon>
                <ListItemText primary="Inventory Management" />
              </ListItem>
            </List>
          </Paper>

          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Popular Products
            </Typography>
            <List>
              {stats?.popularProducts?.map((product) => (
                <ListItem 
                  key={`popular-product-${product.id || product.name}`} 
                  sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
                >
                  <ListItemText 
                    primary={product.name} 
                    secondary={`Stock: ${product.stock} | Sold: ${product.sold}`} 
                  />
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    {formatCurrency(product.price)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboardPage; 