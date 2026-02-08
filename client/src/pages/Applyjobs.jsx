import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";

const ApplyJobs = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobsData, setJobsData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    fetchUserApplications, // Standardized naming
    userToken,
    setShowUserLogin,
  } = useContext(AppContext);

  const fetchJobById = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) {
        setJobsData(data.job);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const applyJobHandler = async () => {
    try {
      if (!userToken) {
        setShowUserLogin(true);
        return toast.info("Please login to apply for this job");
      }

      if (!userData?.resume) {
        navigate("/applications");
        return toast.error("Please upload your resume first!");
      }

      if (isAlreadyApplied) {
        return toast.info("You have already applied for this position");
      }

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`, // Standardized endpoint
        { jobId: jobsData._id },
        { headers: { token: userToken } },
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserApplications();
        navigate("/applications");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(
      (app) => app.jobId?._id === jobsData?._id,
    );
    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    fetchJobById();
  }, [id]);

  useEffect(() => {
    if (userApplications.length > 0 && jobsData) {
      checkAlreadyApplied();
    }
  }, [jobsData, userApplications]);

  return jobsData ? (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          {/* Header Section */}
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-8 py-10 md:px-14 md:py-12 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                className="h-24 w-24 bg-white rounded-lg p-3 border object-contain"
                src={jobsData.companyId.image} // Changed from logo to image
                alt={jobsData.companyId.name}
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl font-semibold sm:text-4xl">
                  {jobsData.title}
                </h1>
                <div className="flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-5 text-sm sm:text-base">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" className="w-4" />
                    {jobsData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} alt="" className="w-4" />
                    {jobsData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} alt="" className="w-4" />
                    {jobsData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} alt="" className="w-4" />
                    CTC: {jobsData.salary}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={applyJobHandler}
                disabled={isAlreadyApplied}
                className={`${
                  isAlreadyApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-10 py-2.5 rounded-lg transition duration-300 font-medium`}
              >
                {isAlreadyApplied ? "Already Applied" : "Apply Now"}
              </button>
              <p className="mt-2 text-gray-500 italic">
                Posted {moment(jobsData.date).fromNow()}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
            {/* Left Section: Description */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
                Job Description
              </h2>
              <div
                className="rich-text leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: jobsData.description }}
              ></div>
              <button
                onClick={applyJobHandler}
                className="bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-10 font-medium"
              >
                {isAlreadyApplied ? "Applied" : "Apply Now"}
              </button>
            </div>

            {/* Right Section: Sidebar More Jobs */}
            <div className="w-full lg:w-1/3 space-y-5">
              <h3 className="text-xl font-bold mb-4">
                More jobs from {jobsData.companyId.name}
              </h3>
              {jobs
                .filter(
                  (job) =>
                    job._id !== jobsData._id &&
                    job.companyId._id === jobsData.companyId._id,
                )
                .filter((job) => {
                  const appliedJobsIds = new Set(
                    userApplications.map((app) => app.jobId?._id),
                  );
                  return !appliedJobsIds.has(job._id);
                })
                .slice(0, 4)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
              {jobs.filter((j) => j.companyId._id === jobsData.companyId._id)
                .length <= 1 && (
                <p className="text-gray-500 italic">
                  No other jobs available from this company.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loading />
  );
};

export default ApplyJobs;
