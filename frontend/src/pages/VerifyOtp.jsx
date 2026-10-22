import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { serverUrl } from "../App";
import { toast } from "react-toastify";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    try {
      setLoading(true);
      const {data} = await axios.post(`${serverUrl}/api/v1/verify`, {email, otp}, {withCredentials: true})

      toast.success(data.message);
      localStorage.clear("email");
    } catch (error) {
      console.log("otp verification error: ", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <form
          onSubmit={submitHandler}
          className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0"
        >
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
            Verify using OTP
          </h2>
          <div className="relative mb-4">
            <label htmlFor="otp" className="leading-7 text-sm text-gray-600">
              OTP
            </label>
            <input
              type="number"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            disabled={loading}
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          >
            {loading ? "Please wait..." : "Verify OTP"}
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Go to login page. <Link to={"/login"}>login</Link>
          </p>
          {/* make it functional */}
          <p>Resend OTP..</p> 
        </form>
      </div>
    </section>
  );
};

export default VerifyOtp;
