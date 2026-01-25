import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const OrderConfirm = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full border border-gray-200 rounded-xl p-8 text-center">

        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-6">
          <FaCheckCircle size={70} className="text-black" />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-semibold mb-2">
          Order Confirmed
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          Thank you for your purchase! Your order has been placed successfully.
        </p>

        {/* ORDER DETAILS */}
        <div className="border-t border-b border-gray-200 py-4 mb-6 text-sm text-gray-600 space-y-3">
          <div className="flex justify-between">
            <span>Order ID</span>
            <span className="font-medium text-black">#ORD12345</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="font-medium text-black">$99.00</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span className="font-medium text-black">Online</span>
          </div>
        </div>

        {/* INFO ROWS */}
        <div className="flex flex-col gap-4 text-sm text-gray-600 mb-8">
          <div className="flex items-center gap-3 justify-center">
            <MdOutlineLocalShipping size={20} className="text-black" />
            <span>Your order will be delivered soon</span>
          </div>

          <div className="flex items-center gap-3 justify-center">
            <HiOutlineReceiptRefund size={20} className="text-black" />
            <span>Easy 7-day return policy</span>
          </div>
        </div>

        {/* BUTTON */}
        <button className="w-full py-3 bg-black text-white text-sm tracking-wide hover:bg-gray-800 transition">
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
};

export default OrderConfirm;
