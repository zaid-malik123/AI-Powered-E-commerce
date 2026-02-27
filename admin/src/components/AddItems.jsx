import React, { useState } from "react";
import axios from "axios";

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Men",
    subCategory: "Topwear",
    price: "",
    sizes: "S",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);
      data.append("price", formData.price);
      data.append("sizes", formData.sizes);
      data.append("image", image);

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/product/create`,
        data,
        {
          withCredentials: true
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);
      setFormData({
        name: "",
        description: "",
        category: "Men",
        subCategory: "Topwear",
        price: "",
        sizes: "S",
      });
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }

    setLoading(false);
  };

  

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      {/* Upload Image */}
      <div>
        <label className="block font-medium mb-2">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 w-full"
          required
        />
      </div>

      {/* Product Name */}
      <div>
        <label className="block font-medium mb-2">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          rows="4"
          required
        />
      </div>

      {/* Category + SubCategory */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block font-medium mb-2">Sub Category</label>
          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          >
            <option>Topwear</option>
            <option>Bottomwear</option>
            <option>Winterwear</option>
          </select>
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block font-medium mb-2">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      {/* Size */}
      <div>
        <label className="block font-medium mb-2">Size</label>
        <select
          name="sizes"
          value={formData.sizes}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        >
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
          <option>XXL</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        {loading ? "Adding..." : "ADD"}
      </button>
    </form>
  );
};

export default AddItems;