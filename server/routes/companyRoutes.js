// server/routes/companyRoutes.js
import express from "express";
import upload from "../configs/multer.js";
import {
  changeJobApplicationsStatus,
  changeVisiblity,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  registerCompany,
  postJob,
} from "../controllers/companyController.js";
import { protect, protectRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", upload.single("image"), registerCompany);
router.post("/login", loginCompany);

// All routes below require a valid JWT and recruiter role
router.use(protect, protectRole("recruiter"));

router.get("/company", getCompanyData);
router.post("/post-job", upload.none(), postJob);
router.get("/applicants", getCompanyJobApplicants);
router.get("/list-jobs", getCompanyPostedJobs);
router.post("/change-status", changeJobApplicationsStatus);
router.post("/change-visiblity", changeVisiblity);

export default router;
