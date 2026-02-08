import React, { useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } =
    useContext(AppContext);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Use useMemo to prevent unnecessary re-filtering on every re-render
  const filteredJobs = useMemo(() => {
    return jobs
      .slice()
      .reverse() // Show newest jobs first
      .filter((job) => {
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(job.category);

        const matchesLocation =
          selectedLocations.length === 0 ||
          selectedLocations.includes(job.location);

        const matchesTitle =
          searchFilter.title === "" ||
          job.title.toLowerCase().includes(searchFilter.title.toLowerCase());

        const matchesSearchLocation =
          searchFilter.location === "" ||
          job.location
            .toLowerCase()
            .includes(searchFilter.location.toLowerCase());

        return (
          matchesCategory &&
          matchesLocation &&
          matchesTitle &&
          matchesSearchLocation
        );
      });
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location],
    );
  };

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8">
      {/* Sidebar - Filters */}
      <div className="w-full lg:w-1/4 bg-white px-4">
        {isSearched &&
          (searchFilter.title !== "" || searchFilter.location !== "") && (
            <>
              <h3 className="font-medium text-lg mb-4">Current search</h3>
              <div className="mb-4 text-gray-600 flex flex-wrap gap-2">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded text-sm">
                    {searchFilter.title}
                    <img
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, title: "" }))
                      }
                      className="cursor-pointer w-3"
                      src={assets.cross_icon}
                      alt="clear"
                    />
                  </span>
                )}
                {searchFilter.location && (
                  <span className="inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded text-sm">
                    {searchFilter.location}
                    <img
                      onClick={() =>
                        setSearchFilter((prev) => ({ ...prev, location: "" }))
                      }
                      className="cursor-pointer w-3"
                      src={assets.cross_icon}
                      alt="clear"
                    />
                  </span>
                )}
              </div>
            </>
          )}

        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="px-6 py-1.5 rounded border border-gray-400 lg:hidden mb-4"
        >
          {showFilter ? "Close" : "Filter"}
        </button>

        {/* Category filter */}
        <div className={showFilter ? "block" : "hidden lg:block"}>
          <h4 className="font-medium text-lg py-4">Search by Categories</h4>
          <ul className="space-y-4 text-gray-600">
            {JobCategories.map((category, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  className="scale-125 accent-blue-600"
                  type="checkbox"
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Location filter */}
        <div className={showFilter ? "block" : "hidden lg:block"}>
          <h4 className="font-medium text-lg py-4 pt-10">Search by Location</h4>
          <ul className="space-y-4 text-gray-600">
            {JobLocations.map((location, index) => (
              <li className="flex gap-3 items-center" key={index}>
                <input
                  className="scale-125 accent-blue-600"
                  type="checkbox"
                  onChange={() => handleLocationChange(location)}
                  checked={selectedLocations.includes(location)}
                />
                {location}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job listings Section */}
      <section className="w-full lg:w-3/4 text-gray-800 max-lg:px-4">
        <h3 className="font-medium text-3xl py-2" id="job-list">
          Latest Jobs
        </h3>
        <p className="mb-8">Get your dream job from top companies</p>

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredJobs.map((job, index) => (
              <JobCard key={job._id || index} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No jobs found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedLocations([]);
              }}
              className="mt-4 text-blue-600 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;
