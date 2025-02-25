import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ForgotPasswordModal from "../../components/ForgotPaswordModal"; // Ensure path is correct
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/store";
import { loginWithCredentials, offlineLogin } from "../../services/authService";

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
  const [error, setError] = useState(""); // State for login error message
  const navigate = useNavigate(); // Navigation hook

  // Form management with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Form submission handler with offline support
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      let userData;

      if (!navigator.onLine) {
        console.warn(" Offline mode detected: Trying offline login...");
        userData = await offlineLogin(); //  Use offline login if offline
      } else {
        console.log("Online mode: Sending login request...");
        userData = await loginWithCredentials(data.email, data.password); //  Normal login when online
      }

      console.log(" Login successful:", userData);
      alert("Login successful!");
      navigate("/userpage");
    } catch (err) {
      console.error(" Login error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
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
            {...register("email")}
            className={`w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded`}
            required
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
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password")}
              className={`w-full p-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded`}
              required
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
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            Remember me
          </label>
        </div>

        {/* Forgot Password Link */}
        <div className="mb-4 text-right">
          <button
            type="button"
            onClick={() => setShowModal(true)}
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

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-2">❌ {error}</p>}

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
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Login;
