import { useState, useEffect } from "react";
import axios from "axios";

const useProducts = (params) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams();

        if (params.q) query.append("q", params.q);
        if (params.category?.length)
          query.append("category", params.category.join(","));
        if (params.subCategory?.length)
          query.append("subCategory", params.subCategory.join(","));
        if (params.page) query.append("page", params.page);
        if (params.limit) query.append("limit", params.limit);

        const response = await axios.get(
          `http://localhost:3000/api/product/filter/?${query.toString()}`,
          { withCredentials: true },
        );

        console.log(response.data);
        setProducts(response.data.products);
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    params.q,
    params.page,
    params.limit,
    JSON.stringify(params.category),
    JSON.stringify(params.subCategory),
  ]);

  return { products, loading, error };
};

export default useProducts;
