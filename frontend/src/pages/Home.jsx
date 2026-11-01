import React from "react";
import Header from "../components/Header";
import { AppData } from "../context/AppContext";
import { Link } from "react-router-dom";
const Home = () => {
  const { user } = AppData();

  return (
    <>
      <Header />
      <main className="min-h-screen px-4 py-10 ">
        <h1 className="text-3xl font-bold">Welcome to Home Page!</h1>
        <p className="mt-4">Your email has been successfully verified.</p>
        {user && user.role === "admin" && (
          <Link to="/dashboard" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4 inline-block">
            Go to dashboard
          </Link>
        )}
      </main>
    </>
  );
};

export default Home;
