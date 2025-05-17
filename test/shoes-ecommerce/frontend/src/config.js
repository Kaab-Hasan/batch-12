// Default API URL for development
export const API_URL = 'http://localhost:5000';

// Fallback mock data flag - set to false to ensure using the real API
export const USE_MOCK_DATA = false;

// Stripe publishable key - this would come from your environment variables
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key';

// Other configuration variables can be added here
export const APP_NAME = 'ShoeStyle';
export const APP_DESCRIPTION = 'Premium Footwear Online Store';
export const SUPPORT_EMAIL = 'support@shoestyle.com';
export const SUPPORT_PHONE = '+1 (555) 123-4567';
export const SOCIAL_MEDIA = {
  facebook: 'https://facebook.com/shoestyle',
  twitter: 'https://twitter.com/shoestyle',
  instagram: 'https://instagram.com/shoestyle'
}; 

// Default export combining all config values
export default {
  API_URL,
  USE_MOCK_DATA,
  STRIPE_PUBLISHABLE_KEY,
  APP_NAME,
  APP_DESCRIPTION,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SOCIAL_MEDIA
}; 