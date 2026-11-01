import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { serverUrl } from "../App";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

const Verify = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const params = useParams();

  async function verifyUser() {
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/v1/verify/${params.token}`,
      );

      setSuccessMsg(data.message);
    } catch (error) {
      console.log("error: ", error);
      setErrorMessage(error?.response?.data?.message || "Email verification failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    verifyUser();
  }, []);
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#042F2E] text-white">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-md bg-[#090F0F] rounded-2xl p-8 text-center border border-white/10 shadow-2xl shadow-black/30">
          {successMsg ? (
            <>
              <FaCheckCircle className="text-[#2DD4BF] text-6xl mx-auto mb-5" />
              <h2 className="text-2xl font-semibold text-white mb-3">
                Email Verified!
              </h2>
              <p className="text-gray-400 text-sm leading-6 mb-7">
                {successMsg}
              </p>
              <Link
                to="/login"
                className="inline-block w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-[#0D9488]/20"
              >
                Continue to Login
              </Link>
            </>
          ) : (
            <>
              <FaTimesCircle className="text-red-400 text-6xl mx-auto mb-5" />

              <h2 className="text-2xl font-semibold text-white mb-3">
                Verification Failed
              </h2>

              <p className="text-gray-400 text-sm leading-6 mb-7">
                {errorMessage}
              </p>

              <Link
                to="/register"
                className="inline-block w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Back to Register
              </Link>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default Verify;
