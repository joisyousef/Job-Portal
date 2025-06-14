import express from "express";
import {
  getJobs,
  getJobById,
  searchAllJobs,
  searchExternalJobs,
  getJobsByCompany,
  getJobsBySkills,
  // ... your other existing imports
} from "../controllers/jobsController.js";
import {
  searchJobsValidation,
  skillsSearchValidation,
} from "../middlewares/jobsValidation.js";
import {
  searchRateLimit,
  externalJobsRateLimit,
} from "../middlewares/rateLimiter.js";

const router = express.Router();

// Your existing routes
router.get("/", getJobs);
router.get("/:id", getJobById);
// ... your other existing routes

// NEW: Search routes
router.get("/search/all", searchRateLimit, searchJobsValidation, searchAllJobs);
router.get(
  "/search/external",
  externalJobsRateLimit,
  searchJobsValidation,
  searchExternalJobs
);
router.get("/search/company/:company", externalJobsRateLimit, getJobsByCompany);
router.post(
  "/search/skills",
  externalJobsRateLimit,
  skillsSearchValidation,
  getJobsBySkills
);

export default router;
