import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import kconvert from "k-convert";
import moment from "moment";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const ApplyJob = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [JobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const {
    jobs,
    backendUrl,
    userData,
    userApplications,
    fetchUserApplications,
  } = useContext(AppContext);

  const fetchJob = async () => {
    // First check local jobs array
    const localJob = jobs.filter((job) => job._id === id);
    if (localJob.length !== 0) {
      setJobData(localJob[0]);
      console.log("JobData from local:", localJob[0]);
      return; // Return early if found locally
    }

    // If not found locally, fetch from API
    try {
      const response = await axios.get(backendUrl + `/api/jobs/${id}`);
      if (response.data && response.data.success) {
        setJobData(response.data.job);
        console.log("JobData from API:", response.data.job);
      } else {
        toast.error(response.data?.message || "Failed to fetch job details");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch job details"
      );
    }
  };

  const applyHandler = async () => {
    try {
      // Check if user is logged in
      if (!userData) {
        toast.error("Please login to apply for the job");
        return; // Exit early
      }

      // Check if user has uploaded a resume
      if (!userData.resume) {
        toast.error("Please upload your resume to apply for the job");
        navigate("/applications");
        return; // Exit early
      }

      // Check if JobData exists
      if (!JobData || !JobData._id) {
        toast.error("Job information not available");
        return;
      }

      const token = await getToken();

      if (!token) {
        toast.error("Authentication failed. Please login again.");
        return;
      }

      const response = await axios.post(
        backendUrl + `/api/users/apply`,
        {
          jobId: JobData._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success(
          response.data.message || "Application submitted successfully!"
        );
        fetchUserApplications();
      } else {
        toast.error(response.data?.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to submit application"
      );
    }
  };

  const checkAlradyApplied = () => {
    const hasApplied = userApplications.some(
      (item) => item.jobId?._id === JobData?._id
    );
    setIsAlreadyApplied(hasApplied);
  };

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id, jobs]); // Added jobs as dependency

  useEffect(() => {
    if (userApplications.length > 0 && JobData) {
      checkAlradyApplied();
    }
  }, [JobData, userApplications, id]);

  return JobData ? (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={JobData.companyId?.image || "/default-company-logo.png"}
                alt="Company logo"
              />
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {JobData.title}
                </h1>
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center gap-2">
                    <img src={assets.suitcase_icon} alt="" />
                    {JobData.companyId?.name || "Unknown Company"}
                  </span>
                  <span className="flex items-center gap-2">
                    <img src={assets.location_icon} alt="" />
                    {JobData.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <img src={assets.person_icon} alt="" />
                    {JobData.level}
                  </span>
                  <span className="flex items-center gap-2">
                    <img src={assets.money_icon} alt="" />
                    Salary:{" "}
                    {JobData.salary
                      ? kconvert.convertTo(JobData.salary)
                      : "Not specified"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={applyHandler}
                className="bg-blue-600 p-2.5 px-10 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {isAlreadyApplied ? "Already Applied" : "Apply Now"}
              </button>
              <p className="mt-1 text-gray-600">
                Posted{" "}
                {JobData.date ? moment(JobData.date).fromNow() : "Recently"}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-1/3">
              <h2 className="font-bold text-2xl mb-4">Job Description</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{
                  __html: JobData.description || "No description available",
                }}
              ></div>
              <button
                onClick={applyHandler}
                className="bg-blue-600 p-2.5 px-10 text-white rounded hover:bg-blue-700 transition-colors mt-4"
              >
                {isAlreadyApplied ? "Already Applied" : "Apply Now"}
              </button>
            </div>
            {/* Right side More Jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>
                More Jobs from {JobData.companyId?.name || "this Company"}
              </h2>
              {(() => {
                // Set of applied jobIds
                const appliedJobIds = new Set(
                  Array.isArray(userApplications)
                    ? userApplications.map((app) => app.jobId && app.jobId._id)
                    : []
                );
                return jobs
                  .filter((job) => !appliedJobIds.has(job._id))
                  .slice(0, 4)
                  .map((job, index) => <JobCard key={index} job={job} />);
              })()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default ApplyJob;
