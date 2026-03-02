import React, { useState } from "react";
import axios from "axios";

const AddItems = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Men",
    subCategory: "Topwear",
    price: "",
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSizes.length === 0) {
      alert("Please select at least one size");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);
      data.append("price", formData.price);

      // append multiple sizes
      selectedSizes.forEach((size) => {
        data.append("sizes", size);
      });

      // append multiple images
      images.forEach((img) => {
        data.append("images", img);
      });

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/product/create`,
        data,
        { withCredentials: true }
      );

      console.log(res.data)

      alert(res.data.message);

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "Men",
        subCategory: "Topwear",
        price: "",
      });

      setSelectedSizes([]);
      setImages([]);

    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      {/* Upload Images */}
      <div>
        <label className="block font-medium mb-2">Upload Images (Max 5)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="border p-2 w-full"
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
        <label className="block font-medium mb-2">Product Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          rows="4"
          required
        />
      </div>

      {/* Category & SubCategory */}
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
        <label className="block font-medium mb-2">Product Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      {/* Sizes */}
      <div>
        <label className="block font-medium mb-2">Product Sizes</label>
        <div className="flex gap-3 flex-wrap">
          {sizeOptions.map((size) => (
            <button
              type="button"
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`px-4 py-2 border rounded 
                ${
                  selectedSizes.includes(size)
                    ? "bg-black text-white"
                    : "bg-gray-100"
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
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