import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
      <div className="container mx-auto px-6">
        {/* Top divider with accent color */}
        <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 mb-12 rounded-full"></div>

        <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold">
                Job Portal
              </h2>
            </div>
            <p className="text-lg text-gray-300 max-w-xs">
              Your gateway to the best jobs and career opportunities worldwide.
            </p>

            {/* Newsletter signup */}
            <div className="mt-6 flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              />
              <button className="bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-r-lg mt-2 sm:mt-0">
                Subscribe
              </button>
            </div>
          </div>

          {/* Navigation Links - Middle */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-400">Company</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-400">Legal</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons - Right */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-bold mb-4 text-blue-400">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-700 p-3 rounded-full hover:bg-blue-600 transition-all transform hover:scale-110"
              >
                <img
                  src={assets.facebook_icon}
                  alt="Facebook"
                  className="h-5 w-5"
                />
              </a>
              <a
                href="#"
                className="bg-gray-700 p-3 rounded-full hover:bg-blue-600 transition-all transform hover:scale-110"
              >
                <img
                  src={assets.twitter_icon}
                  alt="Twitter"
                  className="h-5 w-5"
                />
              </a>
              <a
                href="#"
                className="bg-gray-700 p-3 rounded-full hover:bg-blue-600 transition-all transform hover:scale-110"
              >
                <img
                  src={assets.instagram_icon}
                  alt="Instagram"
                  className="h-5 w-5"
                />
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              © 2025 Job Portal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
