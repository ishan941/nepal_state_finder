import React, { useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/Oauth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(data.message));
      console.error("Request failed:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="p-6 max-w-md w-full shadow-lg rounded-lg bg-white">
        <h1 className="text-2xl text-center font-bold mb-6">Sign In</h1>

        {/* Show error message if exists */}

        <form onSubmit={handelSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="email"
            onChange={handelChange}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="password"
            onChange={handelChange}
          />

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg font-semibold uppercase hover:bg-blue-700 transition-all"
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
          <OAuth />
        </form>

        {/* Sign In Redirect */}
        <div className="flex justify-center gap-2 mt-4 text-sm">
          <p>Don't have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-600 hover:underline">Sign Up</span>
          </Link>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      </div>
    </div>
  );
};

export default SignIn;
