import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { companyData, setCompanyData, setCompanyToken } =
    useContext(AppContext);

  // Function to logout for company
  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem("companyToken"); // Standardized key name
    setCompanyData(null);
    navigate("/");
  };

  // Only redirect to manage-jobs if we are at the base /dashboard path
  useEffect(() => {
    if (companyData && location.pathname === "/dashboard") {
      navigate("/dashboard/manage-jobs");
    }
  }, [companyData, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar for recruiter panel */}
      <nav className="shadow py-4 bg-white sticky top-0 z-20">
        <div className="px-5 flex justify-between items-center">
          <div
            onClick={() => navigate("/")}
            className=" flex items-center cursor-pointer "
          >
            <img
              src={assets.logo2}
              className="cursor-pointer w-20 sm:w-20"
              alt="Logo"
            />
            <span className="max-sm:hidden text-gray-800 font-medium -ml-4">
              Job Portal
            </span>
          </div>

          {companyData && (
            <div className="flex items-center gap-3">
              <p className="max-sm:hidden font-medium text-gray-700">
                Welcome, {companyData.name}
              </p>
              <div className="relative group">
                <img
                  className="w-10 h-10 border rounded-full object-cover cursor-pointer"
                  src={companyData.image}
                  alt="company logo"
                />
                <div className="absolute hidden group-hover:block right-0 top-full pt-2 z-30">
                  <ul className="list-none m-0 p-2 bg-white border shadow-lg rounded text-sm min-w-[120px]">
                    <li
                      onClick={logout}
                      className="py-2 px-4 cursor-pointer hover:bg-red-50 text-red-600 font-medium transition-colors"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="flex items-start">
        {/* Left Sidebar */}
        <aside className="inline-block min-h-screen border-r-2 bg-gray-50/50">
          <ul className="flex flex-col items-start pt-5 text-gray-800">
            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-3 w-full transition-all ${
                  isActive
                    ? "bg-blue-50 border-r-4 border-blue-500 text-blue-600"
                    : "hover:bg-gray-100"
                }`
              }
              to="/dashboard/add-jobs"
            >
              <img className="w-5" src={assets.add_icon} alt="" />
              <p className="max-sm:hidden font-medium">Add Job</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-3 w-full transition-all ${
                  isActive
                    ? "bg-blue-50 border-r-4 border-blue-500 text-blue-600"
                    : "hover:bg-gray-100"
                }`
              }
              to="/dashboard/manage-jobs"
            >
              <img className="w-5" src={assets.home_icon} alt="" />
              <p className="max-sm:hidden font-medium">Manage Jobs</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-3 w-full transition-all ${
                  isActive
                    ? "bg-blue-50 border-r-4 border-blue-500 text-blue-600"
                    : "hover:bg-gray-100"
                }`
              }
              to="/dashboard/view-job-applications"
            >
              <img className="w-5" src={assets.person_tick_icon} alt="" />
              <p className="max-sm:hidden font-medium">Applications</p>
            </NavLink>
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full p-4 sm:p-8 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
