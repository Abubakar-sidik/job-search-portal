import React, { useEffect, useState, useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  // Initialize as null to handle the initial loading phase properly
  const [applicants, setApplicants] = useState(null);

  // Fetch company job application data
  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, {
        headers: { token: companyToken },
      });

      if (data.success) {
        if (Array.isArray(data.applications)) {
          setApplicants([...data.applications].reverse());
        } else {
          setApplicants([]);
        }
      } else {
        toast.error(data.message);
        setApplicants([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setApplicants([]);
    }
  };
  // Update job application status (Accepted / Rejected)
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } },
      );

      if (data.success) {
        toast.success(`Application updated to ${status}`);
        fetchCompanyJobApplications(); // Refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  // If applicants is still null, show the loading spinner
  if (applicants === null) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl min-h-[80vh]">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Candidate Applications
      </h2>

      {applicants.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
          <img
            src={assets.no_data_icon}
            alt="No Data"
            className="w-20 mb-4 opacity-20"
          />
          <p className="text-xl">No applications received yet.</p>
        </div>
      ) : (
        <div className="overflow-x-visible bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm sm:text-base table-auto">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="py-4 px-4 text-left font-medium">#</th>
                <th className="py-4 px-4 text-left font-medium">Candidate</th>
                <th className="py-4 px-4 text-left font-medium max-sm:hidden">
                  Job Title
                </th>
                <th className="py-4 px-4 text-left font-medium max-sm:hidden">
                  Location
                </th>
                <th className="py-4 px-4 text-left font-medium">Resume</th>
                <th className="py-4 px-4 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applicants
                // Crucial Filter: Remove applications where User or Job was deleted from DB
                .filter((item) => item.jobId && item.userId)
                .map((applicant, index) => (
                  <tr
                    key={applicant._id}
                    className="text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-400">{index + 1}</td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          className="w-10 h-10 rounded-full object-cover border max-sm:hidden"
                          src={applicant.userId.image || assets.profile_img}
                          alt="profile"
                        />
                        <span className="font-medium text-gray-900">
                          {applicant.userId.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 max-sm:hidden text-gray-600">
                      {applicant.jobId.title}
                    </td>

                    <td className="py-4 px-4 max-sm:hidden">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">
                        {applicant.jobId.location}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {applicant.userId.resume ? (
                        <a
                          href={applicant.userId.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-flex gap-2 items-center hover:bg-blue-100 transition-colors"
                        >
                          Resume{" "}
                          <img
                            src={assets.resume_download_icon}
                            className="w-3"
                            alt=""
                          />
                        </a>
                      ) : (
                        <span className="text-red-400 text-xs italic">
                          No Resume
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 relative">
                      {/* Check status case-sensitively */}
                      {applicant.status === "Pending" ? (
                        <div className="relative inline-block group">
                          <button className="text-gray-400 hover:text-gray-600 text-xl px-3 py-1 bg-gray-50 rounded-md">
                            •••
                          </button>
                          {/* Dropdown Menu */}
                          <div className="absolute hidden group-hover:block right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] overflow-hidden">
                            <button
                              onClick={() =>
                                changeJobApplicationStatus(
                                  applicant._id,
                                  "Accepted",
                                )
                              }
                              className="block w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                changeJobApplicationStatus(
                                  applicant._id,
                                  "Rejected",
                                )
                              }
                              className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                            applicant.status === "Accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {applicant.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
