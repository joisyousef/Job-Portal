import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Application";
import RecruitersLogin from "./components/RecruitersLogin";
import UserLogin from "./components/userLogin.jsx";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplication from "./pages/ViewApplication";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { showRecruiterLogin, showUserLogin, companyToken, isTokenLoading } =
    useContext(AppContext);

  if (isTokenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {showRecruiterLogin && <RecruitersLogin />}
      {showUserLogin && <UserLogin />}
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />

        {/* Dashboard with nested routes */}
        {companyToken ? (
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="add-job" element={<AddJob />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="view-applications" element={<ViewApplication />} />
            <Route path="view-application/:id" element={<ViewApplication />} />
          </Route>
        ) : (
          <Route path="/dashboard/*" element={<Navigate to="/" replace />} />
        )}

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
