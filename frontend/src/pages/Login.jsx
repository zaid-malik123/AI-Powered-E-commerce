import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginform } from "../validator/formValidator";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "../redux/features/userSlice";
import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(loginform)
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/login`,
        data,
        { withCredentials: true }
      );
      dispatch(setUser(res.data));
      dispatch(setLoading(true))

      // merge guest cart
      try {
        const stored = localStorage.getItem("guestCart");
        if (stored) {
          const items = JSON.parse(stored);
          for (const item of items) {
            await axios.post(
              `${import.meta.env.VITE_BASE_URL}/api/cart/add`,
              { productId: item.productId, quantity: item.quantity },
              { withCredentials: true }
            );
          }
          localStorage.removeItem("guestCart");
        }
      } catch (err) {
        console.error("Error merging guest cart on login", err);
      }

      const dest = location.state?.from || "/";
      const extraState = {};
      if (location.state?.checkoutData) {
        extraState.checkoutData = location.state.checkoutData;
      }
      navigate(dest, { state: extraState });
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message, { toastId: "login-error" });
    }
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center mt-10">
      <div className="flex items-center gap-3">
        <span className="text-3xl text-gray-500 font-serif">Login</span>
        <div className="w-[50px] h-[2px] bg-black"></div>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-5 md:w-[400px]"
      >
        {/* EMAIL */}
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          })}
          className="px-5 py-3 outline-0 border border-gray-400 text-sm rounded-md"
          type="email"
          placeholder="Enter Email"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}

        {/* PASSWORD */}
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="px-5 py-3 outline-0 border border-gray-400 text-sm rounded-md"
          type="password"
          placeholder="Enter Password"
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}

        <p onClick={() => navigate("/forgot-password")} className="text-sm text-gray-700 cursor-pointer hover:underline">Forgot Password ?</p>

        {/* SIGNUP LINK */}
        <p
          onClick={() => navigate("/signup")}
          className="text-right text-sm font-[200] cursor-pointer"
        >
          Would you create an Account?{" "}
          <span className="text-black font-semibold">SignUp</span>
        </p>

        {/* BUTTON */}
        <button
          type="submit"
          className="px-5 py-2 bg-black rounded-md text-white hover:bg-gray-800"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
