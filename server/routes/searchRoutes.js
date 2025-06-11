import express from "express";
import {
  searchAllJobs,
  searchExternalJobs,
  getJobsByCompany,
  getJobsBySkills,
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

// Search routes
router.get("/all", searchRateLimit, searchJobsValidation, searchAllJobs);
router.get(
  "/external",
  externalJobsRateLimit,
  searchJobsValidation,
  searchExternalJobs
);
router.get("/company/:company", externalJobsRateLimit, getJobsByCompany);
router.post(
  "/skills",
  externalJobsRateLimit,
  skillsSearchValidation,
  getJobsBySkills
);

export default router;
