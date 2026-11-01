import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppData } from "../context/AppContext";
import { IoShieldCheckmark } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

const Header = () => {
  const { logoutUser } = AppData();
  const navigate = useNavigate();
  return (
    <header className="w-full p-2 bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#042F2E] flex flex-wrap items-center justify-between gap-5 shadow-xl">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-white group">
            <div className="text-[#2DD4BF] group-hover:scale-110 transition-transform duration-300">
              <IoShieldCheckmark size={42} strokeWidth={2.2} />
            </div>

            <span className="text-2xl md:text-3xl font-bold tracking-wide">
              Auth
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-5 md:gap-10 text-sm md:text-base font-medium">
            <Link
              to="/"
              className="text-[#2DD4BF] border-b-2 border-[#2DD4BF] pb-2 hover:text-white transition-colors"
            >
              Home
            </Link>

            <Link
              to="/"
              className="text-gray-200 hover:text-[#2DD4BF] transition-colors"
            >
              About
            </Link>

            <Link
              to="/"
              className="text-gray-200 hover:text-[#2DD4BF] transition-colors"
            >
              Features
            </Link>

            <Link
              to="/"
              className="text-gray-200 hover:text-[#2DD4BF] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Logout */}
          <button
            onClick={() => logoutUser(navigate)}
            className="flex items-center gap-3 bg-[#0D9488] hover:bg-[#0F766E] text-white font-semibold px-6 py-3 rounded-full border border-[#2DD4BF]/40 shadow-lg shadow-[#0D9488]/20 transition-all duration-300 hover:scale-105"
          >
            Logout
            <MdLogout size={21} />
          </button>
     </header>
  );
};

export default Header;
