import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-0 mx-auto flex justify-between items-center relative">
        {/* Logo on the left */}
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer h-10 sm:h-14"
          src={assets.logo}
          alt="Logo"
        />

        {/* Centered Create Resume button */}
        {user && (
          <Link
            to="/create-resume"
            className="absolute left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-full"
          >
            Create Resume
          </Link>
        )}

        {/* Right-side controls */}
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/applications" className="text-gray-800 hover:underline">
              Applied Jobs
            </Link>

            <p>|</p>

            <p className="max-sm:hidden">
              Hi, {user.firstName + " " + user.lastName}
            </p>

            <UserButton />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button className="text-gray-600">Recruiter Login</button>
            <button
              onClick={openSignIn}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
