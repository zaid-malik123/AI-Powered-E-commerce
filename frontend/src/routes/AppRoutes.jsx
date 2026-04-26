import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import Cart from "../pages/Cart";
import About from "../pages/About";
import Collection from "../pages/Collection";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProductDetail from "../pages/ProductDetail";
import CheckOut from "../pages/CheckOut";
import OrderConfirm from "../pages/OrderConfirm";
import MyOrders from "../pages/MyOrders";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoutes from "../components/ProtectedRoutes";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/collection" element={<Collection />}></Route>
        <Route path="/product/:id" element={<ProductDetail />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/checkout" element={<CheckOut />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/my-orders" element={<MyOrders />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/confirm" element={<OrderConfirm />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
