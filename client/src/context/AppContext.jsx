import { createContext, useState, useEffect } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });
  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([]);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  // Add loading state to track when token is being loaded from localStorage
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/jobs/");
      if (data.success) {
        setJobs(data.jobs);
      } else {
        toast.error(data.message);
        console.log(data);
      }
    } catch (error) {
      toast.error(error.message);
    }
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
    const storedToken = localStorage.getItem("companyToken");
    if (storedToken) {
      setCompanyToken(storedToken);
    }
    // Set loading to false after checking localStorage
    setIsTokenLoading(false);
  }, []);

  // Only fetch jobs after token loading is complete
  useEffect(() => {
    if (!isTokenLoading) {
      fetchJobs();
    }
  }, [isTokenLoading]);

  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Function to fetch user applied applications data
  const fetchUserApplications = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/users/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUserApplications(data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);

  const value = {
    setSearchFilter,
    searchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    isTokenLoading,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
    showUserLogin,
    setShowUserLogin,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
