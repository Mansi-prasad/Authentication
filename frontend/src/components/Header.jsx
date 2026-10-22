import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppData } from "../context/AppContext";

const Header = () => {
  const { logoutUser } = AppData();
  const navigate = useNavigate();
  return (
    <header class="text-gray-600 body-font">
      <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <span class="ml-3 text-xl">Auth</span>
        </Link>
        <nav class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          <Link to="/" class="mr-5 hover:text-gray-900">
            First Link
          </Link>
          <Link to="/" class="mr-5 hover:text-gray-900">
            Second Link
          </Link>
          <Link to="/" class="mr-5 hover:text-gray-900">
            Third Link
          </Link>
          <Link to="/" class="mr-5 hover:text-gray-900">
            Fourth Link
          </Link>
        </nav>
        <button
          onClick={() => logoutUser(navigate)}
          class="text-white inline-flex items-center bg-red-500 border-0 py-1 px-3 focus:outline-none hover:bg-red-600 rounded text-base mt-4 md:mt-0"
        >
          Logout
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
