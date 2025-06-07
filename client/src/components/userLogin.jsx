import React, { useState, useEffect, useRef, useContext } from "react";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserLogin = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resume, setResume] = useState(null);
  const [image, setImage] = useState(null);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const {
    showUserLogin,
    setShowUserLogin,
    backendUrl,
    userData,
    setUserData,
    fetchUserApplications,
    isTokenLoading,
  } = useContext(AppContext);

  // Initialize visibility
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleOutsideClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      closePopup();
    }
  };

  const closePopup = () => {
    setIsVisible(false);
    setTimeout(() => setShowUserLogin(false), 300);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (state === "Sign Up") {
        if (!isTextDataSubmitted) {
          // Validate required fields
          if (!name.trim()) {
            setError("Full name is required");
            return;
          }
          if (!email.trim()) {
            setError("Email is required");
            return;
          }
          if (!password) {
            setError("Password is required");
            return;
          }

          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
          }

          // Password validation
          if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
          }

          setIsTextDataSubmitted(true);
          return;
        }

        // Complete registration with files
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("email", email.trim().toLowerCase());
        formData.append("password", password);

        if (resume) {
          formData.append("resume", resume);
        }
        if (image) {
          formData.append("image", image);
        }

        console.log("Submitting registration data:", {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          hasResume: !!resume,
          hasImage: !!image,
        });

        const { data } = await axios.post(
          `${backendUrl}/api/users/register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (data.success) {
          setUserData(data.user);
          localStorage.setItem("userToken", data.token);
          await fetchUserApplications();
          toast.success("Registration successful!");
          closePopup();
          navigate("/applications");
        } else {
          setError(data.message || "Registration failed");
          toast.error(data.message || "Registration failed");
        }
      } else {
        // Login validation
        if (!email.trim()) {
          setError("Email is required");
          return;
        }
        if (!password) {
          setError("Password is required");
          return;
        }

        const { data } = await axios.post(`${backendUrl}/api/users/login`, {
          email: email.trim().toLowerCase(),
          password,
        });

        if (data.success) {
          setUserData(data.user);
          localStorage.setItem("userToken", data.token);
          await fetchUserApplications();
          toast.success("Login successful!");
          closePopup();
          navigate("/applications");
        } else {
          setError(data.message || "Login failed");
          toast.error(data.message || "Login failed");
        }
      }
    } catch (err) {
      console.error("Request error:", err);
      let errorMessage = "An error occurred. Please try again.";

      if (err.response) {
        // Server responded with error status
        errorMessage =
          err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleFileChange = (e, setter) => {
    if (e.target.files?.[0]) {
      setter(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setResume(null);
    setImage(null);
    setIsTextDataSubmitted(false);
    setState("Login");
    setError("");
  };

  if (isTokenLoading) return null;

  return (
    showUserLogin && (
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm bg-black/50 flex justify-center items-center transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleOutsideClick}
      >
        <form
          ref={formRef}
          onSubmit={onSubmitHandler}
          className={`relative bg-white p-8 rounded-xl text-slate-500 shadow-xl border border-gray-100 flex flex-col gap-5 w-96 transition-transform duration-300 ${
            isVisible ? "scale-100" : "scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-2">
            <h1 className="text-2xl text-gray-800 font-semibold">
              User {state}
            </h1>
            <p className="text-sm mt-1 text-gray-500">
              {state === "Login"
                ? "Welcome back! Please sign in to continue."
                : isTextDataSubmitted
                ? "Complete your profile setup."
                : "Create an account to apply for jobs."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded shadow-sm text-sm flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {state === "Sign Up" && isTextDataSubmitted ? (
            <div className="flex flex-col gap-5">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-inner border-2 border-gray-200">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-blue-50 rounded-full p-4">
                      <img
                        src={assets.person_icon}
                        alt="Profile"
                        className="w-12 h-12 opacity-60"
                      />
                    </div>
                  )}
                </div>
                <label className="text-blue-600 font-medium cursor-pointer text-sm hover:text-blue-700 transition-colors flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setImage)}
                  />
                </label>
              </div>

              {/* Resume Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <label className="text-blue-600 font-medium cursor-pointer text-sm hover:text-blue-700 transition-colors">
                    {resume ? resume.name : "Upload Resume (Optional)"}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setResume)}
                    />
                  </label>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-600 w-full text-white py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Complete Sign Up
              </button>
              <button
                type="button"
                onClick={() => setIsTextDataSubmitted(false)}
                className="border-2 border-blue-600 text-blue-600 w-full py-2.5 rounded-lg font-medium cursor-pointer hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Back
              </button>
            </div>
          ) : (
            <>
              {/* Name Input (Sign Up only) */}
              {state !== "Login" && (
                <div className="border border-gray-300 rounded-lg flex items-center gap-3 px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <div className="text-gray-400">
                    <img
                      src={assets.person_icon}
                      alt=""
                      className="w-5 h-5 opacity-70"
                    />
                  </div>
                  <input
                    className="outline-none text-gray-700 w-full text-sm placeholder-gray-400"
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="border border-gray-300 rounded-lg flex items-center gap-3 px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <div className="text-gray-400">
                  <img
                    src={assets.email_icon}
                    alt=""
                    className="w-5 h-5 opacity-70"
                  />
                </div>
                <input
                  className="outline-none text-gray-700 w-full text-sm placeholder-gray-400"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="border border-gray-300 rounded-lg flex items-center gap-3 px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <div className="text-gray-400">
                  <img
                    src={assets.lock_icon}
                    alt=""
                    className="w-5 h-5 opacity-70"
                  />
                </div>
                <input
                  className="outline-none text-gray-700 w-full text-sm placeholder-gray-400"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Forgot Password (Login only) */}
              {state === "Login" && (
                <p className="text-sm text-right text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors">
                  Forgot Password?
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-600 w-full text-white py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {state === "Login" ? "Login" : "Continue"}
              </button>

              {/* Toggle State */}
              <p className="text-sm text-center text-gray-500">
                {state === "Login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <span
                  className="text-blue-600 font-medium cursor-pointer ml-1 hover:text-blue-800 transition-colors"
                  onClick={() => {
                    resetForm();
                    setState(state === "Login" ? "Sign Up" : "Login");
                  }}
                >
                  {state === "Login" ? "Sign Up" : "Login"}
                </span>
              </p>
            </>
          )}

          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            onClick={closePopup}
          >
            <img
              src={assets.cross_icon}
              alt="Close"
              className="w-5 h-5 hover:opacity-70 transition-opacity"
            />
          </button>
        </form>
      </div>
    )
  );
};

export default UserLogin;
