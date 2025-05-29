import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplication,
  updateUserResume,
} from "../controllers/userController.js";
import upload from "../configs/multer.js";

const router = express.Router();

// Get User Data
router.get("/", getUserData);

// Apply for a job
router.post("/apply", applyForJob);

// Get user's applied jobs
router.get("/applications", getUserJobApplication);

// Update User Profile (Resume)
router.post("/update-resume", upload.single("resume"), updateUserResume);

export default router;
