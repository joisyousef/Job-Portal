import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplication,
  updateUserResume,
} from "../controllers/userController.js";
import upload from "../configs/multer.js";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Get User Data
router.get("/", getUserData);

// Apply for a job
router.post("/apply", applyForJob);

// Get user's applied jobs
router.get("/applications", getUserJobApplication);

// Update User Profile (Resume)
router.post("/update-resume", upload.single("resume"), updateUserResume);

// Register a user - THIS IS THE MISSING ROUTE
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Test route to check if routes are working
router.get("/test", (req, res) => {
  res.json({ message: "User routes working!" });
});

export default router;
