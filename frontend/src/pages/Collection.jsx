import Card from "../components/Card";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
// import useGetAllProducts from "../hooks/useGetAllProducts";
// import useFilterProducts from "../hooks/useFilterProducts";
// import SmartSearch from "../components/SmartSearch";
import { useNavigate, useSearchParams } from "react-router-dom";

const Collection = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  // searchResults removed, pagination handles results directly

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const prevQueryRef = useRef("");

  // fetch products on page or query change, with reset logic
  useEffect(() => {
    const q = searchParams.get("q") || "";

    // if query changed and not on first page, reset page and exit; effect will re-run
    if (q !== prevQueryRef.current && page !== 1) {
      setDisplayProducts([]);
      setPage(1);
      prevQueryRef.current = q;
      return;
    }

    // if query changed and page is 1, update prevQuery and clear existing products
    if (q !== prevQueryRef.current) {
      prevQueryRef.current = q;
      setDisplayProducts([]);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // fall back to VITE_BASE_URL for compatibility with existing env files
        const baseUrl =
          import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL ||
          "http://localhost:3000";
        const url = new URL(`${baseUrl}/api/product/all`);
        url.searchParams.append("page", page);
        url.searchParams.append("limit", 20);
        if (q) url.searchParams.append("q", q);

        const res = await fetch(url.toString());
        const data = await res.json();
        if (res.ok && data.products) {
          if (page === 1) {
            setDisplayProducts(data.products);
          } else {
            setDisplayProducts((prev) => [...prev, ...data.products]);
          }
          setHasNextPage(data.hasNextPage);
        }
      } catch (err) {
        console.error("Collection fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, searchParams]);

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

  // filters still available but apply locally using full dataset or call API? for now ignore, could add later.
  // remove old filter-related effects

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
            <span className="text-2xl text-gray-600">All Collections</span>
            <div className="w-12 h-0.5 bg-black"></div>
          </div>

          {loading && (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading products...</p>
            </div>
          )}

          {displayProducts.length === 0 && !loading && (
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
          {/* load more button */}
          {hasNextPage && !loading && (
            <div className="text-center mt-6">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-2 bg-black text-white rounded-md"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
