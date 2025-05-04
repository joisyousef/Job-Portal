import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets/";
import { AppContext } from "../context/AppContext";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);

  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
    setIsSearched(true);
    console.log({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });
  };

  return (
    <div className="container 2xl:px-20 mx-auto my-10">
      {/* Main Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-700 via-purple-800 to-purple-900 text-white py-20 px-6 md:px-10 mx-2 rounded-2xl shadow-2xl overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-40 h-40 bg-purple-500 rounded-full opacity-10"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500 rounded-full opacity-10"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-pink-500 rounded-full opacity-10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Find Your <span className="text-purple-300">Dream Job</span> Today
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium mb-4">
            Over <span className="text-yellow-300">10,000+</span> jobs to apply
          </h2>
          <p className="mb-10 max-w-2xl mx-auto text-base md:text-lg font-light px-5 text-purple-100">
            Your Next Big Career Move Starts Right Here - Explore the Best Job
            Opportunities and Take the First Step Toward Your Future!
          </p>

          {/* Search Box */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow-lg text-gray-700 max-w-2xl mx-auto overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200 w-full">
              <img
                className="h-5 mr-3 text-gray-400"
                src={assets.search_icon}
                alt=""
              />
              <input
                type="text"
                placeholder="Search For Jobs"
                className="text-sm md:text-base p-2 outline-none w-full"
                ref={titleRef}
              />
            </div>
            <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200 w-full">
              <img
                className="h-5 mr-3 text-gray-400"
                src={assets.location_icon}
                alt=""
              />
              <input
                type="text"
                placeholder="Location"
                className="text-sm md:text-base p-2 outline-none w-full"
                ref={locationRef}
              />
            </div>
            <button
              onClick={onSearch}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-4 transition-all duration-300 w-full md:w-auto"
            >
              Search Jobs
            </button>
          </div>

          {/* Job Stats */}
          <div className="flex justify-center gap-8 mt-10 text-sm md:text-base">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500 bg-opacity-30 flex items-center justify-center mr-2">
                <span className="text-xl font-bold">✓</span>
              </div>
              <span>Verified Jobs</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500 bg-opacity-30 flex items-center justify-center mr-2">
                <span className="text-xl font-bold">⚡</span>
              </div>
              <span>Quick Apply</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500 bg-opacity-30 flex items-center justify-center mr-2">
                <span className="text-xl font-bold">🔍</span>
              </div>
              <span>Easy Search</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Companies */}
      <div className="border border-gray-200 shadow-lg mx-2 mt-8 p-8 rounded-xl bg-white">
        <h3 className="text-center font-semibold text-gray-500 mb-6">
          TRUSTED BY LEADING COMPANIES
        </h3>
        <div className="flex justify-center items-center gap-8 lg:gap-16 flex-wrap">
          {[
            { src: assets.microsoft_logo, alt: "Microsoft" },
            { src: assets.walmart_logo, alt: "Walmart" },
            { src: assets.accenture_logo, alt: "Accenture" },
            { src: assets.samsong_logo, alt: "Samsung" },
            { src: assets.amazon_logo, alt: "Amazon" },
            { src: assets.adobe_logo, alt: "Adobe" },
          ].map((logo, index) => (
            <div
              key={index}
              className="grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                className="h-8 object-contain"
                src={logo.src}
                alt={logo.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
