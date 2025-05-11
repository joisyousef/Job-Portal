import React from "react";
import assets, { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ManageJobs = () => {
  const navigate = useNavigate();

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
              {manageJobsData.map((job, index) => (
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
                      {job.applicants}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={job.visible}
                        onChange={() => {}}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        Showing {manageJobsData.length} jobs
      </div>
    </div>
  );
};

export default ManageJobs;
