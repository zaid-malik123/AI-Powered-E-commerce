import { useSelector } from "react-redux";
import Loader from "./Loader";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user, loading } = useSelector((state) => state.userSlice);
  

  if (loading) {
    return <Loader />;
  }

  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoutes;