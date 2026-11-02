import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(`${serverUrl}/api/v1/forgot-password`, {
        email: email.trim().toLowerCase(),
      });

      toast.success(data.message);
      setEmailSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 text-white bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#042F2E]">
      <div className="lg:w-2/6 md:w-1/2 w-full bg-[#090F0F] text-white rounded-2xl p-8 border border-white/10 shadow-2xl shadow-black/30">
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
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold mb-2">Forgot Password?</h2>

          <p className="text-sm text-gray-400">
            {emailSent
              ? "Check your inbox for the password reset link."
              : "Don't worry! Enter your registered email address and we'll send you a password reset link."}
          </p>
        </div>

        {!emailSent ? (
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm text-gray-300 mb-2"
              >
                Email Address
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full bg-[#172323] border border-[#29413F] rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/30 text-white placeholder-gray-500 text-base outline-none py-3 px-4 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-[#0D9488] py-3 px-8 hover:bg-[#0F766E] rounded-lg text-base font-semibold transition-all duration-300 shadow-lg shadow-[#0D9488]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300">
                If your email is registered, a password reset link has been
                sent. The link will expire in 5 minutes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEmailSent(false)}
              className="text-[#2DD4BF] hover:text-[#5EEAD4] text-sm font-semibold"
            >
              Try another email
            </button>
          </div>
        )}

        <div className="text-center mt-7">
          <Link
            to="/login"
            className="text-sm text-[#2DD4BF] hover:text-[#5EEAD4] font-semibold transition-colors"
          >
            {" "}
            <FaArrowLeft />
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
