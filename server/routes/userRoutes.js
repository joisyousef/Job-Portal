import express from "express";
import upload from "../configs/multer.js";
import {
  registerUser,
  loginUser,
  getUserData,
  applyForJob,
  getUserJobApplication,
  updateUserResume,
} from "../controllers/userController.js";
import { protect, protectRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// all routes below are user-only
router.use(protect, protectRole("user"));

router.get("/", getUserData);
router.post("/apply", applyForJob);
router.get("/applications", getUserJobApplication);
router.post("/update-resume", upload.single("resume"), updateUserResume);

export default router;
