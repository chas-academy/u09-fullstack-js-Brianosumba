import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ForgotPasswordModal from "../../components/ForgotPaswordModal"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/store";

// Validation schema for form input
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
  const { login } = useAuthStore(); // Zustand's login action
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [loading, setLoading] = useState(false); // Loading state during form submission
  const [rememberMe, setRememberMe] = useState(false); // Checkbox for "Remember Me"
  const [showModal, setShowModal] = useState(false); // State for Forgot Password modal
  const navigate = useNavigate(); // Navigation hook

  // Form management with react-hook-form
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
      // Send login request to the backend
      const success = await login(data.email, data.password);
      if (success) {
        navigate("/userpage");
      } else {
        alert("Login failed. Please check your credentials");
      }
    } catch (error) {
      console.error(error.message);
      alert(`${error.message || "Please try again."}`);
    } finally {
      setLoading(false); // Stop loading state once the request completes
    }
  };

  return (
    <div className="flex items-center justify-center h-screen  ">
      <h1>LOGIN MY FRIEND</h1>
      <form
        onSubmit={handleSubmit(onSubmit)} // Use handleSubmit from react-hook-form
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 text-black"
      >
        <h2 className="text-2xl font-bold mb-5 text-center text-navy">Login</h2>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")} // Controlled by react-hook-form
            className={`w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              id="password"
              {...register("password")} // Controlled by react-hook-form
              className={`w-full p-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle state
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
              onChange={(e) => setRememberMe(e.target.checked)} // Track checkbox state
              className="mr-2"
            />
            Remember me
          </label>
        </div>

        {/* Forgot Password Link */}
        <div className="mb-4 text-right">
          <button
            type="button"
            onClick={() => setShowModal(true)} // Show modal when clicked
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
          disabled={loading} // Disable button when loading
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
        onClose={() => setShowModal(false)} // Close modal
      />
    </div>
  );
};

export default Login;
