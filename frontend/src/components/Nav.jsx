import logo from "../assets/logo.png";
import { IoIosSearch } from "react-icons/io";
import { FaOpencart } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";
import SmartSearch from "./SmartSearch";

const Nav = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const { cart } = useSelector((state) => state.cartSlice);

  const logoutHandler = async () => {
    await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/logout`, {
      withCredentials: true,
    });
    dispatch(setUser(null));
  };
  return (
    <div
      className={`flex w-full items-center justify-between py-3 ${
        searchOpen ? "mb-15" : ""
      }`}
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
      </div>

      <div className="flex gap-2">
        <div
          onClick={() => setSearchOpen((prev) => !prev)}
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

      {searchOpen && (
        <div className="w-full fixed top-15 left-0 flex items-center justify-center z-40 p-4">
          <div className="relative w-[80%] md:w-[60%]">
            <SmartSearch onResultsChange={setSearchResults} />
          </div>
        </div>
      )}

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] max-w-[280px] bg-white z-50
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">OUTFYT</span>
            <button onClick={() => setSidebarOpen(false)} className="text-xl">
              ✕
            </button>
          </div>

          {/* Links */}
          {["Home", "Collection", "About", "Contact"].map((item) => (
            <h3
              key={item}
              onClick={() => setSidebarOpen(false)}
              className="text-sm font-extralight cursor-pointer hover:text-gray-500 hover:bg-gray-600 px-5 py-2 bg-gray-100 rounded-md"
            >
              {item}
            </h3>
          ))}

          <hr />

          {/* Extra actions */}

          <div
            onClick={logoutHandler}
            className="absolute bottom-10 flex items-center gap-2 "
          >
            <IoIosLogOut size={20} className="text-red-600" />
            <span className="text-red-500">LogOut</span>
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
