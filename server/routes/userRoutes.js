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
<<<<<<< HEAD
import upload from "../configs/multer.js";
import { registerUser, loginUser } from "../controllers/authController.js";
=======
import { protect, protectRole } from "../middlewares/authMiddleware.js";
>>>>>>> authentication

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// all routes below are user-only
router.use(protect, protectRole("user"));

router.get("/", getUserData);
router.post("/apply", applyForJob);
router.get("/applications", getUserJobApplication);
router.post("/update-resume", upload.single("resume"), updateUserResume);

<<<<<<< HEAD
// Register a user - THIS IS THE MISSING ROUTE
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Test route to check if routes are working
router.get("/test", (req, res) => {
  res.json({ message: "User routes working!" });
});

=======
>>>>>>> authentication
export default router;
