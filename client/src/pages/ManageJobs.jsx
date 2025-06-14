import React, { useContext, useEffect, useState } from "react";
import assets, { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ManageJobs = () => {
  const navigate = useNavigate();

  // Initialize jobs as an empty array instead of false
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUrl, companyToken } = useContext(AppContext);

  // Function to fetch company job application data
  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: { token: companyToken },
      });
      if (data.success) {
        setJobs(data.jobsData.reverse());
        console.log("Jobs data:", data.jobsData);
        // Debug: Check if applicants field exists
        console.log("First job applicants:", data.jobsData[0]?.applicants);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  // Function to handle visibility toggle
  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-visiblity",
        { id },
        { headers: { token: companyToken } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);

  // Show loading state
  if (loading) {
    return (
      <div className="container p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Jobs</h2>
        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center gap-2 shadow-md"
        >
          <div className="h-5 w-5 flex items-center justify-center font-bold text-lg">
            +
          </div>
          Add New Job
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">
                  #
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">
                  Location
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicants
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visible
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.length > 0 ? (
                jobs.map((job, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.title}
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">
                      {moment(job.date).format("ll")}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap max-sm:hidden">
                      <div className="text-sm text-gray-500 flex items-center">
                        <span className="mr-1 text-gray-400 text-xs">📍</span>
                        {job.location}
                      </div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full text-blue-700 bg-blue-100">
                        {job.applicants || 0}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={job.visible}
                          onChange={() => changeJobVisibility(job._id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-lg mb-2">No jobs found</div>
                      <div className="text-sm">
                        Start by creating your first job posting!
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Showing {jobs.length} jobs
      </div>
    </div>
  );
};

export default ManageJobs;
