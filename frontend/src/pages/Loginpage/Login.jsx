import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ForgotPasswordModal from "../../components/ForgotPaswordModal"; // corrected typo
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/store";

// Validation schema - defining rules for the form
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

const Login = () => {
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showModal, setShowModal] = useState(false); // corrected state
  const navigate = useNavigate(); //Hook to programmatically navigate

  // Form management
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Form submission handler
  const onSubmit = async (data) => {
    setLoading(true); // Start loading state when submission begins

    try {
      // Call the login function from authService with the email and password from data
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      console.log("Login successful:", response.data); // Log successful response data

      // Save the token to localStorage (if returned)
      localStorage.setItem("token", response.data.token); // Adjust the key according to your backend response
      login(response.data.user.username); // Use zustand login action

      // Redirect user after successful login to userpage
      navigate("/userpage");

      alert("Login successful!");
    } catch (error) {
      console.error("Login failed:", error.response.data);
      alert(
        `Login failed: ${error.response.data.message || "Please try again."}`
      ); // Display error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Rendering the login form
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4"
      >
        <h2 className="text-2xl font-bold mb-5 text-center text-navy">Login</h2>

        {/* Email Field */}
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

        {/* Password Field */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password")}
              className={`w-full p-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            Remember me
          </label>
        </div>

        {/* Forgot Password Link */}
        <div className="mb-4 text-right">
          <button
            type="button"
            onClick={() => setShowModal(true)} // Show modal on click
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 rounded ${
            loading ? "bg-gray-400" : "bg-blue-500"
          } text-white hover:bg-blue-600`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Don&#39;t have an account yet?
            <a href="/register" className="text-blue-500 hover:underline ml-1">
              Sign up
            </a>
          </p>
        </div>
      </form>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showModal}
        onClose={() => setShowModal(false)} // Hide modal on close
      />
    </div>
  );
};

export default Login;
