import React, { useEffect, useState } from "react";
import axios from "axios";

const ListItems = () => {
  const [products, setProducts] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/product/admin/all`, {
        withCredentials: true
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const handleDeleteProduct = async (id) => {

    const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/product/delete/${id}`, {
      withCredentials: true
    })

    console.log(res.data)
  }
  
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">All Products List</h2>

      <div className="border border-gray-100 rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-50">
            <tr className="text-gray-600 text-sm">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                {/* Image */}
                <td className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>

                {/* Name */}
                <td className="p-4 font-medium">{product.name}</td>

                {/* Category */}
                <td className="p-4">{product.category}</td>

                {/* Price */}
                <td className="p-4">${product.price}</td>

                {/* Action */}
                <td className="p-4 text-center">
                  <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 font-bold text-lg hover:text-red-700">
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center p-6 text-gray-500">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default ListItems;