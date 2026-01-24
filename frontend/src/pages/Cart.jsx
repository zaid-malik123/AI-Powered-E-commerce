import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useSelector } from "react-redux";
import useCart from "../hooks/useCart";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userSlice);
  const {
    cart,
    loading,
    fetchCart,
    updateQuantity,
    removeFromCart,
    clearCartItems,
    getCartTotal,
  } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasCheckedUser, setHasCheckedUser] = useState(false);

  // Fetch cart on mount or when user changes
  useEffect(() => {
    const initCart = async () => {
      setIsInitializing(true);
      
      // Give app time to load user state on first mount
      if (!hasCheckedUser) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setHasCheckedUser(true);
      }

      if (user) {
        console.log("User found, fetching cart...", user);
        await fetchCart();
        setIsInitializing(false);
      } else if (hasCheckedUser) {
        // Only redirect after we've confirmed user doesn't exist
        console.log("No user found, redirecting to login");
        setIsInitializing(false);
        navigate("/login");
      }
    };

    initCart();
  }, [user, fetchCart, navigate, hasCheckedUser]);

  // Update local state when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      // Fetch full product details for each cart item
      const fetchCartDetails = async () => {
        try {
          const itemsWithDetails = await Promise.all(
            cart.map(async (item) => {
              if (item.product) {
                return item;
              }
              // If product details not in Redux, fetch from API
              try {
                const res = await axios.get(
                  `${import.meta.env.VITE_BASE_URL}/api/product/${item.productId}`,
                  { withCredentials: true }
                );
                return {
                  ...item,
                  product: res.data.product,
                };
              } catch {
                return item;
              }
            })
          );
          setCartItems(itemsWithDetails);
        } catch (err) {
          console.error("Error fetching cart details:", err);
          setCartItems(cart);
        }
      };

      fetchCartDetails();
    } else {
      setCartItems([]);
    }
    // Calculate total price directly without depending on getCartTotal function
    const total = cart.reduce((sum, item) => sum + item.priceAtThatTime * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await clearCartItems();
    }
  };

  // While initializing, show loading
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please login to view cart</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>

      {loading && <p className="text-center text-gray-500">Loading cart...</p>}

      {!loading && cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/collection")}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 shrink-0">
                    <img
                      src={item.product?.image || "placeholder.png"}
                      alt={item.product?.name}
                      className="w-full h-full object-cover rounded-md cursor-pointer"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3
                      className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {item.product?.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Price: ${item.priceAtThatTime}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <FaMinus size={14} />
                      </button>
                      <span className="px-3 py-1 border border-gray-300 rounded">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="font-semibold text-gray-900">
                      Subtotal: ${(item.priceAtThatTime * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md transition"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              ))}
            </div>

            {cartItems.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={handleClearCart}
                  className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition font-semibold"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (0%)</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button onClick={() => navigate("/checkout")} className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-semibold mb-3">
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/collection")}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
                  ✓ Free delivery on orders over $50
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;