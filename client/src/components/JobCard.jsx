import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  // Function to handle navigation and scrolling to top
  const handleNavigation = () => {
    navigate(`/apply-jobs/${job._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="border border-gray-200 p-6 shadow-sm rounded-xl bg-white hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center">
        <img
          className="h-10 w-10 object-contain border border-gray-100 p-1 rounded-md"
          src={job.companyId.image}
          alt={job.companyId.name}
        />
      </div>

      <h4 className="font-semibold text-xl mt-3 text-gray-800 truncate">
        {job.title}
      </h4>

      <div className="flex items-center gap-3 mt-3 text-[11px] font-medium uppercase tracking-wider">
        <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-md">
          {job.location}
        </span>
        <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-md">
          {job.level}
        </span>
      </div>

      {/* Description Preview */}
      <p
        className="text-gray-600 text-sm mt-4 line-clamp-2"
        dangerouslySetInnerHTML={{
          __html: job.description.slice(0, 150) + "...",
        }}
      ></p>

      <div className="mt-6 flex gap-3 text-sm font-medium">
        <button
          onClick={handleNavigation}
          className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply now
        </button>
        <button
          onClick={handleNavigation}
          className="flex-1 text-gray-600 border border-gray-300 rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default JobCard;
