import express from "express";
import {
  changeJobApplicationsStatus,
  changeVisiblity,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  registerCompany,
} from "../controllers/companyController";

const router = express.Router();

// Register a company
router.post("/register", registerCompany);

// Company login
router.post("/login", loginCompany);

// Get company data
router.get("/company", getCompanyData);

// Post a job
router.post("/post-job", postJob);

// Get applicants data of company
router.get("/applicants", getCompanyJobApplicants);

// Get company job list
router.get("list-jobs", getCompanyPostedJobs);

// Change application status
router.post("/change-status", changeJobApplicationsStatus);

// Change application visiblity
router.post("/change-visiblity", changeVisiblity);

export default router;
