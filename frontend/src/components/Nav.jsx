import logo from "../assets/logo.png";
import { IoIosSearch } from "react-icons/io";
import { FaOpencart } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { CiMenuBurger } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";
import { useLocation } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { IoChevronBack } from "react-icons/io5";

const Nav = () => {
  const [/*searchOpen*/, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const { cart } = useSelector((state) => state.cartSlice);

  useEffect(() => {
    // keep internal searchOpen in sync with URL if needed in future
    // currently we rely on URL param `search=1` to indicate open state
  }, []);
  const logoutHandler = async () => {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/logout`, {
      withCredentials: true,
    });
    dispatch(setUser(null));
  };
  return (
    <div
      className={`flex w-full items-center justify-between py-3 `}
    >
      <div className="flex items-center gap-2">
        <img className="w-15" src={logo} alt="" />
        <span>OUTFYT</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {["Home", "Collection", "About", "Contact"].map((item) => (
          <h3
            onClick={() =>
              navigate(item === "Home" ? "/" : `/${item.toLowerCase()}`)
            }
            key={item}
            className="relative text-sm font-[200] cursor-pointer
                 before:content-[''] before:absolute before:left-1/2 before:-bottom-1
                 before:w-0 before:h-[1px] before:bg-black
                 before:transition-all before:duration-300
                 hover:before:w-full hover:before:left-0"
          >
            {item}
          </h3>
        ))}

        <button
          onClick={() =>
            window.open("http://localhost:5174/admin/login", "_blank")
          }
          className="px-5 py-1 border border-gray-100 rounded-2xl text-sm hover:bg-gray-200 text-gray-700"
        >
          Admin Panel
        </button>
      </div>

      <div className="flex gap-2">
        <div
          onClick={() => {
            // Toggle search param on collection route. If already on /collection,
            // toggle the `search` query param; otherwise navigate to collection with it.
            const params = new URLSearchParams(location.search);
            if (location.pathname === "/collection") {
              if (params.get("search")) {
                params.delete("search");
                const search = params.toString();
                navigate(search ? `/collection?${search}` : "/collection");
              } else {
                params.set("search", "1");
                navigate(`/collection?${params.toString()}`);
              }
            } else {
              navigate("/collection?search=1");
            }
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-400/20"
        >
          <IoIosSearch size={20} />
        </div>
        <div
          onClick={() => setProfile((prev) => !prev)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-400/20"
        >
          <CiUser size={20} />
        </div>
        <div
          onClick={() => navigate("/cart")}
          className="relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400/20"
        >
          {/* Cart Icon */}
          <FaOpencart size={20} />

          {/* Cart Count Badge */}
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </div>
        <div
          onClick={() => {
            (setSidebarOpen(true), setProfile(false));
          }}
          className="flex items-center justify-center md:hidden"
        >
          <CiMenuBurger size={20} />
        </div>
      </div>

      {/* Nav no longer renders SmartSearch overlay. Collection page shows it when `?search=1` is present. */}

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => {
            setSidebarOpen(true);
            setProfile(false);
          }}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full font-sans w-[90%] bg-white z-50
  transform transition-transform duration-300
  ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Back Button */}
          <div
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 px-5 py-4 border-b border-gray-400 cursor-pointer"
          >
            <IoChevronBack size={20} />
            <span className="text-md font-medium">Back</span>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col">
            {[
              { name: "Home", path: "/" },
              { name: "Collection", path: "/collection" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
              {
                name: "Admin Panel",
                path: "http://localhost:5174/admin/login",
                external: true,
              },
            ].map((item, index) => {
              const isActive =
                !item.external && location.pathname === item.path;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (item.external) {
                      window.open(item.path, "_blank"); // open in new tab
                    } else {
                      navigate(item.path);
                    }
                    setSidebarOpen(false);
                  }}
                  className={`px-5 py-4 text-md font-semibold cursor-pointer border-b
          ${
            isActive
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }
        `}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {profile && (
        <div
          className="absolute right-6 top-14 w-56 bg-white rounded-xl shadow-lg z-50
    p-4 flex flex-col gap-3"
        >
          {/* User Info */}
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-gray-800">
              {user?.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/my-orders")}
              className="flex items-center gap-2 text-sm text-gray-700
        hover:bg-gray-100 px-2 py-1 rounded-md"
            >
              <span>My Orders</span>
            </button>

            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 text-sm text-gray-700
        hover:bg-gray-100 px-2 py-1 rounded-md"
              >
                <CiUser size={16} />
                <span>Login</span>
              </button>
            ) : (
              <div
                onClick={logoutHandler}
                className="text-red-600 font-semibold ml-2 hidden md:block cursor-pointer"
              >
                Log Out
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
