import { React, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Applications from "./pages/Application";
import ResumeMatcherPage from "./pages/ResumeMathcer";
import RecruitersLogin from "./components/RecruitersLogin";
import UserLogin from "./components/UserLogin";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplication from "./pages/ViewApplication";
import "quill/dist/quill.snow.css";
import ResumeBuilder from "./pages/ResumeBuilder";

const App = () => {
  const { showRecruiterLogin, showUserLogin } = useContext(AppContext);

  return (
    <div>
      {showRecruiterLogin && <RecruitersLogin />}
      {showUserLogin && <UserLogin />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/resume-matcher" element={<ResumeMatcherPage />} />

        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Redirect from /dashboard to /dashboard/add-job */}
          <Route index element={<Navigate to="/dashboard/add-job" replace />} />

          {/* Nested dashboard routes */}
          <Route path="add-job" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplication />} />
          <Route path="view-application/:id" element={<ViewApplication />} />
        </Route>
        <Route path="/create-resume" element={<ResumeBuilder />} />

        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
