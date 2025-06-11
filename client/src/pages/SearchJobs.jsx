// pages/SearchJobs.jsx
import React, { useState } from "react";
import { searchJobs, getJobDetails } from "../services/searchApi";
import JobCard from "../components/JobCard";
import Loading from "../components/Loading";

const SearchJobs = () => {
  const [searchParams, setSearchParams] = useState({
    query: "",
    location: "",
    job_type: "",
    date_posted: "",
    remote_jobs_only: false,
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearch = async () => {
    if (!searchParams.query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");
    setJobs([]);

    try {
      const response = await searchJobs(searchParams);
      if (response.success) {
        setJobs(response.data.jobs);
        setTotalResults(response.data.total_results || 0);
      } else {
        setError(response.message || "Failed to search jobs");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = async (job) => {
    setSelectedJob(job);
    setShowModal(true);
    setDetailsLoading(true);
    setJobDetails(null);

    try {
      const response = await getJobDetails(job.id);
      if (response.success) {
        setJobDetails(response.job);
      }
    } catch (err) {
      console.error("Failed to get job details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
    setJobDetails(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Search Jobs</h1>
        <p className="text-gray-600">
          Find your next opportunity from thousands of job listings
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title or Keywords *
            </label>
            <input
              type="text"
              name="query"
              value={searchParams.query}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Software Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={searchParams.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. New York, NY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
              name="job_type"
              value={searchParams.job_type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="FULLTIME">Full Time</option>
              <option value="PARTTIME">Part Time</option>
              <option value="CONTRACTOR">Contract</option>
              <option value="INTERN">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Posted
            </label>
            <select
              name="date_posted"
              value={searchParams.date_posted}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any time</option>
              <option value="today">Today</option>
              <option value="3days">Last 3 days</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>

          <div className="flex items-center justify-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="remote_jobs_only"
                checked={searchParams.remote_jobs_only}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              />
              <span className="text-sm text-gray-700">Remote jobs only</span>
            </label>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {loading ? "Searching..." : "Search Jobs"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <Loading />}

      {/* Results Count */}
      {jobs.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-600">
            Found {totalResults.toLocaleString()} jobs
          </p>
        </div>
      )}

      {/* Jobs Grid */}
      {jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <div
              key={job.id || index}
              onClick={() => handleJobClick(job)}
              className="cursor-pointer transform hover:scale-105 transition-transform"
            >
              <JobCard
                job={{
                  _id: job.id,
                  title: job.title,
                  companyId: {
                    name: job.company_name,
                    email: "N/A",
                  },
                  location: job.location,
                  level: job.job_type || "Not specified",
                  salary: job.salary || "Not disclosed",
                  description: job.description,
                  date: job.posted_at || "Recently posted",
                }}
                isExternal={true}
              />
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {jobs.length === 0 && !loading && searchParams.query && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or keywords
          </p>
        </div>
      )}

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Job Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {detailsLoading ? (
                <div className="text-center py-12">
                  <Loading />
                  <p className="text-gray-500 mt-4">Loading job details...</p>
                </div>
              ) : jobDetails ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {jobDetails.title}
                    </h3>
                    <p className="text-xl text-gray-600 mb-1">
                      {jobDetails.company_name}
                    </p>
                    <p className="text-gray-500 mb-4">{jobDetails.location}</p>

                    {jobDetails.salary && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-green-800 font-semibold">
                          💰 {jobDetails.salary}
                        </p>
                      </div>
                    )}
                  </div>

                  {jobDetails.description && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Job Description
                      </h4>
                      <div
                        className="prose max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: jobDetails.description,
                        }}
                      />
                    </div>
                  )}

                  {jobDetails.qualifications && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Qualifications
                      </h4>
                      <div
                        className="prose max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: jobDetails.qualifications,
                        }}
                      />
                    </div>
                  )}

                  {jobDetails.responsibilities && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Responsibilities
                      </h4>
                      <div
                        className="prose max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: jobDetails.responsibilities,
                        }}
                      />
                    </div>
                  )}

                  {jobDetails.benefits && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Benefits
                      </h4>
                      <div
                        className="prose max-w-none text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: jobDetails.benefits,
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {selectedJob.title}
                    </h3>
                    <p className="text-xl text-gray-600 mb-1">
                      {selectedJob.company_name}
                    </p>
                    <p className="text-gray-500 mb-4">{selectedJob.location}</p>

                    {selectedJob.salary && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-green-800 font-semibold">
                          💰 {selectedJob.salary}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedJob.description && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Job Description
                      </h4>
                      <p className="text-gray-600">{selectedJob.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Apply Button */}
              <div className="border-t pt-6 mt-8">
                {(jobDetails?.apply_link || selectedJob?.apply_link) && (
                  <a
                    href={jobDetails?.apply_link || selectedJob?.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Apply for this Job →
                  </a>
                )}
                <button
                  onClick={closeModal}
                  className="ml-4 px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchJobs;
