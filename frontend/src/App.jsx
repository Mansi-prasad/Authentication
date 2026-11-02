import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import VerifyOtp from "./pages/VerifyOtp";
import Loading from "./components/Loading";
import { AppData } from "./context/AppContext";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

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
              path="/forgot-password"
              element={isAuth ? <Home /> : <ForgotPassword />}
            />
            <Route
              path="/reset-password/:token"
              element={isAuth ? <Home /> : <ResetPassword />}
            />
            <Route
              path="/token/:token"
              element={isAuth ? <Home /> : <Verify />}
            />
            <Route
              path="/dashboard"
              element={isAuth ? <Dashboard /> : <Login />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
