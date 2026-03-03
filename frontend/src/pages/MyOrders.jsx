import axios from "axios";
import { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/order/`,
        { withCredentials: true },
      );

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <div className="w-full min-h-screen bg-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          MY ORDERS —
        </h1>

        {/* Loader */}
        {loading && (
          <p className="text-gray-500 text-sm">Loading your orders...</p>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <p className="text-gray-500 text-sm">No orders found.</p>
        )}

        <div className="space-y-5">
          {orders.map((order) =>
            order.items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row border border-gray-300 rounded-md p-4 gap-4"
              >
                {/* Product Section */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={
                      item.product?.image[0] || "https://via.placeholder.com/80"
                    }
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />

                  <div>
                    <h2 className="text-sm font-medium text-gray-800">
                      {item.product?.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      ₹{item.product?.price} | Qty: {item.quantity} | Size:{" "}
                      {item.product?.sizes}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Date:{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Status + Payment (Right side desktop, bottom mobile) */}
                <div className="flex flex-col md:items-end gap-2 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-600"></span>
                    {order.status || "Processing"}
                  </div>

                   <div className="flex items-center gap-2 text-blue-600">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    {order.paymentMethod || "Processing"}
                  </div>
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
