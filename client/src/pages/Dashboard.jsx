import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();

  // get company data from the contex
  const { companyData, setCompanyData, setCompanyToken } =
    useContext(AppContext);

  // Function to logout for company
  const logout = () => {
    setCompanyToken(null);
    localStorage.removeItem("CompanyToken");
    setCompanyData(null);
    navigate("/");
  };

  useEffect(() => {
    if (companyData) {
      navigate("/dashboard/manage-jobs");
    }
  }, [companyData]);

  return (
    <div className=" min-h-screen">
      {/* navbar for recruter panel */}
      <div className="shadow py-4">
        <div className=" px-5 flex justify-between items-center">
          <img
            onClick={(e) => navigate("/")}
            className=" max-sm:w-32 items-center gap-3"
            alt="logo"
          />

          {companyData && (
            <div className=" flex justify-between items-center">
              <p className=" px-2 max-sm:hidden">
                Welcome , {companyData.name}
              </p>
              <div className="relative group">
                <img
                  className=" w-8 border rounded-full"
                  src={companyData.image}
                  alt=""
                />
                <div className=" absolute hidden group-hover:block top-0 ring-0 z-10 text-black rounded pt-12">
                  <ul className=" list-none m-0 p-2 bg-white border text-sm">
                    <li
                      onClick={logout}
                      className="py-1 px-2 cursor-pointer pr-10"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=" flex items-start">
        {/* left sidebar with options to manage jobs and view applications */}
        <div className=" inline-block min-h-screen border-r-2">
          <ul className=" flex flex-col items-start pt-5 to-gray-800">
            <NavLink
              className={({ isActive }) =>
                ` flex items-center p-3 sm:px6 gap-2 w-full hover:bg-gray-100 ${isActive && "bg-blue-100 border-r-4 border-blue-500"} `
              }
              to={"/dashboard/add-jobs"}
            >
              <img className=" min-w-4" src={assets.add_icon} alt="" />
              <p className=" max-sm:hidden ">Add jobs</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                ` flex items-center p-3 sm:px6 gap-2 w-full hover:bg-gray-100 ${isActive && "bg-blue-100 border-r-4 border-blue-500"} `
              }
              to={"/dashboard/manage-jobs"}
            >
              <img className=" min-w-4" src={assets.home_icon} alt="" />
              <p className=" max-sm:hidden ">Manage jobs</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                ` flex items-center p-3 sm:px6 gap-2 w-full hover:bg-gray-100 ${isActive && "bg-blue-100 border-r-4 border-blue-500"} `
              }
              to={"/dashboard/view-job-applications"}
            >
              <img className=" min-w-4" src={assets.person_tick_icon} alt="" />
              <p className=" max-sm:hidden ">View job applications</p>
            </NavLink>
          </ul>
        </div>
        <div className="flex-1 h-full p-2 sm:p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
