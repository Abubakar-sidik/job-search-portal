import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/home.jsx";
import Applications from "./pages/Applications.jsx";
import RecruterLogin from "./components/RecruterLogin.jsx";
import UserLogin from "./components/UserLogin.jsx"; // Added User Login Modal
import Applyjobs from "./pages/Applyjobs.jsx";
import { AppContext } from "./context/AppContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddJob from "./pages/AddJob.jsx";
import ManageJobs from "./pages/ManageJobs.jsx";
import ViewApplications from "./pages/ViewApplications.jsx";

// Styles
import "quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { showRecruterLogin, showUserLogin, companyToken } =
    useContext(AppContext);

  return (
    <div className="min-h-screen bg-white">
      {/* Modals - Conditional Rendering */}
      {showRecruterLogin && <RecruterLogin />}
      {showUserLogin && <UserLogin />}

      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/apply-jobs/:id" element={<Applyjobs />} />

        {/* User Protected Routes */}
        <Route path="/applications" element={<Applications />} />

        {/* Recruiter Dashboard with Nested Routes */}
        <Route
          path="/dashboard"
          element={companyToken ? <Dashboard /> : <Navigate to="/" />}
        >
          {/* These nested routes only render if companyToken is present */}
          <Route path="add-jobs" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-job-applications" element={<ViewApplications />} />
        </Route>

        {/* Catch-all for 404s */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
