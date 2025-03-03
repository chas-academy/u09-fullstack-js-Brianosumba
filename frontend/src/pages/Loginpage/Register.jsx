import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth/useAuthStore"; //  Zustand import

//  Validation Schema
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

const Register = () => {
  const { register: registerUser } = useAuthStore(); //  Zustand's register action
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Error message state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  //  Form Submission Handler
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      console.log(" Registering user...");

      //  Call Zustand's `registerUser` action
      const response = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (!response.success) {
        setError(response.message || "Registration failed. Please try again.");
        return;
      }

      console.log(" Registration successful:", response);

      //  Redirect Based on User Role
      if (response.isAdmin) {
        navigate("/admin-dashboard"); // Admin Redirect
      } else {
        navigate("/userpage"); // Normal User Redirect
      }
    } catch (err) {
      console.error(" Registration error:", err.message || err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 text-black"
      >
        <h2 className="text-2xl font-bold mb-5 text-center text-navy">
          Sign Up
        </h2>

        {/*  Username Input */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username")}
            className={`w-full p-2 border ${
              errors.username ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/*  Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className={`w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/*  Password Input */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className={`w-full p-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-bold mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
            className={`w-full p-2 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/*  Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 rounded ${
            loading ? "bg-gray-400" : "bg-blue-500"
          } text-white hover:bg-blue-600`}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/*  Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">❌ {error}</p>}

        {/* Login Redirect */}
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Already have an account?
            <a href="/login" className="text-blue-500 hover:underline ml-1">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
