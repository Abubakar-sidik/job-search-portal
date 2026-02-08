import React, { useContext } from "react";
import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();

  // Accessing custom auth states from AppContext
  const {
    setShowRecruterLogin,
    setShowUserLogin,
    userToken,
    userData,
    setUserToken,
    setUserData,
    companyToken,
    setCompanyToken,
    setCompanyData,
  } = useContext(AppContext);

  // Unified logout function
  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("companyToken");
    setUserToken(null);
    setUserData(null);
    setCompanyToken(null);
    setCompanyData(null);
    navigate("/");
  };

  return (
    <div className="shadow py-4 bg-white sticky top-0 z-40">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo */}

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

        {/* Auth Conditional Rendering */}
        {userToken ? (
          /* User is logged in */
          <div className="flex items-center gap-3 sm:gap-8">
            <Link
              to="/applications"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Applied Jobs
            </Link>
            <div className="flex items-center gap-2">
              <p className="max-sm:hidden text-gray-800 font-medium">
                Hi, {userData?.name}
              </p>
              <div className="group relative">
                <img
                  src={userData?.image || assets.profile_img}
                  className="w-10 h-10 rounded-full border border-gray-200 cursor-pointer"
                  alt="profile"
                />
                <div className="absolute right-0 top-10 pt-2 hidden group-hover:block transition-all">
                  <ul className="list-none m-0 p-2 bg-white shadow-lg border rounded text-sm">
                    <li
                      onClick={logout}
                      className="py-1 px-4 hover:bg-gray-100 cursor-pointer text-red-500"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : companyToken ? (
          /* Recruiter is logged in */
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-6 py-2 rounded-full text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          /* No one is logged in */
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowRecruterLogin(true)}
              className="text-gray-600 hover:text-blue-600 max-sm:text-xs"
            >
              Recruiter Login
            </button>
            <button
              onClick={() => setShowUserLogin(true)}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full border-none shadow-md hover:bg-blue-700 transition-all max-sm:text-xs"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
