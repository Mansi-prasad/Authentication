import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import Loading from "../components/Loading";

const Verify = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const params = useParams();

  async function verifyUser() {
    try {
      const { data } = await axios.post(`${serverUrl}/api/v1/verify/${params.token}`);

      setSuccessMsg(data.message);
    } catch (error) {
      console.log("error: ", error);
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    verifyUser();
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-[200px] m-auto mt-18">
          {successMsg && <p className="text-green-600 text-xl">{successMsg}</p>}
          {errorMessage && (
            <p className="text-red-600 text-xl">{errorMessage}</p>
          )}
        </div>
      )}
    </>
  );
};

export default Verify;
