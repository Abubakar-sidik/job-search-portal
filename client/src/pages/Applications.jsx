import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Applications = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);

  const {
    backendUrl,
    userData,
    userApplications,
    fetchUserData,
    fetchUserApplications,
    userToken,
  } = useContext(AppContext);

  const updateResume = async () => {
    try {
      if (!resume) return toast.error("Please select a file first");

      const formData = new FormData();
      formData.append("resume", resume);

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        { headers: { token: userToken } }, // Using custom token
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData(); // Refresh local user data to show new resume
        setIsEdit(false);
        setResume(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchUserApplications();
    }
  }, [userToken]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container px-4 flex-grow 2xl:px-20 mx-auto my-10">
        {/* Resume Section */}
        <h2 className="text-xl font-semibold mb-4">Your Resume</h2>
        <div className="flex items-center gap-3 mb-8">
          {isEdit || (userData && !userData.resume) ? (
            <>
              <label
                className="flex items-center cursor-pointer group"
                htmlFor="resumeUpload"
              >
                <p className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg border border-blue-200 group-hover:bg-blue-100 transition-colors">
                  {resume ? resume.name : "Select PDF Resume"}
                </p>
                <input
                  id="resumeUpload"
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                />
                <img
                  src={assets.profile_upload_icon}
                  className="ml-2 w-8"
                  alt=""
                />
              </label>
              <button
                onClick={updateResume}
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-6 py-2 transition-colors"
              >
                Save
              </button>
              {userData?.resume && (
                <button
                  onClick={() => {
                    setIsEdit(false);
                    setResume(null);
                  }}
                  className="text-gray-500 underline"
                >
                  Cancel
                </button>
              )}
            </>
          ) : (
            <div className="flex gap-4">
              <a
                href={userData?.resume}
                className="bg-blue-100 text-blue-600 px-6 py-2 rounded-lg font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className="text-gray-500 border border-gray-300 rounded-lg px-6 py-2 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Applications Table */}
        <h2 className="text-xl font-semibold mb-4">Applied Jobs</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Company
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Job Title
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 max-sm:hidden">
                  Location
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 max-sm:hidden">
                  Date
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userApplications.length > 0 ? (
                userApplications.map((job, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        className="w-8 h-8 rounded border object-contain"
                        src={job.companyId.image}
                        alt={job.companyId.name}
                      />
                      <span className="font-medium">{job.companyId.name}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {job.jobId.title}
                    </td>
                    <td className="py-4 px-6 text-gray-700 max-sm:hidden">
                      {job.jobId.location}
                    </td>
                    <td className="py-4 px-6 text-gray-700 max-sm:hidden">
                      {moment(job.dateApplied).format("MMM DD, YYYY")}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`${
                          job.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : job.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        } px-4 py-1 rounded-full text-xs font-semibold`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-gray-500">
                    You haven't applied to any jobs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Applications;
