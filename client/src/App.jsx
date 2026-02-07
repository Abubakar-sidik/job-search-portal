import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home.jsx";
import Applications from "./pages/Applications.jsx";
import RecruterLogin from "./components/RecruterLogin.jsx";
import Applyjobs from "./pages/Applyjobs.jsx";
import { AppContext } from "./context/AppContext.jsx";
import { useContext } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import AddJob from "./pages/AddJob.jsx";
import ManageJobs from "./pages/ManageJobs.jsx";
import ViewApplications from "./pages/ViewApplications.jsx";
import "quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import UserSync from "./components/UserSync.jsx";

const App = () => {
  const { showRecruterLogin, companyToken } = useContext(AppContext);

  return (
    <div>
      {/* This component runs in the background to sync Clerk data to MongoDB */}
      <UserSync />

      {showRecruterLogin && <RecruterLogin />}
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/apply-jobs/:id" element={<Applyjobs />} />

        {/* Dashboard Parent Route */}
        <Route path="/dashboard" element={<Dashboard />}>
          {companyToken ? (
            <>
              <Route path="add-jobs" element={<AddJob />} />
              <Route path="manage-jobs" element={<ManageJobs />} />
              <Route
                path="view-job-applications"
                element={<ViewApplications />}
              />
            </>
          ) : null}
        </Route>
      </Routes>
    </div>
  );
};
export default App;
