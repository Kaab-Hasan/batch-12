import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Avatar,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Jane Smith',
      role: 'Founder & CEO',
      image: 'https://via.placeholder.com/150',
      bio: 'Jane has over 15 years of experience in the footwear industry and founded ShoeStop with a vision to provide quality footwear at affordable prices.'
    },
    {
      name: 'Michael Johnson',
      role: 'Head of Design',
      image: 'https://via.placeholder.com/150',
      bio: 'Michael brings his creative vision and expertise to ensure all our products meet the highest standards of style and functionality.'
    },
    {
      name: 'Sarah Wilson',
      role: 'Customer Relations Manager',
      image: 'https://via.placeholder.com/150',
      bio: 'Sarah leads our customer service team with her dedication to providing exceptional shopping experiences for all our customers.'
    },
    {
      name: 'David Chen',
      role: 'Operations Director',
      image: 'https://via.placeholder.com/150',
      bio: 'David oversees all logistics and operations to ensure timely delivery and quality control for all our products.'
    }
  ];

  const values = [
    {
      title: 'Quality',
      icon: <CheckCircleIcon fontSize="large" color="primary" />,
      description: 'We are committed to providing shoes of the highest quality, sourced from trusted manufacturers and rigorously tested for durability and comfort.'
    },
    {
      title: 'Customer Satisfaction',
      icon: <ShoppingBagIcon fontSize="large" color="primary" />,
      description: 'Your satisfaction is our top priority. We strive to exceed expectations with exceptional products, competitive prices, and outstanding service.'
    },
    {
      title: 'Support',
      icon: <SupportAgentIcon fontSize="large" color="primary" />,
      description: 'Our dedicated customer support team is always ready to assist you with any questions, concerns, or feedback about our products and services.'
    },
    {
      title: 'Reliability',
      icon: <LocalShippingIcon fontSize="large" color="primary" />,
      description: 'Count on us for reliable shipping, accurate product information, and honest business practices throughout your shopping experience.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          About ShoeStop
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          We are passionate about providing high-quality footwear that combines style, comfort, and durability for all occasions.
        </Typography>
      </Box>

      {/* Our Story */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="https://via.placeholder.com/600x400"
            alt="Our store"
            sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Founded in 2010, ShoeStop began as a small boutique store with a dream to revolutionize the footwear shopping experience. We believe that the right pair of shoes can transform not just your outfit, but your confidence and comfort throughout the day.
            </Typography>
            <Typography variant="body1" paragraph>
              Over the years, we've grown from a single store to an international online presence, but our commitment to quality and customer satisfaction remains unchanged. We carefully select each brand and model we offer, ensuring they meet our high standards for design, materials, and craftsmanship.
            </Typography>
            <Typography variant="body1">
              Today, we're proud to serve customers worldwide, helping people find the perfect shoes for every occasion, from casual everyday wear to special events and athletic performance.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Our Values */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Our Values
        </Typography>
        <Grid container spacing={3}>
          {values.map((value) => (
            <Grid item xs={12} sm={6} md={3} key={value.title}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {value.icon}
                </Box>
                <Typography variant="h6" align="center" gutterBottom>
                  {value.title}
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary">
                  {value.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Meet Our Team */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Meet Our Team
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={3} key={`${member.name}-${member.role}`}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={member.image}
                  alt={member.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Milestones */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Our Journey
        </Typography>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Divider sx={{ position: 'absolute', top: '50%', left: 0, right: 0 }} />
            
            <Grid container spacing={8} position="relative">
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'primary.main', zIndex: 1 }}>
                    2010
                  </Avatar>
                  <Typography variant="h6" gutterBottom>Founding</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Opened our first retail store with a focus on quality footwear
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'primary.main', zIndex: 1 }}>
                    2015
                  </Avatar>
                  <Typography variant="h6" gutterBottom>Expansion</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Launched our online store and expanded to 10 retail locations
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'primary.main', zIndex: 1 }}>
                    2018
                  </Avatar>
                  <Typography variant="h6" gutterBottom>Growth</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Partnered with 50+ premium shoe brands and shipped to 25 countries
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'primary.main', zIndex: 1 }}>
                    2023
                  </Avatar>
                  <Typography variant="h6" gutterBottom>Innovation</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Launched mobile app and sustainable shoe collection
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutPage; 