import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const Applyjobs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [jobsData, setJobsData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  const { jobs, backendUrl, userData, userApplications, fetchUserApplication } =
    useContext(AppContext);

  const fetchJobs = async () => {
    // call api to get job by id
    try {
      const { data } = await axios.get(backendUrl + `/api/jobs/${id}`);

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
      if (!userData) {
        navigate("/");
        return toast.error("Login to apply for a job");
      }

      if (!userData.resume) {
        navigate("/applications");
        return toast.error(error("Upload resume to apply"));
      }

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/apply",
        { jobId: jobsData._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserApplication();
        navigate("/applications");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // change  apply now to applied
  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some(
      (item) => item.jobId._id === JobsData._id,
    );

    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    fetchJobs();
  }, [id]);

  useEffect(() => {
    if (userApplications.length > 0 && JobData) {
      checkAlreadyApplied();
    }
  }, [JobData, userApplications, id]);

  return jobsData ? (
    <>
      <Navbar />
      <div className="main-h-screen flex flex-col py-10 container px-4 2xl:px-18 mx-auto">
        <div className=" bg-white text-black rounded-lg w-full">
          <div className=" flex justify-center md:justify-between flex-wrap gap-8 px-14 py-12 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className=" flex flex-col  md:flex-row items-center">
              <img
                className=" h-24 w-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border "
                src={jobsData.companyId.logo}
                alt={jobsData.companyId.name}
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl font-medium sm:text-4xl">
                  {jobsData.title}
                </h1>
                <div className=" flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-5">
                  <span className=" flex items-center gap-1">
                    <img src={assets.suitcase_icon} alt="" />
                    {jobsData.companyId.name}
                  </span>
                  <span className=" flex items-center gap-1">
                    <img src={assets.location_icon} alt="" />
                    {jobsData.location}
                  </span>
                  <span className=" flex items-center gap-1">
                    <img src={assets.person_icon} alt="" />
                    {jobsData.level}
                  </span>
                  <span className=" flex items-center gap-1">
                    <img src={assets.money_icon} alt="" />
                    CTC:{jobsData.salary}
                  </span>
                </div>
              </div>
            </div>
            <div className=" flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={applyJobHandler}
                className=" bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                {isAlreadyApplied ? "Applied" : "Apply Now"}
              </button>
              <p className=" mt-1 text-gray-600">
                posted {moment(jobsData.date).fromNow()}
              </p>
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row justify-between items-start">
            <div className=" w-full ">
              <h2 className=" text-2xl font-semibold mb-4">Job description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: jobsData.description }}
              ></div>
              <button
                onClick={applyJobHandler}
                className=" bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 mt-6"
              >
                {isAlreadyApplied ? "Applied" : "Apply Now"}
              </button>
            </div>
            <div>
              {/* right section more jobs */}
              <div className=" w-full lg:w-3/4 mt-8 lg:ml-10 space-y-5">
                <h2>More jobs from {jobsData.companyId.name}</h2>
                {jobs
                  .filter(
                    (job) =>
                      job._id !== jobsData._id &&
                      job.companyId._id === jobsData.companyId._id,
                  )
                  .filter((job) => {
                    // set of applied jobs
                    const appliedJobsIds = new set(
                      userApplications.map((app) => app.jobId && app.jobId._id),
                    );
                    // Return true if user have not applied
                    return !appliedJobsIds.has(job._id);
                  })
                  .slice(0, 3)
                  .map((job, index) => (
                    <JobCard key={index} job={job} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Applyjobs;
