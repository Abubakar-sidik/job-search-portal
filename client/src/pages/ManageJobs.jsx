import React, { useContext, useEffect, useState } from "react";
import { manageJobsData } from "../assets/assets";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ManageJobs = () => {
  const navigate = useNavigate();

  // logict to fetch data fromthe api and display it in table format

  const [jobs, setJobs] = useState(false);
  const { backendUrl, companyToken } = useContext(AppContext);

  // function to fetch company job applications
  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/list-jobs", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setJobs(data.jobData.reverse());
        console.log(data.jobData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  //function to change job visibility
  const chnageJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-job-visibility",
        {
          id,
        },
        { headers: { token: companyToken } },
      );

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);

  return jobs ? (
    jobs.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh">
        <p className=" text-xl sm:text-2xl">No Jobs Posted</p>
      </div>
    ) : (
      <div className=" container p-4 max-w-5xl">
        <div className=" overflow-x-auto ">
          <table className="min-full bg-white border border-gray-100 max-sm:text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left max-sm:hidden">
                  #
                </th>
                <th className="py-2 px-4 border-b text-left">Job Title</th>
                <th className="py-2 px-4 border-b text-left max-sm:hidden">
                  Date
                </th>
                <th className="py-2 px-4 border-b text-left max-sm:hidden">
                  Location
                </th>
                <th className="py-2 px-4 border-b text-center ">Applicants</th>
                <th className="py-2 px-4 border-b text-left">Visible</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr key={index} className=" text-gray-700">
                  <td className=" py-2 px-4 border-b max-sm:hidden">
                    {index + 1}
                  </td>
                  <td className=" py-2 px-4 border-b">{job.title}</td>
                  <td className=" py-2 px-4 border-b max-sm:hidden">
                    {moment(job.date).format("ll")}
                  </td>
                  <td className=" py-2 px-4 border-b max-sm:hidden">
                    {" "}
                    {job.location}{" "}
                  </td>
                  <td className=" py-2 px-4 border-b text-center">
                    {job.applicants}
                  </td>
                  <td className=" py-2 px-4 border-b">
                    <input
                      className=" scale-125 ml-4"
                      type="checkbox"
                      onChange={() => chnageJobVisibility(job._id)}
                      checked={job.visible}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className=" mt-4 flex justify-end">
          <button
            onClick={(e) => navigate("/dashboard/add-jobs")}
            className=" text-white bg-black py-2 px-4 rounded"
          >
            Add new job
          </button>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ManageJobs;
