import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {signupform} from "../validator/formValidator"
import axios from "axios"
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit", // validation submit par hogi
    resolver: zodResolver(signupform)   
  });

  const formData = async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/signup`, data, {withCredentials:true} )
    dispatch(setUser(res.data))
    // yaha API call aayegi future me
  };

  return (
    <div className="flex flex-col gap-5 items-center justify-center mt-10">
      <div className="flex items-center gap-3">
        <span className="text-3xl text-gray-500 font-serif">SignUp</span>
        <div className="w-[50px] h-[2px] bg-black"></div>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(formData)}
        className="w-full flex flex-col gap-5 md:w-[400px]"
      >
        {/* NAME */}
        <input
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters",
            },
          })}
          className="px-5 py-3 outline-0 border border-gray-400 text-sm rounded-md"
          type="text"
          placeholder="Enter Name"
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}

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
        <p onClick={() => navigate("/login")} className="text-right text-sm font-[200]">Already have an Account ? <span className="text-black font-semibold">Login</span></p>
        {/* BUTTON */}
        <button
          type="submit"
          className="px-5 py-2 bg-black rounded-md text-white hover:bg-gray-800"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default Signup;
