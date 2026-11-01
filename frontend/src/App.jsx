import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"
import { ToastContainer } from "react-toastify";
import VerifyOtp from "./pages/VerifyOtp";
import Loading from "./components/Loading";
import { AppData } from "./context/AppContext";
import Verify from "./pages/Verify";

export const serverUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const { isAuth, loading } = AppData();

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            <Route path="/register" element={isAuth ? <Home /> : <Register />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/verify-otp"
              element={isAuth ? <Home /> : <VerifyOtp />}
            />
            <Route
              path="/token/:token"
              element={isAuth ? <Home /> : <Verify />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
