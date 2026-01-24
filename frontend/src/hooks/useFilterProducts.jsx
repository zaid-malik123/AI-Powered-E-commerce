import { useState } from 'react';
import axios from 'axios';

const useFilterProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filterProducts = async (category = [], subCategory = []) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        'http://localhost:3000/api/product/filter',
        {
          category,
          subCategory,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Filter error:', err);
      setError(err.response?.data?.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, filterProducts };
};

export default useFilterProducts;
