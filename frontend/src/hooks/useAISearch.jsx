import { useState } from "react";

const useAISearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/smart-search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data.products || []);
    } catch (err) {
      setError(err.message);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async (query) => {
    if (query.length < 2) return [];

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/search-suggestions?query=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      return data.suggestions || [];
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      return [];
    }
  };

  return { results, loading, error, search, getSuggestions };
};

export default useAISearch;
