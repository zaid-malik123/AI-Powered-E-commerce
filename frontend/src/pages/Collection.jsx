import Card from "../components/Card";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from "react";
import useGetAllProducts from "../hooks/useGetAllProducts";
import useFilterProducts from "../hooks/useFilterProducts";
// import SmartSearch from "../components/SmartSearch";
import { useNavigate } from "react-router-dom";

const Collection = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  const { products: allProducts, loading: allLoading } = useGetAllProducts();
  const { products: filteredProducts, loading: filterLoading, filterProducts } = useFilterProducts();
  const navigate = useNavigate()
  useEffect(() => {
    if (allProducts.length > 0) {
      setDisplayProducts(allProducts);
    }
  }, [allProducts]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory)
        ? prev.filter((item) => item !== subCategory)
        : [...prev, subCategory]
    );
  };

  useEffect(() => {
    if (selectedCategories.length > 0 || selectedSubCategories.length > 0) {
      filterProducts(selectedCategories, selectedSubCategories);
    } else if (!searchResults) {
      setDisplayProducts(allProducts);
    }
  }, [selectedCategories, selectedSubCategories]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      setDisplayProducts(filteredProducts);
    }
  }, [filteredProducts]);

  useEffect(() => {
    if (searchResults) {
      setDisplayProducts(searchResults);
    }
  }, [searchResults]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    if (results.length > 0) {
      setSelectedCategories([]);
      setSelectedSubCategories([]);
    }
  };

  return (
    <div className="w-full min-h-screen mt-10 flex flex-col px-4 md:px-10">
      {/* <div className="mb-8">
        <SmartSearch onResultsChange={handleSearchResults} />
      </div> */}

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col gap-5 h-full w-full md:w-65">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-2xl text-gray-700">Filters</h2>

            <button
              onClick={() => setIsMobileFilterOpen((prev) => !prev)}
              className="md:hidden text-gray-400"
            >
              {isMobileFilterOpen ? (
                <IoIosArrowDown size={20} />
              ) : (
                <MdKeyboardArrowRight size={20} />
              )}
            </button>
          </div>

          <div
            className={`
            flex-col gap-5
            ${isMobileFilterOpen ? "flex" : "hidden"}
            md:flex
          `}
          >
            <div className="border border-gray-300 rounded-md p-5 bg-white">
              <h2 className="text-lg font-semibold mb-4">CATEGORIES</h2>
              <div className="space-y-3">
                {["Men", "Women", "Kids"].map((item) => (
                  <label key={item} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-black"
                      checked={selectedCategories.includes(item)}
                      onChange={() => handleCategoryChange(item)}
                    />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border border-gray-300 rounded-md p-5 bg-white">
              <h2 className="text-lg font-semibold mb-4">TYPE</h2>
              <div className="space-y-3">
                {["Topwear", "Bottomwear", "Winterwear"].map((item) => (
                  <label key={item} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-black"
                      checked={selectedSubCategories.includes(item)}
                      onChange={() => handleSubCategoryChange(item)}
                    />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl text-gray-600">
              {searchResults ? "Search Results" : "All Collections"}
            </span>
            <div className="w-12 h-0.5 bg-black"></div>
          </div>

          {(allLoading || filterLoading) && (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading products...</p>
            </div>
          )}

          {displayProducts.length === 0 && !allLoading && !filterLoading && (
            <div className="text-center py-10">
              <p className="text-gray-500">No products found</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayProducts.map((item) => (
              <div
                onClick={() =>  navigate(`/product/${item._id}`) }
                key={item._id}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Card
                  item={{
                    image: item.image,
                    title: item.name,
                    price: item.price,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
