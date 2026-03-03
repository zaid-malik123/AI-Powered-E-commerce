import Footer from "./components/Footer";
import Nav from "./components/Nav";
import AIChat from "./components/AIChat";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import AppRoutes from "./routes/AppRoutes";
import useCart from "./hooks/useCart";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setSocket } from "./redux/features/userSlice";
import { useLocation } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch()
  const { user, socket } = useSelector((state) => state.userSlice);
  useGetCurrentUser();

  const { fetchCart } = useCart();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  

   useEffect(() => {
    if (user) {
      const socket_io = io(`https://outfit-zfpx.onrender.com`, {
        withCredentials: true
      });

      dispatch(setSocket(socket_io));

      

      return () => {
        socket_io.close();
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [user]);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Toast container placed once at root with common config */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    <div className="w-screen min-h-screen md:px-25 px-3">
      {!isAdminRoute && <Nav />}
      <AppRoutes />
      {!isAdminRoute && <Footer />}
      {user && <AIChat />}
    </div>
    </>
  );
};

export default App;
