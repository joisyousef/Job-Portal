import React from "react";
import { Link } from "react-router-dom"; // Added import for Link
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-0 mx-auto flex justify-between items-center">
        <img src={assets.logo} alt="Logo" />
        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/applications">Applied Jobs</Link>
            <p>|</p>
            <p>Hi, {user.firstName + " " + user.lastName}</p>
            <UserButton />
          </div>
        ) : (
          <div>
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
