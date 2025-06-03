import React from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`/apply-job/${id}`);
    scrollTo(0, 0);
  };

  // Function to determine badge color based on job level
  const getLevelBadgeColor = (level) => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes("senior") || levelLower.includes("lead"))
      return "bg-purple-100 text-purple-800";
    if (levelLower.includes("mid")) return "bg-blue-100 text-blue-800";
    if (levelLower.includes("junior") || levelLower.includes("entry"))
      return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white relative overflow-hidden">
      {/* Accent corner */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 opacity-10 rounded-full"></div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
            <img
              src={job.companyId.image}
              alt={`Logo for ${job.companyName}`}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-600">
              {job.companyName || "Company"}
            </h3>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-green-600">Actively hiring</span>
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          Posted {job.postedDate || "2 days ago"}
        </span>
      </div>

      <h2
        className="font-bold text-xl text-gray-800 mb-2 hover:text-blue-600 cursor-pointer"
        onClick={() => handleNavigate(job._id)}
      >
        {job.title}
      </h2>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
          <i className="mr-1">📍</i>
          {job.location}
        </span>
        <span
          className={`inline-block px-3 py-1 text-xs rounded-full ${getLevelBadgeColor(
            job.level
          )}`}
        >
          {job.level}
        </span>
        {job.salary && (
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            <i className="mr-1">💰</i>
            {job.salary}
          </span>
        )}
      </div>

      <p
        className="text-gray-600 text-sm mt-4 line-clamp-3"
        dangerouslySetInnerHTML={{
          __html: job.description.slice(0, 150) + "...",
        }}
      />

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleNavigate(job._id)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm hover:shadow-md hover:from-blue-700 hover:to-blue-800 transition duration-300 flex-1"
        >
          Apply Now
        </button>
        <button
          onClick={() => handleNavigate(job._id)}
          className="text-blue-600 border border-blue-300 bg-blue-50 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-blue-100 transition duration-300 flex-1"
        >
          View Details
        </button>
      </div>

      {/* Job metrics */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
        <span>{job.applicants || "12 applicants"}</span>
        <span>{job.type || "Full-time"}</span>
      </div>
    </div>
  );
};

export default JobCard;
