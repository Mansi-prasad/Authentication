import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { AppData } from "../context/AppContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState("");
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const { setIsAuth, setUser } = AppData();

  // verify otp
  const submitHandler = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${serverUrl}/api/v1/verify`,
        { email, otp },
        { withCredentials: true },
      );

      toast.success(data.message);
      setIsAuth(true);
      setUser(data.user);
      localStorage.clear("email");
      navigate("/");
    } catch (error) {
      console.log("otp verification error: ", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // resend otp
  const resendOtpHandler = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("Email not found. Please register again.");
      return;
    }

    try {
      setResending(true);
      const { data } = await axios.post(
        `${serverUrl}/api/v1/send-otp`,
        { email },
        { withCredentials: true },
      );
      toast.success(data.message);
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 text-white body-font bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#042F2E]">
      <div className="w-full flex items-center justify-center">
        <form
          onSubmit={submitHandler}
          className="lg:w-2/6 md:w-1/2 w-full bg-[#090F0F] text-white rounded-2xl p-8 mt-10 border border-white/10 shadow-2xl shadow-black/30"
        >
          <h2 className="text-2xl text-center font-semibold mb-2 text-white">
            Verify Your Email
          </h2>
          <p className="text-center text-sm text-gray-400 mb-7">
            Enter the OTP sent to your email address
          </p>
          <div className="relative mb-6">
            <label htmlFor="otp" className="leading-7 text-sm text-gray-300">
              One-Time Password (OTP)
            </label>
            <input
              type="number"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter OTP here..."
              className="w-full bg-[#172323] border border-[#29413F] rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/30 text-white placeholder-gray-500 text-base outline-none py-2 px-4 leading-8 transition-all duration-200"
            />
          </div>
          <button
            disabled={loading}
            className="w-full text-white bg-[#0D9488] border-0 py-3 px-8 focus:outline-none hover:bg-[#0F766E] rounded-lg text-base font-semibold transition-all duration-300 shadow-lg shadow-[#0D9488]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : "Verify OTP"}
          </button>
          <p className="text-sm text-gray-400 mt-6 text-center">
            Didn't receive the OTP?{" "}
            <button
              type="button"
              onClick={resendOtpHandler}
              disabled={resending}
              className="text-[#2DD4BF] hover:text-[#5EEAD4] font-semibold cursor-pointer transition-colors disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </p>
          {/* make it functional */}
          <p className="text-sm text-gray-400 mt-4 text-center">
            Go to login page?{" "}
            <Link
              to={"/login"}
              className="text-[#2DD4BF] hover:text-[#5EEAD4] font-semibold transition-colors"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default VerifyOtp;
