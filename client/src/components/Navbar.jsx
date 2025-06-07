import { React, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <nav className="backdrop-blur-sm bg-white/95 shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container px-6 2xl:px-0 mx-auto">
        <div className="flex justify-between items-center h-16 sm:h-20 relative">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <img
              onClick={() => navigate("/")}
              className="cursor-pointer h-8 sm:h-12 hover:scale-110 transition-all duration-300 drop-shadow-sm"
              src={assets.logo}
              alt="Logo"
            />
          </div>

          {/* Center Action Button */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/create-resume"
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-sm sm:text-base">Create Resume</span>
            </Link>
          </div>

          {/* Right Navigation */}
          {user ? (
            <div className="flex items-center gap-6">
              <Link
                to="/applications"
                className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="hidden sm:inline">Applied Jobs</span>
              </Link>

              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

              <div className="flex items-center gap-3">
                <div className="max-sm:hidden">
                  <p className="text-gray-700 font-medium text-sm">
                    Hi,{" "}
                    <span className="text-blue-600 font-semibold">
                      {user.firstName}
                    </span>
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                  <div className="relative bg-white rounded-full p-0.5">
                    <UserButton />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setShowRecruiterLogin(true);
                }}
                className="group hidden sm:flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 font-medium text-sm"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
                Recruiter Login
              </button>

              <button
                onClick={openSignIn}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-sm sm:text-base">Login</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
