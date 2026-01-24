import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const SmartSearch = ({ onResultsChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/search-suggestions?query=${encodeURIComponent(searchQuery)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setShowSuggestions(false);

    try {
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
      onResultsChange(data.products || []);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    onResultsChange([]);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-3 gap-2">
        <FiSearch className="text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search with AI assistance..."
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
        <HiSparkles className="text-blue-500 animate-pulse" size={18} />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0 flex items-center gap-2"
            >
              <FiSearch size={16} className="text-gray-400" />
              <span className="text-gray-700">{suggestion}</span>
              <span className="text-xs text-gray-400 ml-auto">AI Suggested</span>
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 p-4">
          <p className="text-sm text-gray-500 text-center">
            Generating smart suggestions...
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
