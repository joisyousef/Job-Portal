import React from "react";
import assets from "../assets/assets";

const AppDownload = () => {
  return (
    <div className="container px-4 2xl:px-20 mx-auto my-24">
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-500 to-purple-600 p-12 sm:p-16 lg:p-24 rounded-2xl shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 max-w-lg text-white leading-tight">
            Download Our Mobile App For Better Experience
          </h1>
          <p className="text-violet-100 mb-10 max-w-md text-lg">
            Get access to exclusive features and a seamless experience on your
            mobile device.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <a
              href="#"
              className="inline-block transform hover:scale-105 transition-transform duration-300"
            >
              <img
                className="h-14 rounded-lg shadow-md"
                src={assets.play_store}
                alt="Play Store"
              />
            </a>
            <a
              href="#"
              className="inline-block transform hover:scale-105 transition-transform duration-300"
            >
              <img
                className="h-14 rounded-lg shadow-md"
                src={assets.app_store}
                alt="App Store"
              />
            </a>
          </div>
        </div>

        {/* Abstract shapes for visual interest */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mt-16 -mr-16"></div>
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white opacity-10 rounded-full -mb-10"></div>

        {/* Mobile phone image */}
        <div className="hidden lg:block absolute right-16 bottom-0">
          <div className="relative h-96 w-48">
            <div className="absolute inset-0 bg-black rounded-3xl shadow-2xl transform -rotate-6"></div>
            <div className="absolute inset-1 bg-gray-800 rounded-3xl overflow-hidden transform -rotate-6">
              {/* Phone screen content */}
              <div className="h-full w-full bg-gradient-to-br from-purple-400 to-violet-300 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-12 h-12 rounded-full bg-white mx-auto mb-2"></div>
                  <div className="w-16 h-1 bg-white mx-auto mb-2"></div>
                  <div className="w-12 h-1 bg-white mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
