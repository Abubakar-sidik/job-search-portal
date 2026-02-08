import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Search State
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);

  // Data State
  const [jobs, setJobs] = useState([]);
  const [showRecruterLogin, setShowRecruterLogin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false); // Added for custom user login

  // Recruiter Auth State
  const [companyToken, setCompanyToken] = useState(
    localStorage.getItem("companyToken"),
  );
  const [companyData, setCompanyData] = useState(null);

  // User Auth State
  const [userToken, setUserToken] = useState(localStorage.getItem("userToken"));
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplication] = useState([]);

  // 1. Fetch all jobs (Public)
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) {
        setJobs(data.jobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 2. Fetch Company Data (Private - Recruiter)
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/data`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 3. Fetch User Data (Private - User)
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: { token: userToken }, // Changed from Clerk Authorization header
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 4. Fetch User Applied Jobs
  const fetchUserApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: { token: userToken },
      });
      if (data.success) {
        setUserApplication(data.applications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchJobs();
  }, []);

  // Sync Recruiter Data
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  // Sync User Data
  useEffect(() => {
    if (userToken) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [userToken]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruterLogin,
    setShowRecruterLogin,
    showUserLogin,
    setShowUserLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    userToken,
    setUserToken,
    userData,
    setUserData,
    userApplications,
    setUserApplication,
    backendUrl,
    fetchUserData,
    fetchUserApplications,
    fetchJobs,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
