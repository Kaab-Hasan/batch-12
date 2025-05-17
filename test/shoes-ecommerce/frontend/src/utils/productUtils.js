/**
 * Utility functions for product data handling
 */

/**
 * Safely filters related products to prevent "filter is not a function" errors
 * @param {Array|null} relatedData - Array of related products or null
 * @param {Function} filterFn - Filter function to apply
 * @returns {Array} - Filtered array or empty array if input is invalid
 */
export const safeFilter = (relatedData, filterFn) => {
  // Check if relatedData exists and is an array
  if (!relatedData || !Array.isArray(relatedData)) {
    return [];
  }
  
  // Apply filter function
  return relatedData.filter(filterFn);
};

/**
 * Format price with currency symbol
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price);
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {number} - Discount percentage
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export default {
  safeFilter,
  formatPrice,
  calculateDiscount
}; 