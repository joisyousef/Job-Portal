// controllers/searchController.js
import axios from "axios";

const SEARCHAPI_BASE_URL = "https://www.searchapi.io/api/v1";

// Search jobs using SearchAPI.io
export const searchJobs = async (req, res) => {
  try {
    const {
      query,
      location,
      job_type,
      date_posted,
      remote_jobs_only,
      employment_type,
      num_pages = 1,
      start = 0,
    } = req.query;

    // Validate required parameters
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Prepare search parameters
    const searchParams = {
      engine: "google_jobs",
      q: query,
      api_key: process.env.SEARCHAPI_KEY,
    };

    // Add optional parameters if provided
    if (location) searchParams.location = location;
    if (job_type) searchParams.job_type = job_type;
    if (date_posted) searchParams.date_posted = date_posted;
    if (remote_jobs_only) searchParams.remote_jobs_only = remote_jobs_only;
    if (employment_type) searchParams.employment_type = employment_type;
    if (num_pages) searchParams.num_pages = num_pages;
    if (start) searchParams.start = start;

    // Make API request to SearchAPI.io
    const response = await axios.get(`${SEARCHAPI_BASE_URL}/search`, {
      params: searchParams,
      timeout: 10000, // 10 second timeout
    });

    // Process and return the results
    const jobs = response.data.jobs_results || [];

    res.json({
      success: true,
      data: {
        jobs: jobs.map((job) => ({
          id: job.job_id,
          title: job.title,
          company_name: job.company_name,
          location: job.location,
          description: job.description,
          posted_at: job.detected_extensions?.posted_at,
          job_type: job.detected_extensions?.schedule_type,
          salary: job.detected_extensions?.salary,
          apply_link: job.apply_link,
          source: "searchapi",
        })),
        search_metadata: response.data.search_metadata,
        total_results: response.data.search_information?.total_results || 0,
      },
    });
  } catch (error) {
    console.error("SearchAPI Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Failed to search jobs",
      error: error.response?.data?.error || error.message,
    });
  }
};

// Get job details by ID from SearchAPI.io
export const getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const response = await axios.get(`${SEARCHAPI_BASE_URL}/search`, {
      params: {
        engine: "google_jobs_listing",
        q: jobId,
        api_key: process.env.SEARCHAPI_KEY,
      },
      timeout: 10000,
    });

    const jobDetails = response.data.job_details || null;

    if (!jobDetails) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      job: {
        id: jobDetails.job_id,
        title: jobDetails.title,
        company_name: jobDetails.company_name,
        location: jobDetails.location,
        description: jobDetails.description,
        posted_at: jobDetails.posted_at,
        job_type: jobDetails.schedule_type,
        salary: jobDetails.salary,
        benefits: jobDetails.benefits,
        qualifications: jobDetails.qualifications,
        responsibilities: jobDetails.responsibilities,
        apply_link: jobDetails.apply_link,
        source: "searchapi",
      },
    });
  } catch (error) {
    console.error(
      "SearchAPI Job Details Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to get job details",
      error: error.response?.data?.error || error.message,
    });
  }
};

// Search for companies
export const searchCompanies = async (req, res) => {
  try {
    const { company_name, location } = req.query;

    if (!company_name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const searchParams = {
      engine: "google",
      q: `${company_name} jobs ${location || ""}`.trim(),
      api_key: process.env.SEARCHAPI_KEY,
    };

    const response = await axios.get(`${SEARCHAPI_BASE_URL}/search`, {
      params: searchParams,
      timeout: 10000,
    });

    const results = response.data.organic_results || [];

    res.json({
      success: true,
      data: {
        companies: results.map((result) => ({
          title: result.title,
          link: result.link,
          snippet: result.snippet,
          source: "searchapi",
        })),
      },
    });
  } catch (error) {
    console.error(
      "SearchAPI Company Search Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to search companies",
      error: error.response?.data?.error || error.message,
    });
  }
};
