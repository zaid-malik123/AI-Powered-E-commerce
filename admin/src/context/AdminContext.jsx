import axios from "axios";
import { useEffect, useState } from "react";
import { AdminUserContext } from "./AdminUserContext";


const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/admin/get-admin`,
          { withCredentials: true }
        );
        
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching admin:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);

  return (
    <AdminUserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AdminUserContext.Provider>
  );
};

export default AdminProvider;