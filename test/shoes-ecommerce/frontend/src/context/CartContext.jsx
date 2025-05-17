import React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0.08); // 8% tax
  const [shippingCost, setShippingCost] = useState(10); // $10 shipping
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load cart from localStorage on app start
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          
          // Validate cart items to ensure they have the necessary properties
          const validatedCart = parsedCart.filter(item => {
            // Ensure item has either id or _id
            if (!item._id && !item.id) return false;
            
            // Ensure item has price and quantity
            if (typeof item.price !== 'number' || typeof item.quantity !== 'number') return false;
            
            // Ensure item has name
            if (!item.name) return false;
            
            // Ensure item has either image or images
            if (!item.image && (!item.images || item.images.length === 0)) return false;
            
            return true;
          });
          
          setCart(validatedCart);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // If there's an error, reset the cart
        setCart([]);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Calculate subtotal
    const total = cart.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
    
    setSubTotal(total);
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity = 1, size, color) => {
    // Ensure product is not undefined or null
    if (!product) return;
    
    // Standardize the product object for cart
    const cartItem = {
      _id: product._id || product.id,
      id: product._id || product.id, // For backward compatibility
      name: product.name,
      price: parseFloat(product.price),
      quantity: quantity,
      size: size || '',
      color: color || '',
      // Handle both image structures (images array or single image property)
      image: product.image || (product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300')
    };
    
    const existingItemIndex = cart.findIndex(
      item => (item._id === cartItem._id || item.id === cartItem._id) && item.size === cartItem.size && item.color === cartItem.color
    );

    if (existingItemIndex !== -1) {
      // If item already exists in cart, update quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
      
      // Show success notification for updated item
      setNotification({
        open: true,
        message: `Updated ${cartItem.name} quantity in your cart!`,
        severity: 'success'
      });
    } else {
      // Add new item to cart
      setCart([...cart, cartItem]);
      
      // Show success notification for new item
      setNotification({
        open: true,
        message: `${cartItem.name} has been added to your cart!`,
        severity: 'success'
      });
    }
  };

  // Remove item from cart
  const removeFromCart = (id, size, color) => {
    // If only id is provided, remove all items with that id
    if (size === undefined && color === undefined) {
      const updatedCart = cart.filter(item => item._id !== id);
      setCart(updatedCart);
      return;
    }

    // Otherwise remove specific item with matching id, size, and color
    const updatedCart = cart.filter(
      item => !(item._id === id && item.size === size && item.color === color)
    );
    setCart(updatedCart);
  };

  // Update item quantity
  const updateQuantity = (id, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    const updatedCart = cart.map(item => {
      if (item._id === id && item.size === size && item.color === color) {
        return { ...item, quantity };
      }
      return item;
    });

    setCart(updatedCart);
    
    // Show notification when quantity is updated
    const itemName = cart.find(item => item._id === id && item.size === size && item.color === color)?.name;
    if (itemName) {
      setNotification({
        open: true,
        message: `Updated ${itemName} quantity in your cart!`,
        severity: 'success'
      });
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  // Calculate tax amount
  const getTaxAmount = () => {
    return Math.round((subTotal * taxRate) * 100) / 100;
  };

  // Calculate total cost
  const getTotalCost = () => {
    const tax = getTaxAmount();
    return Math.round((subTotal + tax + shippingCost) * 100) / 100;
  };

  // Handle closing the notification
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({...notification, open: false});
  };

  const value = {
    cart,
    cartItems: cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    subTotal,
    taxRate,
    setTaxRate,
    shippingCost,
    setShippingCost,
    getTaxAmount,
    getTotalCost
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </CartContext.Provider>
  );
}; 