import React, { useContext, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { companyData, setCompanyData, setCompanyToken } =
    useContext(AppContext);

  // Function to handle logout
  const logout = () => {
    setCompanyData(null);
    setCompanyToken(null);
    localStorage.removeItem("companyToken");
    navigate("/");
  };

  // Check if we're at the root dashboard path
  const isRootDashboard =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/95 shadow-xl border-b border-gray-200/50 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="group">
            <img
              onClick={() => navigate("/")}
              className="max-sm:w-32 w-40 cursor-pointer transition-all duration-300 hover:scale-105 drop-shadow-sm group-hover:drop-shadow-md"
              src={assets.logo}
              alt="Company Logo"
            />
          </div>

          <div className="flex gap-6 items-center">
            {companyData && (
              <>
                <div className="max-sm:hidden bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full">
                  <p className="text-gray-700 font-medium text-sm">
                    Welcome,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-semibold">
                      {companyData.name}
                    </span>
                  </p>
                </div>

                <div className="relative group">
                  <div className="w-12 h-12 rounded-full border-2 border-gradient-to-r from-blue-200 via-purple-200 to-blue-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center bg-gradient-to-br from-white to-blue-50 transform hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      className="w-8 rounded-full relative z-10"
                      src={companyData.image}
                      alt="User Avatar"
                    />
                  </div>

                  <div className="absolute hidden group-hover:block right-0 pt-4 z-30">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 w-56 py-2 overflow-hidden transform origin-top-right animate-in slide-in-from-top-2 duration-200">
                      <div className="px-5 py-4 border-b border-gray-100/80 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                        <p className="font-semibold text-gray-800">
                          {companyData.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {companyData.email}
                        </p>
                      </div>
                      <ul className="py-2">
                        <li
                          onClick={logout}
                          className="px-5 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 cursor-pointer flex items-center gap-3 text-gray-700 transition-all duration-200 group/item"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center group-hover/item:bg-red-200 transition-colors">
                            <svg
                              className="w-4 h-4 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">Logout</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-sm border-r border-gray-200/50 shadow-xl max-sm:w-16 sticky top-20 h-[calc(100vh-5rem)]">
          <div className="p-6 border-b border-gray-100/80 mb-2 max-sm:p-3 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <h2 className="font-bold text-gray-600 text-xs uppercase tracking-widest max-sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Dashboard
            </h2>
            <div className="max-sm:flex max-sm:justify-center">
              <div className="hidden max-sm:block w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">≡</span>
              </div>
            </div>
          </div>

          <nav className="px-4 py-6">
            <ul className="flex flex-col gap-2">
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `group flex items-center p-4 gap-4 w-full rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md"
                    }`
                  }
                  to="/dashboard/add-job"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 ${({
                      isActive,
                    }) =>
                      isActive
                        ? "bg-white/20"
                        : "bg-blue-100 group-hover:bg-blue-200"}`}
                  >
                    <img
                      className="w-5 h-5 transition-transform group-hover:scale-110"
                      src={assets.add_icon}
                      alt=""
                    />
                  </div>
                  <span className="max-sm:hidden font-semibold">Add Job</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  className={({ isActive }) =>
                    `group flex items-center p-4 gap-4 w-full rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md"
                    }`
                  }
                  to="/dashboard/manage-jobs"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 ${({
                      isActive,
                    }) =>
                      isActive
                        ? "bg-white/20"
                        : "bg-purple-100 group-hover:bg-purple-200"}`}
                  >
                    <img
                      className="w-5 h-5 transition-transform group-hover:scale-110"
                      src={assets.home_icon}
                      alt=""
                    />
                  </div>
                  <span className="max-sm:hidden font-semibold">
                    Manage Jobs
                  </span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  className={({ isActive }) =>
                    `group flex items-center p-4 gap-4 w-full rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:shadow-md"
                    }`
                  }
                  to="/dashboard/view-applications"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 ${({
                      isActive,
                    }) =>
                      isActive
                        ? "bg-white/20"
                        : "bg-green-100 group-hover:bg-green-200"}`}
                  >
                    <img
                      className="w-5 h-5 transition-transform group-hover:scale-110"
                      src={assets.person_tick_icon}
                      alt=""
                    />
                  </div>
                  <span className="max-sm:hidden font-semibold">
                    Applications
                  </span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 max-sm:p-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 max-sm:hidden shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-white">Need Help?</h3>
              </div>
              <p className="text-xs text-white/90 mb-4 leading-relaxed">
                Contact our support team for assistance with your dashboard.
              </p>
              <button className="w-full text-xs bg-white/20 backdrop-blur-sm text-white py-3 px-4 rounded-lg hover:bg-white/30 transition-all duration-300 font-semibold border border-white/20 hover:border-white/40">
                Contact Support
              </button>
            </div>

            <div className="max-sm:flex max-sm:justify-center max-sm:mt-4">
              <button className="hidden max-sm:block w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <svg
                  className="w-5 h-5 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-8 overflow-auto bg-gradient-to-br from-white/50 to-blue-50/20">
          <div className="max-w-6xl mx-auto">
            {isRootDashboard ? (
              // Default dashboard content when no nested route is active
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
                    Welcome to Your Dashboard
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage your jobs and view applications from the sidebar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Total Jobs
                        </p>
                        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
                          0
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <img
                          className="w-7 h-7 filter brightness-0 invert"
                          src={assets.home_icon}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Applications
                        </p>
                        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-700">
                          0
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <img
                          className="w-7 h-7 filter brightness-0 invert"
                          src={assets.person_tick_icon}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Active Jobs
                        </p>
                        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-700">
                          0
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <img
                          className="w-7 h-7 filter brightness-0 invert"
                          src={assets.add_icon}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate("/dashboard/add-job")}
                        className="group flex items-center gap-4 w-full p-4 text-left rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-blue-200/50 hover:shadow-md"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <img
                            className="w-5 h-5"
                            src={assets.add_icon}
                            alt=""
                          />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                          Post a New Job
                        </span>
                      </button>
                      <button
                        onClick={() => navigate("/dashboard/manage-jobs")}
                        className="group flex items-center gap-4 w-full p-4 text-left rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-purple-200/50 hover:shadow-md"
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <img
                            className="w-5 h-5"
                            src={assets.home_icon}
                            alt=""
                          />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
                          Manage Existing Jobs
                        </span>
                      </button>
                      <button
                        onClick={() => navigate("/dashboard/view-applications")}
                        className="group flex items-center gap-4 w-full p-4 text-left rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border border-transparent hover:border-green-200/50 hover:shadow-md"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <img
                            className="w-5 h-5"
                            src={assets.person_tick_icon}
                            alt=""
                          />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-green-700 transition-colors">
                          Review Applications
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      Recent Activity
                    </h3>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium">
                        No recent activity to display
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Start by posting your first job!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Render nested route content
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
