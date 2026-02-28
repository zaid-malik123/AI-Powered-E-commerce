import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SmartSearch = ({ onResultsChange }) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  
  // fetch suggestions when typing
  useEffect(() => {
    if (searchQuery.length > 2) {
      const fetchSug = async () => {
        setLoading(true);
        try {
          // support both VITE_API_URL and older VITE_BASE_URL env names
          const baseUrl =
            import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL ||
            "http://localhost:3000";
          const resp = await fetch(
            `${baseUrl}/api/product/all?q=${encodeURIComponent(searchQuery)}&page=1&limit=5`
          );
          const data = await resp.json();
          setSuggestions(data.products || []);
          setShowSuggestions(true);
        } catch (e) {
          console.error("suggestions error", e);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSug();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowSuggestions(false);
    navigate(`/collection?q=${encodeURIComponent(query)}`);
    if (onResultsChange) onResultsChange([]); // optional callback
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (onResultsChange) onResultsChange([]);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-3 gap-2">
        <FiSearch className="text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 outline-none text-gray-700"
        />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={18} />
            </button>
          )}
      </div>
      
        {searchQuery && !loading && showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10">
            {suggestions.map((prod) => (
              <button
                key={prod._id}
                onClick={() => handleSearch(prod.name)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-2"
              >
                <FiSearch size={16} className="text-gray-400" />
                <span className="text-gray-700">{prod.name}</span>
              </button>
            ))}
          </div>
        )}
        {loading && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 p-4">
            <p className="text-sm text-gray-500 text-center">Searching...</p>
          </div>
        )}
    </div>
  );
};

export default SmartSearch;
