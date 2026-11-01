import React, { useState, useEffect } from "react";
import api from "../apiIntercepter";
import { toast } from "react-toastify";
const Dashboard = () => {
  const [content, setContent] = useState("");
  async function fetchAdminData() {
    try {
      const { data } = await api.get(`/api/v1/admin`, {
        withCredentials: true,
      });
      setContent(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <>
      {content && <div className="text-lg font-semibold p-4 bg-blue-100 text-blue-800 rounded">{content}</div>}

      <div className="mt-6 p-4 bg-green-100 text-green-800 rounded">
        <p className="font-semibold">Admin Access:</p>
        <p>
          You have admin privileges. You can access the admin dashboard and
          manage users.
        </p>
      </div>
    </>
  );
};

export default Dashboard;
