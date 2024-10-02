import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

//validation schema- defining rules for Signup form
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

//state setup - remembering whats happening
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    console.log("Signup Data:", data);

    setTimeout(() => {
      setLoading(false);
      alert("Signup successful!");
    }, 1500);
  };

  return (
    //rendering the Sign up form
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-5">Sign Up</h2>

        {/*Username Field */}
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
            }rounded`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/*Email Field */}
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
            }rounded`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/*password field*/}
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

        {/* Confirm password field*/}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-bold mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
              className={`w-full p-2 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button*/}
        <button
          type="submit"
          className={`w-full py-2 rounded ${
            loading ? "bg-gray-400" : "bg-blue-500"
          } text-white hover:bg-blue-600`}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Register;
