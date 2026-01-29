import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutform } from "../validator/formValidator";
import { useSelector } from "react-redux";
import useCart from "../hooks/useCart";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useSelector((state) => state.userSlice);
  const { cart, getCartTotal } = useCart();

  const navigate = useNavigate()

  const totalAmount = cart.reduce((total, item) => {
    return total + item.priceAtThatTime * item.quantity;
  }, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(checkoutform),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    if (paymentMethod === "cod") {
   
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/order/cod`, {
        items: cart,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          country: data.country,
        },
        totalAmount: totalAmount,
        paymentMethod: "cod",
      }, {withCredentials: true});

      navigate("/confirm")
    }
    
    
  };

  

  return (
    <div className="min-h-screen w-full mt-10">
      <div className="flex items-center gap-3">
        <h1 className="md:text-3xl text-xl text-gray-500 font-mono">
          DELIVERY <span className="font-bold text-black">INFORMATION</span>
        </h1>
        <div className="md:w-30 w-20 h-0.5 bg-black"></div>
      </div>

      <div className="w-full md:w-[90%] grid grid-cols-1 md:grid-cols-2 gap-20">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex gap-5 flex-col mt-10">
          {/* First Name and Last Name */}
          <div className="w-full flex gap-2">
            <div className="w-1/2">
              <input
                {...register("firstName")}
                className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
                type="text"
                placeholder="First Name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                {...register("lastName")}
                className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
                type="text"
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="email"
              placeholder="Email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Street */}
          <div>
            <input
              {...register("street")}
              className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="text"
              placeholder="Street"
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
            )}
          </div>

          {/* City and State */}
          <div className="w-full flex gap-2">
            <div className="w-1/2">
              <input
                {...register("city")}
                className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
                type="text"
                placeholder="City"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                {...register("state")}
                className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
                type="text"
                placeholder="State"
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
              )}
            </div>
          </div>

          {/* Zipcode and Country */}
          <div className="w-full flex gap-2">
            <div className="w-1/2">
              <input
                {...register("zipcode")}
                className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
                type="text"
                placeholder="Zipcode"
              />
              {errors.zipcode && (
                <p className="text-red-500 text-sm mt-1">{errors.zipcode.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <input
                {...register("country")}
                className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
                type="text"
                placeholder="Country"
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <input
              {...register("phone")}
              className="w-full border border-gray-300 outline-0 px-3 py-2 rounded-md placeholder:text-gray-400 text-gray-600"
              type="tel"
              placeholder="Phone"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </form>

        {/* Cart Totals and Payment */}
        <div className="mt-5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl text-gray-500 font-mono">
              CART <span className="font-bold text-gray-600">TOTALS</span>
            </h1>
            <div className="md:w-30 w-20 h-0.5 bg-black"></div>
          </div>

          <div className="flex justify-between items-center mt-5">
            <div className="text-sm text-gray-500">Subtotal</div>
            <div className="text-md font-bold text-black mb-2">
              ${getCartTotal().toFixed(2)}
            </div>
          </div>
          <hr className="text-gray-300" />
          
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500">Shipping</div>
            <div className="text-md font-bold text-black mb-2">Free</div>
          </div>
          <hr className="text-gray-300" />
          
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-md font-bold text-black mb-2">
              ${getCartTotal().toFixed(2)}
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center gap-3">
              <h1 className="text-md text-gray-500 font-mono">
                PAYMENT <span className="font-bold text-gray-600">METHOD</span>
              </h1>
              <div className="md:w-30 w-20 h-0.5 bg-black"></div>
            </div>

            <div className="flex gap-5 mt-5">
              <button
                type="button"
                onClick={() => setPaymentMethod("online")}
                className={`px-5 py-2 rounded-md transition ${
                  paymentMethod === "online"
                    ? "bg-black text-white"
                    : "border border-gray-300 text-gray-600"
                }`}
              >
                ONLINE
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`px-5 py-2 rounded-md transition ${
                  paymentMethod === "cod"
                    ? "bg-black text-white"
                    : "border border-gray-300 text-gray-600"
                }`}
              >
                CASH
              </button>
            </div>

            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition"
              >
                {isSubmitting ? "Placing Order..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
