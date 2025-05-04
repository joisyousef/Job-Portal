import React, { useContext, useEffect, useState } from "react";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import JobCard from "./JobCard";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  useEffect(() => {
    const matchCategory = (job) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(job.category);

    const matchLocation = (job) =>
      selectedLocations.length === 0 ||
      selectedLocations.includes(job.location);

    const matchTitle = (job) =>
      searchFilter.title === "" ||
      job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

    const matchLocationFilter = (job) =>
      searchFilter.location === "" ||
      job.location.toLowerCase().includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .slice()
      .reverse()
      .filter((job) => {
        return (
          matchCategory(job) &&
          matchLocation(job) &&
          matchTitle(job) &&
          matchLocationFilter(job)
        );
      });
    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);

  return (
    <div className="container 2xl:px-20 mx-auto py-12 bg-gray-50">
      <div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 px-4">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-gray-800">Filters</h3>
              <button
                onClick={() => setShowFilter((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm lg:hidden"
              >
                <span>{showFilter ? "Hide" : "Show"}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={showFilter ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                  ></path>
                </svg>
              </button>
            </div>

            {/* Current Search Tags */}
            {isSearched && (searchFilter.title || searchFilter.location) && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-500 mb-3 text-sm uppercase tracking-wider">
                  Current Search
                </h4>
                <div className="flex flex-wrap gap-2">
                  {searchFilter.title && (
                    <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span className="text-blue-700">
                        {searchFilter.title}
                      </span>
                      <button
                        className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center hover:bg-blue-200"
                        onClick={() =>
                          setSearchFilter((prev) => ({ ...prev, title: "" }))
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-blue-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  )}
                  {searchFilter.location && (
                    <span className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-indigo-700">
                        {searchFilter.location}
                      </span>
                      <button
                        className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center hover:bg-indigo-200"
                        onClick={() =>
                          setSearchFilter((prev) => ({ ...prev, location: "" }))
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-indigo-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className={`space-y-6 ${showFilter ? "" : "max-lg:hidden"}`}>
              {/* Category Filter */}
              <div className="pb-6 border-b border-gray-100">
                <h4 className="font-medium text-gray-500 mb-4 text-sm uppercase tracking-wider">
                  Job Categories
                </h4>
                <ul className="space-y-3 text-gray-700">
                  {JobCategories.map((cat, i) => (
                    <li key={cat} className="flex items-center gap-3">
                      <div className="relative flex items-center">
                        <input
                          id={`cat-${i}`}
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          onChange={() => handleCategoryChange(cat)}
                          checked={selectedCategories.includes(cat)}
                        />
                        <label
                          htmlFor={`cat-${i}`}
                          className="ml-3 text-sm font-medium text-gray-700 cursor-pointer hover:text-blue-600"
                        >
                          {cat}
                        </label>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full ml-auto">
                        {jobs.filter((job) => job.category === cat).length}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location Filter */}
              <div>
                <h4 className="font-medium text-gray-500 mb-4 text-sm uppercase tracking-wider">
                  Locations
                </h4>
                <ul className="space-y-3 text-gray-700">
                  {JobLocations.map((loc, i) => (
                    <li key={loc} className="flex items-center gap-3">
                      <div className="relative flex items-center">
                        <input
                          id={`loc-${i}`}
                          type="checkbox"
                          className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                          onChange={() => handleLocationChange(loc)}
                          checked={selectedLocations.includes(loc)}
                        />
                        <label
                          htmlFor={`loc-${i}`}
                          className="ml-3 text-sm font-medium text-gray-700 cursor-pointer hover:text-indigo-600"
                        >
                          {loc}
                        </label>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full ml-auto">
                        {jobs.filter((job) => job.location === loc).length}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clear filters button */}
              {(selectedCategories.length > 0 ||
                selectedLocations.length > 0) && (
                <button
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors mt-4"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedLocations([]);
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Job Listings */}
        <section className="w-full lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-bold text-2xl text-gray-800" id="job-list">
                  Latest Jobs
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredJobs.length} opportunities from top companies
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Sort by:</span>
                <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Most recent</option>
                  <option>Relevance</option>
                  <option>Salary: High to Low</option>
                </select>
              </div>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs
                  .slice((currentPage - 1) * 6, currentPage * 6)
                  .map((job) => (
                    <JobCard key={job.id || job.title} job={job} />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No matching jobs found
                </h3>
                <p className="text-gray-500 max-w-md">
                  Try adjusting your search criteria or clearing some filters to
                  see more results.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredJobs.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-center">
              <div className="flex items-center space-x-1">
                <a
                  href="#job-list"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.max(currentPage - 1, 1));
                  }}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </a>

                <div className="flex space-x-1">
                  {Array.from({
                    length: Math.ceil(filteredJobs.length / 6),
                  }).map((_, index) => (
                    <a
                      key={index}
                      href="#job-list"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(index + 1);
                      }}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </a>
                  ))}
                </div>

                <a
                  href="#job-list"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(
                      Math.min(
                        currentPage + 1,
                        Math.ceil(filteredJobs.length / 6)
                      )
                    );
                  }}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    currentPage >= Math.ceil(filteredJobs.length / 6)
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobListing;
