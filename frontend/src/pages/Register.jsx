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
    <section className=" flex items-center justify-center text-gray-600 body-font">
      <form
        onSubmit={handleSubmit}
        className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 w-full mt-10"
      >
        <h2 className="text-gray-900 text-center text-lg font-medium title-font mb-5">
          Sign Up
        </h2>
        <div className="relative mb-4">
          <label
            htmlFor="full-name"
            className="leading-7 text-sm text-gray-600"
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
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4">
          <label htmlFor="email" className="leading-7 text-sm text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <div className="relative mb-4">
          <label htmlFor="password" className="leading-7 text-sm text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          />
        </div>
        <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
          {loading ? "Please wait..." : "Register"}
        </button>
        <p className="text-xs text-gray-500 mt-3">
          Already have an account? <Link to={"/login"} className="font-semibold text-blue-500 hover:text-blue-600">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
