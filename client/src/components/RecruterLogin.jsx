import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruterLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

  const { setShowRecruterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Multistep Signup: Step 1 (Text Data) -> Step 2 (Logo Upload)
    if (state === "Signup" && !isTextDataSubmitted) {
      return setIsTextDataSubmitted(true);
    }

    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/company/login`, {
          email,
          password,
        });

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruterLogin(false);
          navigate("/dashboard");
          toast.success("Welcome back to your dashboard!");
        } else {
          toast.error(data.message);
        }
      } else {
        // Register Logic
        if (!image) return toast.error("Please upload a company logo");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);

        const { data } = await axios.post(
          `${backendUrl}/api/company/register`,
          formData,
        );

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruterLogin(false);
          navigate("/dashboard");
          toast.success("Company Account Created!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex justify-center items-center w-full h-full">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-10 rounded-xl text-slate-500 shadow-2xl max-w-md w-full mx-4"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-semibold mb-2">
          Recruiter {state}
        </h1>
        <p className="text-sm text-center mb-6">
          {state === "Login"
            ? "Sign in to manage your job listings"
            : "Create an account to start hiring"}
        </p>

        {state === "Signup" && isTextDataSubmitted ? (
          <div className="flex flex-col items-center gap-4 my-8">
            <label htmlFor="image" className="relative group cursor-pointer">
              <img
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 group-hover:border-blue-200 transition-all"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Logo Preview"
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                hidden
                id="image"
                accept="image/*"
                required
              />
            </label>
            <p className="text-center font-medium">Upload Company Logo</p>
            <button
              type="button"
              className="text-xs text-blue-500 underline"
              onClick={() => setIsTextDataSubmitted(false)}
            >
              Go back to edit details
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {state !== "Login" && (
              <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full focus-within:border-blue-500">
                <img src={assets.person_icon} alt="" className="w-4" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                  className="outline-none text-sm w-full bg-transparent"
                />
              </div>
            )}
            <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full focus-within:border-blue-500">
              <img src={assets.email_icon} alt="" className="w-4" />
              <input
                className="outline-none text-sm w-full bg-transparent"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Company Email"
                required
              />
            </div>
            <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full focus-within:border-blue-500">
              <img src={assets.lock_icon} alt="" className="w-4" />
              <input
                className="outline-none text-sm w-full bg-transparent"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-full px-6 mt-6 transition-all w-full font-medium"
        >
          {state === "Login"
            ? "Login"
            : isTextDataSubmitted
              ? "Create Account"
              : "Next"}
        </button>

        <p className="mt-6 text-center text-sm">
          {state === "Login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => {
              setState(state === "Login" ? "Signup" : "Login");
              setIsTextDataSubmitted(false);
            }}
          >
            {state === "Login" ? "Sign Up" : "Login"}
          </span>
        </p>

        <img
          onClick={() => setShowRecruterLogin(false)}
          className="absolute top-5 right-5 cursor-pointer w-4 opacity-50 hover:opacity-100 transition-opacity"
          src={assets.cross_icon}
          alt="close"
        />
      </form>
    </div>
  );
};

export default RecruterLogin;
