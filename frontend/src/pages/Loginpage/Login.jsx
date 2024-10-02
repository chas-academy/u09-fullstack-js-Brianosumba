import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema - defining rules for the form
const schema = yup.object().shape({
  email: yup
    .string()
    .email("invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

//state setup - remembering whats happening
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  //form management - handling input data
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  //form submission handler - when submit has been clicked upon
  const onSubmit = (data) => {
    setLoading(true);
    console.log("Login Data:", data);

    //simulating an API call with a timeout
    setTimeout(() => {
      setLoading(false);
      alert("Login successful!");
    }, 1500);
  };

  //Rendering the login form
  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: "#1a2734" }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        style={{ backgroundColor: "#f5f7fa", borderColor: "#1b2a4e" }}
      >
        <h2 className="text-2xl font-bold mb-5" style={{ color: "#1b2a4e" }}>
          Login
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 font-bold"
            style={{ color: "#1b2a4e" }}
          >
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
            className="block mb-2 font-bold"
            style={{ color: "#1b2a4e" }}
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

        {/* Remember Me checkbox */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            <span style={{ color: "#1b2a4e" }}>Remember me</span>
          </label>
        </div>

        {/* Forgot Password link */}
        <div className="mb-4 text-right">
          <a
            href="/forgot-password"
            className="hover:underline"
            style={{ color: "#3498db" }}
          >
            Forgot Password
          </a>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-900"
          } hover:bg-blue-700`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Sign-up link */}
        <div className="mt-4 text-center">
          <p style={{ color: "#1b2a4e" }}>
            Don’t have an account yet?
            <a
              href="/register"
              className="ml-1 hover:underline"
              style={{ color: "#3498db" }}
            >
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
