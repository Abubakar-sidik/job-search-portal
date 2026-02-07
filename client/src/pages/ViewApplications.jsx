import React, { useEffect, useState } from "react";
import { assets, viewApplicationsPageData } from "../assets/assets";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  const [applicants, setApplicants] = useState(false);

  // Function to fetch company job application data
  const fetchCompanyJobapplications = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/applicants", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setApplicants(data.applicants.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to update job application status
  const changeJobApplicationstatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-status",
        { id, status },
        { headers: { token: companyToken } },
      );

      if (data.success) {
        fetchCompanyJobapplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobapplications();
    }
  }, [companyToken]);

  return applicants ? (
    applicants.length === 0 ? (
      <div className="flex items-center justify-center h-[70vh">
        <p className=" text-xl sm:text-2xl">No Applications Available</p>
      </div>
    ) : (
      <div className=" container mx-auto p-4">
        <div>
          <table className=" w-full border border-gray-200 bg-white max-sm:text-sm table-auto">
            <thead>
              <tr className=" border-b">
                <th className=" py-2 px-4 text-left">#</th>
                <th className=" py-2 px-4 text-left">Applicant name</th>
                <th className=" py-2 px-4 text-left max-sm:hidden">
                  Job Title
                </th>
                <th className=" py-2 px-4 text-left max-sm:hidden">Location</th>
                <th className=" py-2 px-4 text-left">Resume</th>
                <th className=" py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants
                .filter((item) => item.jobId && item.userId)
                .map((applicant, index) => (
                  <tr
                    key={index}
                    className=" text-gray-700 border-b hover:bg-gray-50"
                  >
                    <td className=" py-2 px-4 text-center">{index + 1}</td>
                    <td className=" py-2 px-4 text-center flex items-center">
                      <img
                        className=" w-10 rounded-full mr-3 max-sm:hidden"
                        src={applicant.userId.image}
                        alt=""
                      />
                      <span>{applicant.userId.name}</span>
                    </td>
                    <td className=" py-2 px-4 max-sm:hidden">
                      {applicant.jobId.title}
                    </td>
                    <td className=" py-2 px-4 max-sm:hidden">
                      {applicant.jobId.location}
                    </td>
                    <td className=" py-2 px-4 border-b">
                      <a
                        href={applicant.userId.resume}
                        target="_blank"
                        className=" bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                      >
                        resume <img src={assets.resume_download_icon} alt="" />
                      </a>
                    </td>
                    <td className=" py-2 px-4 border-b relative">
                      {applicant.status === "Pendding" ? (
                        <div className=" relative inline-block text-left group">
                          <button className=" text-gray-500 action-button ml-4">
                            ...
                          </button>
                          <div className=" absolute hidden md:left top-0 right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block z-10">
                            <button
                              onClick={() =>
                                changeJobApplicationstatus(
                                  applicant._id,
                                  "Accepted",
                                )
                              }
                              className=" block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                changeJobApplicationstatus(
                                  applicant._id,
                                  "Rejected",
                                )
                              }
                              className=" block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>{applicant.status}</div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ViewApplications;
