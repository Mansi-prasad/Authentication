import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${serverUrl}/api/v1/reset-password/${token}`,
        {
          password,
          confirmPassword,
        },
      );

      toast.success(data.message);

      setPassword("");
      setConfirmPassword("");

      // Redirect to login after successful password reset
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 text-white bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#042F2E]">
      <div className="lg:w-2/6 md:w-1/2 w-full bg-[#090F0F] rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/30">
        {/* heading */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0D9488]/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2DD4BF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold mb-2 text-white">
            Reset Password
          </h2>

          <p className="text-sm text-gray-400">
            Create a new password for your account.
          </p>
        </div>

        <form onSubmit={submitHandler}>
          {/* New password */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm text-gray-300 mb-2"
            >
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Enter new password"
                className="w-full bg-[#172323] border border-[#29413F] rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/30 text-white placeholder-gray-500 text-base outline-none py-3 px-4 pr-16 transition-all duration-200"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#2DD4BF] hover:text-[#5EEAD4]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm text-gray-300 mb-2"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Confirm new password"
                className="w-full bg-[#172323] border border-[#29413F] rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/30 text-white placeholder-gray-500 text-base outline-none py-3 px-4 pr-16 transition-all duration-200"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#2DD4BF] hover:text-[#5EEAD4]"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-[#0D9488] py-3 px-8 hover:bg-[#0F766E] rounded-lg text-base font-semibold transition-all duration-300 shadow-lg shadow-[#0D9488]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-7">
          <Link
            to="/login"
            className="text-sm text-[#2DD4BF] hover:text-[#5EEAD4] font-semibold transition-colors"
          >
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};
export default ResetPassword;
