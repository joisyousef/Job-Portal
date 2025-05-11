import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md py-3 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img
            onClick={() => navigate("/")}
            className="max-sm:w-32 w-40 cursor-pointer transition-transform hover:scale-105"
            src={assets.logo}
            alt="Company Logo"
          />
          <div className="flex gap-6 items-center">
            <p className="max-sm:hidden text-gray-700 font-medium">
              Welcome, <span className="text-blue-600">GreatStack</span>
            </p>
            <div className="relative group">
              <div className="w-10 h-10 rounded-full border-2 border-blue-100 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center bg-white">
                <img
                  className="w-8 rounded-full"
                  src={assets.company_icon}
                  alt="User Avatar"
                />
              </div>
              <div className="absolute hidden group-hover:block right-0 pt-5 z-20">
                <div className="bg-white rounded-lg shadow-xl border border-gray-100 w-48 py-2 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-800">GreatStack</p>
                    <p className="text-sm text-gray-500">admin@greatstack.io</p>
                  </div>
                  <ul className="py-1">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700 transition-colors">
                      <span className="text-sm">🚪</span>
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm max-sm:w-16 sticky top-16 h-[calc(100vh-4rem)]">
          <div className="p-4 border-b border-gray-100 mb-2 max-sm:p-2">
            <h2 className="font-semibold text-gray-500 text-sm uppercase tracking-wider max-sm:hidden">
              Dashboard
            </h2>
            <div className="max-sm:flex max-sm:justify-center">
              <span className="text-gray-400 hidden max-sm:block text-lg font-bold">
                ≡
              </span>
            </div>
          </div>
          <nav className="px-2 py-3">
            <ul className="flex flex-col gap-1">
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center p-3 gap-3 w-full rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                  to="/dashboard/add-job"
                >
                  <div className={`w-6 h-6 flex items-center justify-center`}>
                    <img className="w-5 h-5" src={assets.add_icon} alt="" />
                  </div>
                  <span className="max-sm:hidden font-medium">Add Job</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center p-3 gap-3 w-full rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                  to="/dashboard/manage-jobs"
                >
                  <div className={`w-6 h-6 flex items-center justify-center`}>
                    <img className="w-5 h-5" src={assets.home_icon} alt="" />
                  </div>
                  <span className="max-sm:hidden font-medium">Manage Jobs</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center p-3 gap-3 w-full rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                  to="/dashboard/view-applications"
                >
                  <div className={`w-6 h-6 flex items-center justify-center`}>
                    <img
                      className="w-5 h-5"
                      src={assets.person_tick_icon}
                      alt=""
                    />
                  </div>
                  <span className="max-sm:hidden font-medium">
                    Applications
                  </span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 max-sm:p-2">
            <div className="bg-blue-50 rounded-lg p-4 max-sm:hidden">
              <h3 className="text-sm font-medium text-blue-700">Need Help?</h3>
              <p className="text-xs text-gray-600 mt-1">
                Contact support for assistance with your dashboard.
              </p>
              <button className="mt-3 text-xs bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors w-full">
                Contact Support
              </button>
            </div>
            <div className="max-sm:flex max-sm:justify-center max-sm:mt-4">
              <button className="hidden max-sm:block text-gray-400 hover:text-blue-600">
                <span className="text-lg">❓</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
