import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [catigory, setCatigory] = useState("Programming");
  const [level, setLevel] = useState("Beginner");
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // get backend url
  const { backendUrl, companyToken } = useContext(AppContext);

  useEffect(() => {
    //initiate quill editor only once
    // quill not working
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefualt();

    try {
      const description = quillRef.current.root.innerHTML;

      const { data } = await axios.post(
        backendUrl + "/api/company/post-job",
        { title, description, location, salary, catigory, level },
        { headers: { token: companyToken } },
      );

      if (data.success) {
        toast.success(data.message);
        setTitle("");
        setSalary(0);
        quillRef.current.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className=" container p-4 flex flex-col gap-3 w-full"
    >
      <div className=" w-full">
        <p className=" mb-2">Job Title</p>
        <input
          type="text"
          placeholder="Type here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
          className=" w-full max-w-lg px-3 border-2 border-gray-300 rounded"
        />
      </div>
      <div className=" w-full max-w-lg">
        <p className=" my-2">Job Description</p>
        <div ref={editorRef}></div>
      </div>
      <div className=" flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className=" mb-2">Job Catigory</p>
          <select
            className=" w-full px-3 py-2 border-1 border-gray-300 rounded"
            onChange={(e) => setCatigory(e.target.value)}
            name="category"
            id="category"
            value={catigory}
          >
            {JobCategories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className=" mb-2">Job Location</p>
          <select
            className=" w-full px-3 py-2 border-1 border-gray-300 rounded"
            onChange={(e) => setLocation(e.target.value)}
            name="location"
            id="location"
            value={location}
          >
            {JobLocations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className=" mb-2">Job Label</p>
          <select
            className=" w-full px-3 py-2 border-1 border-gray-300 rounded"
            onChange={(e) => setLevel(e.target.value)}
            name="level"
            id="level"
            value={level}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      </div>

      <div>
        <p className=" mb-2">Job Salary</p>
        <input
          type="number"
          placeholder="250000"
          min={0}
          onChange={(e) => setSalary(e.target.value)}
          value={salary}
          className=" w-full px-3 py-2 border-1 border-gray-300 rounded sm:w-[120px]"
        />
      </div>
      <button
        className=" px-4 py-2 w-1/3 mt-4 bg-black text-white rounded"
        type="submit"
      >
        Add Job
      </button>
    </form>
  );
};

export default AddJob;
