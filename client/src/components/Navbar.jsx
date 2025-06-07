import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { UserButton } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    showRecruiterLogin,
    setShowRecruiterLogin,
    showUserLogin,
    setShowUserLogin,
    companyData,
    userData,
  } = useContext(AppContext);

  // Determine authentication states
  const isRecruiterLoggedIn = Boolean(companyData);
  const isUserLoggedIn = Boolean(userData);

  return (
    <div className="shadow-md py-4 bg-white border-b border-gray-100">
      <div className="container px-4 2xl:px-0 mx-auto flex justify-between items-center relative">
        {/* Logo on the left */}
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer h-10 sm:h-14 hover:scale-105 transition duration-300"
          src={assets.logo}
          alt="Logo"
        />

        {/* Center Create Resume button for logged-in users */}
        {isUserLoggedIn && (
          <Link
            to="/create-resume"
            className="absolute left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow-sm hover:shadow-md transition duration-300"
          >
            Create Resume
          </Link>
        )}

        {/* Right-side controls */}
        <div className="flex items-center gap-4">
          {isUserLoggedIn ? (
            <>
              <Link
                to="/applications"
                className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
              >
                Applied Jobs
              </Link>

              <div className="h-5 w-px bg-gray-300"></div>

              <p className="max-sm:hidden text-gray-700 font-medium">
                Hi, {userData.name}
              </p>
            </>
          ) : (
            <button
              onClick={() => setShowUserLogin(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300 font-medium shadow-sm hover:shadow-md"
            >
              User Login
            </button>
          )}

          {isRecruiterLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition duration-300 font-medium"
              >
                Dashboard
              </Link>

              <div className="h-5 w-px bg-gray-300"></div>

              <p className="max-sm:hidden text-gray-700 font-medium">
                {companyData.name}
              </p>
            </>
          ) : (
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="text-gray-600 cursor-pointer hover:text-blue-600 transition duration-300 hidden sm:block font-medium"
            >
              Recruiter Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
