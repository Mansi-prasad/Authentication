import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("login starts....");
      console.log("login url hits: ", `${serverUrl}/api/v1/login`);
      const { data } = await axios.post(`${serverUrl}/api/v1/login`, {
        email,
        password,
      });

      console.log("login data: ", data);
      toast.success(data.message);
      localStorage.setItem("email", email);
      
      // Redirect to OTP verification
      navigate("/verify-otp");
    } catch (error) {
      console.log("Login error: ", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 text-white body-font bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#042F2E]">
      <form
        onSubmit={submitHandler}
        className="lg:w-2/6 md:w-1/2 w-full bg-[#090F0F] text-white rounded-2xl p-8 mt-10 border border-white/10 shadow-2xl shadow-black/30"
      >
        <h2 className="text-2xl text-center font-semibold mb-2 text-white">
          Welcome Back
        </h2>

        <p className="text-center text-sm text-gray-400 mb-7">
          Sign in to continue your journey
        </p>
        <div className="relative mb-5">
          <label htmlFor="email" className="leading-7 text-sm text-gray-300">
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
            className="w-full bg-[#172323] border border-[#29413F] rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/30 text-white placeholder-gray-500 text-base outline-none py-2 px-4 leading-8 transition-all duration-200"
          />
        </div>
        <div className="relative mb-2">
          <label htmlFor="password" className="leading-7 text-sm text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="w-full bg-[#172323] border border-[#29413F] rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/30 text-white placeholder-gray-500 text-base outline-none py-2 px-4 leading-8 transition-all duration-200"
          />
        </div>

        <div className="flex justify-end mb-6">
          <Link
            to="/forgot-password"
            className="text-sm text-[#2DD4BF] hover:text-[#5EEAD4] transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          disabled={loading}
          className="w-full text-white bg-[#0D9488] border-0 py-3 px-8 focus:outline-none hover:bg-[#0F766E] rounded-lg text-base font-semibold transition-all duration-300 shadow-lg shadow-[#0D9488]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait..." : "Sign In"}
        </button>
        <p className="text-sm text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to={"/register"}
            className="text-[#2DD4BF] hover:text-[#5EEAD4] font-semibold transition-colors"
          >
            register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
