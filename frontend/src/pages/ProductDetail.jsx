import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import useCart from "../hooks/useCart";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [fav, setFav] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  const { user } = useSelector((state) => state.userSlice);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const { id } = useParams();

  const fetchDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/product/${id}`,
        { withCredentials: true },
      );
      setProduct(res.data.product);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    setCartMessage("");

    const result = await addToCart(product._id, quantity);

    if (result.success) {
      setCartMessage("✓ Added to cart successfully!");
      setQuantity(1);
      setTimeout(() => setCartMessage(""), 3000);
    } else {
      setCartMessage("✗ Failed to add to cart");
    }

    setAddingToCart(false);
  };

  if (loading) {
    return <p className="text-center py-20">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center py-20">Product not found</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="w-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-125 object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-semibold">{product.name}</h1>

          <p className="text-2xl font-bold text-gray-900">${product.price}</p>

          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <div className="flex border rounded-md">
              <button
                className="px-4 py-2 hover:bg-gray-100"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                className="px-4 py-2 hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={() => setFav(!fav)}
              className={`p-3 border rounded-md transition ${
                fav ? "text-red-500 border-red-400" : "text-gray-500 border-gray-300"
              }`}
            >
              <FaHeart size={20} />
            </button>
          </div>

          {/* Cart Message */}
          {cartMessage && (
            <p
              className={`text-sm font-semibold ${
                cartMessage.includes("✓")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {cartMessage}
            </p>
          )}

          {/* Extra Info */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>✔ 100% Original Product</p>
            <p>✔ Cash on Delivery Available</p>
            <p>✔ Easy Returns within 7 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
