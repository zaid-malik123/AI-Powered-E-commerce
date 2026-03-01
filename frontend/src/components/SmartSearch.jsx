import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

const SmartSearch = ({ onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value); 
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchChange("");
  };

  return (
    <div className="relative w-[95%] md:w-[70%] mx-auto">
      <div className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-3 gap-2">
        <FiSearch className="text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search products..."
          className="flex-1 outline-none text-gray-700"
        />
        {searchQuery && (
          <button onClick={clearSearch}>
            <FiX size={18} />
          </button>
        )}
        <HiSparkles className="text-blue-500" size={18} />
      </div>
    </div>
  );
};

export default SmartSearch;