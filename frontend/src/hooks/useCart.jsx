import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCart,  clearCart, setCartTotal } from "../redux/features/cartSlice";

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cartSlice);
  const { user } = useSelector((state) => state.userSlice);

  // Fetch cart from server - memoized to prevent recreation
  const fetchCart = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/cart`,
        { withCredentials: true }
      );


      if (response.data.success) {
        // Backend returns { success, cart: { items, userId, _id, ... } }
        const cartData = response.data.cart;
        
        if (cartData && cartData.items && cartData.items.length > 0) {
          // Convert items format for Redux
          const formattedItems = cartData.items.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            priceAtThatTime: item.priceAtThatTime,
            product: item.productId,
          }));
          dispatch(setCart(formattedItems));
        } else {
          // Empty cart
          dispatch(setCart([]));
        }
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, dispatch]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/cart/add`,
        { productId, quantity },
        { withCredentials: true }
      );

      if (response.data.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      return { success: false, message: err.response?.data?.message };
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/cart/update`,
        { productId, quantity },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Re-fetch cart to get updated data
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: "Failed to update" };
    } catch (err) {
      console.error("Error updating cart:", err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/cart/remove`,
        { 
          data: { productId },
          withCredentials: true 
        }
      );

      if (response.data.success) {
        // Re-fetch cart to get updated data
        await fetchCart();
        return { success: true };
      }
      return { success: false, message: "Failed to remove item" };
    } catch (err) {
      console.error("Error removing from cart:", err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Clear entire cart
  const clearCartItems = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/cart/remove-all-cart`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Clear Redux store
        dispatch(clearCart());
        return { success: true };
      }
      return { success: false, message: "Failed to clear cart" };
    } catch (err) {
      console.error("Error clearing cart:", err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Get cart total
  const getCartTotal = () => {
    const total = cart.reduce((total, item) => total + item.priceAtThatTime * item.quantity, 0);
    dispatch(setCartTotal(total));
    return total;
  };

  // Get cart item count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCartItems,
    getCartTotal,
    getCartCount,
  };
};

export default useCart;
