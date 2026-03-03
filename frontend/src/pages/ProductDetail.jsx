import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import useCart from "../hooks/useCart";
import Card from "../components/Card";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [fav, setFav] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [selectSize, setSelectSize] = useState("");

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

  const fetchRelatedProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/product/related/${id}`,
      );

      setRelatedProduct(res.data.relatedProducts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchRelatedProducts();
  }, [id]);

  // 👇 Jab product load ho jaye to 0th image mainImage ban jaye
  useEffect(() => {
    if (product?.image?.length > 0) {
      setMainImage(product.image[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    // allow guest users to add to cart; login will be requested at checkout

    setAddingToCart(true);
    setCartMessage("");

    const result = await addToCart(product._id, quantity);

    if (result.success) {
      toast.success("Item added to cart.", { toastId: "cart-add" });
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
    <div className="min-h-screen bg-white max-w-7xl mx-auto px-6 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT SIDE - IMAGE SECTION */}
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex flex-row lg:flex-col gap-4 justify-center">
            {product.image.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setMainImage(img)}
                className={`w-20 h-24 object-cover border cursor-pointer transition ${
                  mainImage === img ? "border-black" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-[400px] lg:h-[550px] object-cover"
            />
          </div>
        </div>

        {/* RIGHT SIDE - INFO SECTION */}
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold tracking-wide">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 text-sm">
            <div className="text-red-500">★★★★★</div>
            <span className="text-gray-500">(122 Reviews)</span>
          </div>

          <p className="text-3xl font-bold text-gray-900">${product.price}</p>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Size Selection */}
          <div>
            <p className="font-medium mb-3">Select Size</p>
            <div className="flex gap-3">
              {product.sizes?.map((size) => (
                <button
                  onClick={() => setSelectSize(size)}
                  key={size}
                  className={`border px-5 py-2 transition 
        ${
          selectSize === size
            ? "bg-black text-white"
            : "hover:bg-black hover:text-white"
        }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add To Cart */}
          <div className="flex items-center gap-5 mt-4">
            <div className="flex border text-sm md:text-xl">
              <button
                className="px-4 py-2"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                className="px-4 py-2"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="bg-black text-white px-4 py-2 text-[12px]  md:text-sm md:px-10 md:py-3 hover:bg-gray-800 transition disabled:opacity-50"
            >
              {addingToCart ? "ADDING..." : "ADD TO CART"}
            </button>

            <button
              onClick={() => setFav(!fav)}
              className={`p-3 border transition ${
                fav
                  ? "text-red-500 border-red-400"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              <FaHeart size={18} />
            </button>
          </div>

          {cartMessage && <p className="text-sm mt-2">{cartMessage}</p>}

          <div className="text-sm text-gray-600 space-y-2 mt-6">
            <p>✔ 100% Original product</p>
            <p>✔ Cash on delivery available</p>
            <p>✔ Easy return within 7 days</p>
          </div>
        </div>
      </div>

      {/* DESCRIPTION & REVIEWS UI */}
      <div className="mt-20 border border-gray-200 rounded-sm">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <h2 className="px-8 py-4 text-sm font-semibold border-b-2 border-black text-black cursor-pointer">
            Description
          </h2>

          <h2 className="px-8 py-4 text-sm font-semibold text-gray-500 hover:text-black cursor-pointer">
            Reviews (122)
          </h2>
        </div>

        {/* Content */}
        <div className="p-8 text-gray-600 leading-relaxed text-sm md:text-base space-y-4">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence.
          </p>

          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>

      <h2 className="flex items-center gap-2 justify-center mt-5 md:mt-15 text-xl md:text-2xl">
        RELATED PRODUCTS
        <div className="w-20 md:w-30 h-[1px] bg-gray-400"></div>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-5 md:mt-10">
        {relatedProduct?.map((item) => (
          <Card item={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
