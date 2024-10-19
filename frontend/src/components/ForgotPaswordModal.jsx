import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import axios from "axios";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  // Validation schema for the modal form
  const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
    newPassword: yup
      .string()
      .min(4, "Password must be at least 4 characters")
      .required("New Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Form management
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Form submission handler
  const onSubmit = async (data) => {
    console.log("Password Reset Data:", data);

    try {
      //Send a request to the backend to reset the password
      const response = await axios.post(
        "http://localhost:3000/api/auth/reset-password",
        {
          username: data.username,
          newPassword: data.newPassword,
        }
      );

      if (response.data.success) {
        alert("Password reset successfully!");
        onClose(); //close the modal after successful reset
      } else {
        alert(
          `Password reset failed: ${
            response.data.message || "Please try again"
          }`
        );
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred while resetting the password.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative">
        <h2 id="modal-title" className="text-2xl font-bold mb-5 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="username"
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

          {/* New Password Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              {...register("newPassword")}
              className={`w-full p-2 border ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="confirmPassword"
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

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ${
              isSubmitting && "opacity-50 cursor-not-allowed"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
          aria-label="Close modal"
        >
          X
        </button>
      </div>
    </div>
  );
};

// Adding PropTypes validation
ForgotPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Ensures isOpen is a boolean and required
  onClose: PropTypes.func.isRequired, // Ensures onClose is a function and required
};
export default ForgotPasswordModal;
