import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${serverUrl}/api/v1/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("Register error: ", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 text-white body-font bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#042F2E]">
      <form
        onSubmit={handleSubmit}
        className="lg:w-2/6 md:w-1/2 w-full bg-[#090F0F] text-white rounded-2xl p-8 mt-10 border border-white/10 shadow-2xl shadow-black/30"
      >
        <h2 className="text-2xl text-center font-semibold mb-2 text-white">
          Create Account
        </h2>

        <p className="text-center text-sm text-gray-400 mb-7">
          Create your account and start your journey
        </p>

        <div className="relative mb-5">
          <label
            htmlFor="full-name"
            className="leading-7 text-sm text-gray-300"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-[#172323] border border-[#29413F] rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/30 text-white placeholder-gray-500 text-base outline-none py-2 px-4 leading-8 transition-all duration-200"
          />
        </div>
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
            placeholder="email@example.com"
            className="w-full bg-[#172323] border border-[#29413F] rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/30 text-white placeholder-gray-500 text-base outline-none py-2 px-4 leading-8 transition-all duration-200"
          />
        </div>
        <div className="relative mb-6">
          <label htmlFor="password" className="leading-7 text-sm text-gray-300">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-[#172323] border border-[#29413F] rounded-lg focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/30 text-white placeholder-gray-500 text-base outline-none py-2 px-4 leading-8 transition-all duration-200"
          />
        </div>
        <button
          disabled={loading}
          className="w-full text-white bg-[#0D9488] border-0 py-3 px-8 focus:outline-none hover:bg-[#0F766E] rounded-lg text-base font-semibold transition-all duration-300 shadow-lg shadow-[#0D9488]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait..." : "Create Account"}
        </button>
        <p className="text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-[#2DD4BF] hover:text-[#5EEAD4] font-semibold transition-colors"
          >
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
