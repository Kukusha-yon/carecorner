import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  // Load cart from localStorage on mount and when user changes
  useEffect(() => {
    if (user && user._id) {
      const savedCart = localStorage.getItem(`cart_${user._id}`);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log('Loading saved cart for user:', user._id, parsedCart);
          setCartItems(parsedCart);
          const totalQuantity = parsedCart.reduce((count, item) => count + item.quantity, 0);
          setCartCount(totalQuantity);
        } catch (error) {
          console.error('Error loading cart:', error);
          toast.error('Failed to load your cart');
        }
      }
    } else {
      // Load guest cart from localStorage
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        try {
          const parsedCart = JSON.parse(guestCart);
          setCartItems(parsedCart);
          const totalQuantity = parsedCart.reduce((count, item) => count + item.quantity, 0);
          setCartCount(totalQuantity);
        } catch (error) {
          console.error('Error loading guest cart:', error);
        }
      }
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && user._id) {
      try {
        console.log('Saving cart for user:', user._id, cartItems);
        localStorage.setItem(`cart_${user._id}`, JSON.stringify(cartItems));
        const totalQuantity = cartItems.reduce((count, item) => count + item.quantity, 0);
        setCartCount(totalQuantity);
      } catch (error) {
        console.error('Error saving cart:', error);
        toast.error('Failed to save your cart');
      }
    } else {
      // Save guest cart to localStorage
      try {
        localStorage.setItem('guest_cart', JSON.stringify(cartItems));
        const totalQuantity = cartItems.reduce((count, item) => count + item.quantity, 0);
        setCartCount(totalQuantity);
      } catch (error) {
        console.error('Error saving guest cart:', error);
      }
    }
  }, [cartItems, user]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) {
      toast.error('Invalid product data');
      return;
    }

    try {
      console.log('Adding to cart:', { product, quantity });
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item._id === product._id);
        const newItems = existingItem
          ? prevItems.map(item =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [...prevItems, { ...product, quantity, isNewArrival: product.isNewArrival || false }];
        console.log('New cart items:', newItems);
        return newItems;
      });
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = (productId) => {
    try {
      setCartItems(prevItems => {
        const itemToRemove = prevItems.find(item => item._id === productId);
        return prevItems.filter(item => item._id !== productId);
      });
      toast.success('Removed from cart!');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = (productId, quantity) => {
    try {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = () => {
    try {
      setCartItems([]);
      setCartCount(0);
      if (user) {
        localStorage.removeItem(`cart_${user._id}`);
      } else {
        localStorage.removeItem('guest_cart');
      }
      toast.success('Cart cleared!');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 