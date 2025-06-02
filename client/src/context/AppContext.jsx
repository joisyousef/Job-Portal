import { createContext, useState, useEffect } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });
  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([]);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  // Fixed variable names (removed typos)
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  // Add loading state to track when token is being loaded from localStorage
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  const fetchJobs = async () => {
    setJobs(jobsData);
  };

  // Function to fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/company", {
        headers: {
          token: companyToken,
        },
      });
      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
        console.log(data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJobs();

    const storedToken = localStorage.getItem("companyToken");
    if (storedToken) {
      setCompanyToken(storedToken);
    }
    // Set loading to false after checking localStorage
    setIsTokenLoading(false);
  }, []);

  useEffect(() => {
    if (companyToken) {
      // Fixed variable name
      fetchCompanyData();
    }
  }, [companyToken]); // Fixed variable name

  const value = {
    setSearchFilter,
    searchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken, // Fixed variable name
    setCompanyToken,
    companyData, // Fixed variable name
    setCompanyData,
    backendUrl,
    isTokenLoading, // Add this to the context value
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
