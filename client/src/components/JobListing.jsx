import React, { useContext, useState } from "react";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import JobCard from "./JobCard";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row space-y-8 lg:space-y-0 py-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 bg-white px-4">
        {isSearched && (searchFilter.title || searchFilter.location) && (
          <>
            <h3 className="font-medium text-lg mb-4">Current Search</h3>
            <div className="mb-4 text-gray-600 space-x-2">
              {searchFilter.title && (
                <span className="inline-flex items-center gap-2 bg-blue-50 border-blue-200 px-4 py-1.5 rounded">
                  {searchFilter.title}
                  <img
                    src={assets.cross_icon}
                    alt="Clear title filter"
                    className="cursor-pointer"
                    onClick={() =>
                      setSearchFilter((prev) => ({ ...prev, title: "" }))
                    }
                  />
                </span>
              )}
              {searchFilter.location && (
                <span className="inline-flex items-center gap-2 bg-red-50 border-red-200 px-4 py-1.5 rounded">
                  {searchFilter.location}
                  <img
                    src={assets.cross_icon}
                    alt="Clear location filter"
                    className="cursor-pointer"
                    onClick={() =>
                      setSearchFilter((prev) => ({ ...prev, location: "" }))
                    }
                  />
                </span>
              )}
            </div>
          </>
        )}
        <button
          onClick={(e) => setShowFilter((prev) => !prev)}
          className="px-6 py-1.5 rounded border border-gray-400  lg:hidden"
        >
          {showFilter ? "Close" : "Filters"}
        </button>
        {/* Category Filter */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search By Category</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((cat, i) => (
              <li key={cat} className="flex items-center gap-3">
                <input id={`cat-${i}`} type="checkbox" className="scale-125" />
                <label htmlFor={`cat-${i}`}>{cat}</label>
              </li>
            ))}
          </ul>
        </div>

        {/* Location Filter (same pattern as above) */}
        <div className={showFilter ? "" : "max-lg:hidden"}>
          <h4 className="font-medium text-lg py-4">Search By Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((loc, i) => (
              <li key={loc} className="flex items-center gap-3">
                <input id={`loc-${i}`} type="checkbox" className="scale-125" />
                <label htmlFor={`loc-${i}`}>{loc}</label>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Job Listings */}
      <section className="w-full lg:w-3/4 text-gray-800 px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest Jobs
        </h3>
        <p className="mb-8">Get your desired job from top companies</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.length > 0 ? (
            jobs
              .slice((currentPage - 1) * 6, currentPage * 6)
              .map((job) => <JobCard key={job.id || job.title} job={job} />)
          ) : (
            <p>No jobs match your search criteria.</p>
          )}
        </div>
        {/* Pagination */}
        {jobs.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-10">
            <a href="">
              <img
                onClick={() => setCurrentPage(Math.max(currentPage - 1), 1)}
                src={assets.left_arrow_icon}
                alt=""
              />
            </a>
            {Array.from({ length: Math.ceil(jobs.length / 6) }).map(
              (_, index) => (
                <a href="#job-list">
                  <button
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-100 text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                </a>
              )
            )}
            <a href="#job-list">
              <img
                onClick={() =>
                  setCurrentPage(
                    Math.min(currentPage + 1, Math.ceil(jobs.length / 6 - 1))
                  )
                }
                src={assets.right_arrow_icon}
                alt=""
              />
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
