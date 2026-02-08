import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ManageJobs = () => {
  const navigate = useNavigate();

  // 1. Initialize as null (Loading) rather than false
  const [jobs, setJobs] = useState(null);
  const { backendUrl, companyToken } = useContext(AppContext);

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        // 2. Safety Check: Ensure jobsData exists and is an array before reversing
        if (Array.isArray(data.jobsData)) {
          // Use spread operator to reverse a copy, not the original
          setJobs([...data.jobsData].reverse());
        } else {
          setJobs([]);
        }
      } else {
        toast.error(data.message);
        setJobs([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setJobs([]); // Set to empty array on error to stop loading state
    }
  };

  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-job-visibility`,
        { id },
        { headers: { token: companyToken } },
      );

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    }
  }, [companyToken]);

  // 3. Proper Loading Guard
  if (jobs === null) {
    return <Loading />;
  }

  return (
    <div className="container p-4 max-w-5xl mx-auto">
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <p className="text-xl text-gray-500">No Jobs Posted</p>
          <button
            onClick={() => navigate("/dashboard/add-jobs")}
            className="bg-black text-white py-2 px-6 rounded shadow-md"
          >
            Add new job
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 shadow-sm">
            <table className="min-w-full max-sm:text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="py-3 px-4 text-left max-sm:hidden">#</th>
                  <th className="py-3 px-4 text-left">Job Title</th>
                  <th className="py-3 px-4 text-left max-sm:hidden">Date</th>
                  <th className="py-3 px-4 text-left max-sm:hidden">
                    Location
                  </th>
                  <th className="py-3 px-4 text-center">Applicants</th>
                  <th className="py-3 px-4 text-center">Visible</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, index) => (
                  <tr
                    key={job._id || index}
                    className="text-gray-700 border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 max-sm:hidden">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{job.title}</td>
                    <td className="py-3 px-4 max-sm:hidden">
                      {moment(job.date).format("ll")}
                    </td>
                    <td className="py-3 px-4 max-sm:hidden">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
                        {job.location}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{job.applicants}</td>
                    <td className="py-3 px-4 text-center">
                      <input
                        className="scale-125 cursor-pointer accent-blue-600"
                        type="checkbox"
                        onChange={() => changeJobVisibility(job._id)}
                        checked={job.visible}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => navigate("/dashboard/add-jobs")}
              className="text-white bg-black py-2 px-6 rounded hover:bg-gray-800 transition-all shadow-md"
            >
              Add new job
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageJobs;
