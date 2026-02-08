import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserLogin = () => {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const { setShowUserLogin, backendUrl, setUserToken, setUserData } =
    useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/users/login`, {
          email,
          password,
        });

        if (data.success) {
          setUserData(data.user);
          setUserToken(data.token);
          localStorage.setItem("userToken", data.token);
          setShowUserLogin(false);
          toast.success("Login Successful");
        } else {
          toast.error(data.message);
        }
      } else {
        // Sign Up Logic
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) formData.append("image", image);

        const { data } = await axios.post(
          `${backendUrl}/api/users/register`,
          formData,
        );

        if (data.success) {
          setUserData(data.user);
          setUserToken(data.token);
          localStorage.setItem("userToken", data.token);
          setShowUserLogin(false);
          toast.success("Account Created Successfully");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Prevent background scrolling when modal is open
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
        <h1 className="text-center text-2xl text-neutral-700 font-semibold">
          User {state}
        </h1>
        <p className="text-sm text-center mb-6">
          {state === "Login"
            ? "Sign in to find jobs"
            : "Create an account to apply"}
        </p>

        {state === "Signup" && (
          <div className="flex flex-col items-center gap-2 mb-4">
            <label htmlFor="image" className="relative group cursor-pointer">
              <img
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-400 transition-all"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Profile"
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                hidden
                id="image"
                accept="image/*"
              />
            </label>
            <p className="text-xs">Upload Profile Photo</p>
          </div>
        )}

        {state === "Signup" && (
          <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mb-4 focus-within:border-blue-500">
            <img src={assets.person_icon} alt="" className="w-4" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Full Name"
              required
              className="outline-none text-sm w-full bg-transparent"
            />
          </div>
        )}

        <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mb-4 focus-within:border-blue-500">
          <img src={assets.email_icon} alt="" className="w-4" />
          <input
            className="outline-none text-sm w-full bg-transparent"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email Address"
            required
          />
        </div>

        <div className="border border-gray-300 px-4 py-2 flex items-center gap-2 rounded-full mb-4 focus-within:border-blue-500">
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

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-full px-6 mt-4 transition-all w-full font-medium"
        >
          {state === "Login" ? "Login" : "Create Account"}
        </button>

        <p className="mt-6 text-center text-sm">
          {state === "Login" ? "New here? " : "Already have an account? "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => setState(state === "Login" ? "Signup" : "Login")}
          >
            {state === "Login" ? "Sign Up" : "Login"}
          </span>
        </p>

        <img
          onClick={() => setShowUserLogin(false)}
          className="absolute top-5 right-5 cursor-pointer w-4 opacity-50 hover:opacity-100 transition-opacity"
          src={assets.cross_icon}
          alt="close"
        />
      </form>
    </div>
  );
};

export default UserLogin;
