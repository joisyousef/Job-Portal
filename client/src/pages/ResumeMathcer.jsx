import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ResumeMatcherPage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // SVG Icons as components
  const UploadIcon = () => (
    <svg
      className="w-12 h-12 mx-auto mb-4 text-blue-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  );

  const FileTextIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  const BriefcaseIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
      />
    </svg>
  );

  const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const AlertCircleIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const LoaderIcon = ({ className = "w-6 h-6" }) => (
    <svg
      className={`${className} animate-spin`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const TargetIcon = ({ className = "w-10 h-10" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
      />
    </svg>
  );

  const TrendingUpIcon = ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  );

  const LightbulbIcon = ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );

  const StarIcon = ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );

  const showToast = (message, type = "info") => {
    // Simple toast notification - you can replace with your toast library
    console.log(`${type.toUpperCase()}: ${message}`);
    // Create a simple toast element
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
      type === "success"
        ? "bg-green-500"
        : type === "error"
        ? "bg-red-500"
        : "bg-blue-500"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const handleFileUpload = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const maxSize = 16 * 1024 * 1024; // 16MB

    if (!allowedTypes.includes(file.type)) {
      showToast("Please upload PDF, DOCX, or TXT files only", "error");
      return;
    }

    if (file.size > maxSize) {
      showToast("File size must be less than 16MB", "error");
      return;
    }

    setResumeFile(file);
    showToast("Resume uploaded successfully", "success");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      showToast("Please upload your resume", "error");
      return;
    }

    if (!jobDescription.trim()) {
      showToast("Please provide a job description", "error");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);

      // Replace with your actual backend URL
      const backendUrl = "http://localhost:5001"; // Update this URL
      const response = await fetch(`${backendUrl}/api/match-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          score: data.score,
          feedback: data.feedback,
        });
        showToast("Resume analysis completed!", "success");
      } else {
        showToast(data.error || "Analysis failed", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to analyze resume", "error");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircleIcon />;
    if (score >= 60) return <AlertCircleIcon />;
    return <AlertCircleIcon />;
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-emerald-500 to-green-600";
    if (score >= 60) return "from-amber-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-pink-200 rounded-full opacity-20 blur-xl"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-blue-400 rounded-full opacity-30"></div>
        </div>
        <div className="absolute top-1/3 left-1/4">
          <div className="w-1 h-1 bg-purple-400 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/4">
          <div className="w-2 h-2 bg-indigo-400 rounded-full opacity-30"></div>
        </div>
        <div className="absolute top-2/3 left-3/4">
          <div className="w-1 h-1 bg-pink-400 rounded-full opacity-40"></div>
        </div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30"></div>
                <div className="relative bg-white p-4 rounded-full shadow-lg">
                  <TargetIcon className="w-10 h-10 text-blue-600" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Resume Matcher
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Discover how well your resume aligns with job requirements using
              AI-powered analysis. Get personalized insights and recommendations
              to boost your application success rate.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Upload and Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="p-8 space-y-8">
                  {/* Resume Upload Section */}
                  <div>
                    <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                      <FileTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Upload Your Resume
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                        dragActive
                          ? "border-blue-400 bg-blue-50/50 scale-105"
                          : resumeFile
                          ? "border-emerald-400 bg-emerald-50/50"
                          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() =>
                        document.querySelector('input[type="file"]').click()
                      }
                    >
                      {resumeFile ? (
                        <div className="text-emerald-600">
                          <div className="relative inline-block mb-4">
                            <CheckCircleIcon className="w-12 h-12 mx-auto" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                          </div>
                          <p className="font-semibold text-lg">
                            {resumeFile.name}
                          </p>
                          <p className="text-sm text-emerald-500 mt-1">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <UploadIcon />
                          <p className="font-semibold text-lg mb-2">
                            Drop your resume here
                          </p>
                          <p className="text-sm">
                            or click to browse your files
                          </p>
                          <p className="text-xs mt-2 text-gray-400">
                            PDF, DOCX, and TXT files (max 16MB)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                        onClick={(e) => {
                          const input = e.target;
                          input.value = "";
                        }}
                      />
                      {!resumeFile && (
                        <button
                          type="button"
                          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            document
                              .querySelector('input[type="file"]')
                              .click();
                          }}
                        >
                          Choose File
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Job Description Section */}
                  <div>
                    <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                      <BriefcaseIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Job Description
                    </label>
                    <div className="relative">
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the complete job description here for accurate analysis..."
                        className="w-full h-48 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 shadow-sm"
                        required
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                        {jobDescription.length} characters
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <LightbulbIcon className="w-4 h-4 mr-1" />
                      Copy and paste the complete job posting for the most
                      accurate analysis
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !resumeFile || !jobDescription.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center font-semibold text-lg shadow-lg transform hover:scale-[1.02] hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <LoaderIcon className="w-6 h-6 mr-3" />
                        Analyzing Your Resume...
                      </>
                    ) : (
                      <>
                        <TargetIcon className="w-6 h-6 mr-3" />
                        Analyze Resume Match
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Results Section */}
              {result && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <TrendingUpIcon className="w-6 h-6 text-blue-600 mr-3" />
                      <h3 className="text-2xl font-bold text-gray-900">
                        Analysis Results
                      </h3>
                    </div>

                    {/* Score Display */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-gray-700">
                          Match Score
                        </span>
                        <div
                          className={`flex items-center px-4 py-2 rounded-full border ${getScoreColor(
                            result.score
                          )}`}
                        >
                          {getScoreIcon(result.score)}
                          <span className="ml-2 font-bold text-xl">
                            {result.score}%
                          </span>
                        </div>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getScoreGradient(
                            result.score
                          )} transition-all duration-1000 ease-out shadow-lg`}
                          style={{ width: `${result.score}%` }}
                        >
                          <div className="h-full bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <StarIcon className="w-5 h-5 text-blue-600 mr-2" />
                        Personalized Recommendations
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {result.feedback}
                      </p>
                    </div>

                    {/* Score Interpretation */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-gray-700">
                        <strong className="text-gray-900">
                          Score Interpretation:{" "}
                        </strong>
                        {result.score >= 80 &&
                          "Excellent match! Your resume aligns very well with the job requirements."}
                        {result.score >= 60 &&
                          result.score < 80 &&
                          "Good match! Consider adding some missing keywords to improve your score."}
                        {result.score < 60 &&
                          "Consider significant updates to better match the job requirements."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Tips */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-8">
                <div className="flex items-center mb-6">
                  <LightbulbIcon className="w-6 h-6 text-amber-500 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Pro Tips</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Resume Optimization
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2 ml-4">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Include relevant keywords from the job description
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Highlight specific skills mentioned in the posting
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Use action verbs and quantifiable achievements
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        Match the job title and required experience level
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      File Guidelines
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2 ml-4">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        Use PDF format for best text extraction
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        Ensure text is selectable (not image-based)
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        Keep file size under 16MB
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        Use standard fonts and formatting
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Score Legend */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                    Score Legend
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">
                        80-100%: Excellent Match
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">60-79%: Good Match</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">
                        0-59%: Needs Improvement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeMatcherPage;
