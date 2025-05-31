import React from "react";
import assets, { viewApplicationsPageData } from "../assets/assets";

const ViewApplication = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Applications</h2>
        <div className="flex items-center gap-3">
          <div className="bg-white border rounded-lg flex items-center px-3 py-2 shadow-sm">
            <span className="text-gray-400 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search applications..."
              className="bg-transparent border-none outline-none text-sm w-40"
            />
          </div>
          <select className="bg-white border rounded-lg px-3 py-2 text-sm text-gray-700 shadow-sm outline-none">
            <option value="">All Positions</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 text-left">#</th>
                <th className="px-6 py-4 text-left">Applicant</th>
                <th className="px-6 py-4 text-left max-sm:hidden">Job Title</th>
                <th className="px-6 py-4 text-left max-sm:hidden">Location</th>
                <th className="px-6 py-4 text-left">Resume</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {viewApplicationsPageData.map((applicant, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 max-sm:hidden">
                        <img
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                          src={applicant.imgSrc}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {applicant.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Applied on May 10, 2025
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-sm:hidden">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                      {applicant.jobTitle}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">
                    <div className="flex items-center">
                      <span className="mr-1 text-gray-400 text-xs">📍</span>
                      {applicant.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href=""
                      target="_blank"
                      className="bg-blue-50 text-blue-600 px-3 py-2 rounded-md inline-flex items-center gap-2 text-sm hover:bg-blue-100 transition-colors"
                    >
                      <span className="text-xs">📄</span> Resume
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {applicant.status === "accepted" && (
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                        ✓ Accepted
                      </span>
                    )}
                    {applicant.status === "rejected" && (
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                        ✕ Rejected
                      </span>
                    )}
                    {applicant.status === "pending" && (
                      <span className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">
                        ⏳ Pending
                      </span>
                    )}
                    {applicant.status === "under_review" && (
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                        👁 Under Review
                      </span>
                    )}
                    {!applicant.status && (
                      <div className="relative inline-block text-left group">
                        <button className="bg-gray-100 hover:bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center font-bold text-gray-600 transition-colors">
                          ⋮
                        </button>
                        <div className="z-10 hidden absolute right-0 md:right-0 top-full mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg group-hover:block py-1">
                          <button className="flex w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                            <span className="mr-2">✓</span> Accept
                          </button>
                          <button className="flex w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <span className="mr-2">✕</span> Reject
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button className="flex w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                            <span className="mr-2">✉</span> Message
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
        <div>Showing {viewApplicationsPageData.length} applications</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50">
            &lt;
          </button>
          <button className="px-3 py-1 border rounded bg-blue-600 text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewApplication;
