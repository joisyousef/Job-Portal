import Job from "../models/Job.js";
import searchService from "../services/searchService.js";
import { validationResult } from "express-validator";

// Your existing methods
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true }).populate({
      path: "companyId",
      select: "-password",
    });
    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate({
      path: "companyId",
      select: "-password",
    });
    if (!job) {
      return res.json({
        success: false,
        message: "Job not found",
      });
    }
    res.json({
      success: true,
      job,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

// NEW: Combined search - both internal and external jobs
export const searchAllJobs = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { q: query, location, includeExternal = true } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    // Search internal jobs (your existing database)
    const internalJobsQuery = {
      visible: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { skills: { $in: [new RegExp(query, "i")] } },
      ],
    };

    if (location) {
      internalJobsQuery.location = { $regex: location, $options: "i" };
    }

    const internalJobs = await Job.find(internalJobsQuery)
      .populate({
        path: "companyId",
        select: "-password",
      })
      .limit(20);

    let externalJobs = [];
    let externalError = null;

    // Search external jobs if requested
    if (includeExternal === "true") {
      const externalResult = await searchService.searchExternalJobs(
        query,
        location
      );
      if (externalResult.success) {
        externalJobs = externalResult.data.jobs || [];
      } else {
        externalError = externalResult.error;
      }
    }

    res.json({
      success: true,
      data: {
        internal: {
          jobs: internalJobs,
          count: internalJobs.length,
        },
        external: {
          jobs: externalJobs,
          count: externalJobs.length,
          error: externalError,
        },
      },
      totalResults: internalJobs.length + externalJobs.length,
    });
  } catch (error) {
    console.error("Search all jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// NEW: Search only external jobs (Google Jobs via SearchAPI)
export const searchExternalJobs = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { q: query, location, ...otherParams } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      });
    }

    const result = await searchService.searchExternalJobs(
      query,
      location,
      otherParams
    );

    if (!result.success) {
      return res.status(result.status || 500).json(result);
    }

    res.json({
      success: true,
      data: result.data.jobs || [],
      metadata: {
        totalJobs: result.totalJobs,
        searchInfo: result.data.search_information,
        pagination: result.data.pagination,
      },
    });
  } catch (error) {
    console.error("Search external jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// NEW: Get jobs by company (external)
export const getJobsByCompany = async (req, res) => {
  try {
    const { company } = req.params;
    const { location } = req.query;

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company parameter is required",
      });
    }

    const result = await searchService.searchJobsByCompany(company, location);

    if (!result.success) {
      return res.status(result.status || 500).json(result);
    }

    res.json({
      success: true,
      data: result.data.jobs || [],
      company: company,
      totalJobs: result.totalJobs,
    });
  } catch (error) {
    console.error("Get jobs by company error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// NEW: Get jobs by skills (external)
export const getJobsBySkills = async (req, res) => {
  try {
    const { skills } = req.body;
    const { location } = req.query;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Skills array is required in request body",
      });
    }

    const result = await searchService.searchJobsBySkills(skills, location);

    if (!result.success) {
      return res.status(result.status || 500).json(result);
    }

    res.json({
      success: true,
      data: result.data.jobs || [],
      skills: skills,
      totalJobs: result.totalJobs,
    });
  } catch (error) {
    console.error("Get jobs by skills error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
