import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsBoxSeam } from "react-icons/bs";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/order/all`,
        { withCredentials: true }
      );
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/order/update-status/${orderId}`,
        { status },
        { withCredentials: true }
      );

      fetchOrders(); // refresh after update
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading Orders...</div>;
  }

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-semibold mb-6">Order Page</h2>

      {orders.length === 0 && (
        <p className="text-gray-500">No orders found</p>
      )}

      {orders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-200 rounded-lg p-5 mb-5 flex justify-between items-start shadow-sm"
        >
          {/* LEFT SECTION */}
          <div className="flex gap-4 w-1/2">
            <div className="h-20 w-20 bg-gray-50 flex items-center justify-center rounded">
              <BsBoxSeam className="text-gray-700" size={40} />
            </div>

            <div>
              {order.items.map((item, index) => (
                <p key={index} className="font-medium">
                  {item.product?.name} x {item.quantity}
                </p>
              ))}

              {/* Address */}
              <div className="text-sm text-gray-600 mt-3">
                <p>{order.address?.street}</p>
                <p>
                  {order.address?.city}, {order.address?.state},{" "}
                  {order.address?.country} {order.address?.zipcode}
                </p>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION */}
          <div className="text-sm w-1/4">
            <p>Items : {order.items.length}</p>

            <p className="font-semibold text-lg mt-1">
              ${order.totalAmount}
            </p>

            <p>Method : {order.paymentMethod}</p>

            <p>
              Payment :{" "}
              <span
                className={`font-medium ${
                  order.paymentStatus === "Paid"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {order.paymentStatus}
              </span>
            </p>

            <p>
              Date :{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-1/4 flex justify-end">
            <select
              value={order.orderStatus}
              onChange={(e) =>
                handleStatusChange(order._id, e.target.value)
              }
              className="border px-3 py-2 rounded-md"
            >
              <option value="Placed">Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;