import { React, useState, useEffect, useRef, useContext } from "react";
import assets from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruitersLogin = () => {
  const navigate = useNavigate();

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const formRef = useRef(null);

  // Properly access the context
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  // Initialize visibility on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    // Add event listener for escape key
    document.addEventListener("keydown", handleEscKey);

    // Clean up event listener
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  // Handle click outside
  const handleOutsideClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      closePopup();
    }
  };

  // Closing animation function
  const closePopup = () => {
    setIsVisible(false);
    // Use setTimeout to allow animation to complete before removing component
    setTimeout(() => {
      setShowRecruiterLogin(false);
    }, 300);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (state === "Sign Up") {
        if (!isTextDataSubmitted) {
          if (!name || !email || !password) {
            setError("All fields are required");
            return;
          }

          // Here you would typically call your API to register a new user
          console.log("Signing up with:", { name, email, password });
          // Example API call:
          // const response = await fetch('/api/recruiters/signup', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ name, email, password })
          // });

          setIsTextDataSubmitted(true);
        } else {
          // Handle the full sign up submission with profile image if needed
          const formData = new FormData();
          formData.append("name", name);
          formData.append("email", email);
          formData.append("password", password);
          if (image) {
            formData.append("profileImage", image);
          }

          // Example API call with image:
          // const response = await fetch('/api/recruiters/complete-signup', {
          //   method: 'POST',
          //   body: formData
          // });

          console.log("Complete signup with:", {
            name,
            email,
            password,
            image,
          });

          // Reset form after submission
          resetForm();
          // Close the popup after successful signup
          closePopup();
        }
      } else {
        // Login logic
        if (!email || !password) {
          setError("Email and password are required");
          return;
        }

        try {
          if (state === "Login") {
            const { data } = await axios.post(
              backendUrl + "/api/company/login",
              { email, password }
            );
            if (data.success) {
              // Handle successful login, e.g., store token, redirect, etc.
              setCompanyToken(data.token);
              setCompanyData(data.company);
              localStorage.setItem("companyToken", data.token);
              // closePopup();
              setShowRecruiterLogin(false);
              navigate("/dashboard");
            } else {
              toast.error(data.message || "Login failed");
            }
          } else {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("image", image);
            const { data } = await axios.post(
              backendUrl + "/api/company/register",
              formData
            );
            if (data.success) {
              // Handle successful registration
              setCompanyToken(data.token);
              setCompanyData(data.company);
              localStorage.setItem("companyToken", data.token);
              // closePopup();
              setShowRecruiterLogin(false);
              navigate("/dashboard");
            } else {
              toast.error(data.message || "Registration failed");
            }
          }
        } catch (error) {
          console.error(error);
        }

        // Example login API call:
        // const response = await fetch('/api/recruiters/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password })
        // });

        // console.log("Logging in with:", { email, password });

        // Handle login success
        // If login successful, you might want to redirect or update app state
        // Close the popup after successful login
        // closePopup();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Form submission error:", err);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setImage(null);
    setIsTextDataSubmitted(false);
    setState("Login");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset"; // Reset overflow when component unmounts
    };
  }, []);

  return (
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
        onClick={(e) => e.stopPropagation()} // Prevent clicks on form from bubbling to backdrop
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl text-gray-800 font-semibold">
            Recruiters {state}
          </h1>
          <p className="text-sm mt-1 text-gray-500">
            {state === "Login"
              ? "Welcome back! Please sign in to continue."
              : "Create an account to get started."}
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
                Upload Company Logo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
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
                  placeholder="Company Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

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
                placeholder="Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

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

            {state === "Login" && (
              <p className="text-sm text-right text-blue-600 font-medium cursor-pointer hover:text-blue-800 transition-colors">
                Forgot Password?
              </p>
            )}

            <button
              type="submit"
              className="bg-blue-600 w-full text-white py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {state === "Login" ? "Login" : "Continue"}
            </button>

            <p className="text-sm text-center text-gray-500">
              {state === "Login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <span
                className="text-blue-600 font-medium cursor-pointer ml-1 hover:text-blue-800 transition-colors"
                onClick={() => {
                  setState(state === "Login" ? "Sign Up" : "Login");
                  setIsTextDataSubmitted(false);
                  setError("");
                }}
              >
                {state === "Login" ? "Sign Up" : "Login"}
              </span>
            </p>
          </>
        )}

        {/* Close button */}
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
  );
};

export default RecruitersLogin;
