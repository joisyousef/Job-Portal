// server/controllers/userController.js
import fs from "fs";
import multer from "../configs/multer.js"; // if you need file storage
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

/**
 * Register candidate
 * POST /api/users/register
 */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  try {
    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: "Email in use" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    return res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken({ id: user._id, email, role: "user" }),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Login candidate
 * POST /api/users/login
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid creds" });
    }
    return res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken({ id: user._id, email, role: "user" }),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get User Data
 * GET /api/users/
 * (protected, user-only)
 */
export const getUserData = async (req, res) => {
  // req.user loaded by protectRole("user")
  res.json({ success: true, user: req.user });
};

/**
 * Apply for a job
 * POST /api/users/apply
 * Body: { jobId }
 */
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user._id;
  if (!jobId) {
    return res.status(400).json({ success: false, message: "jobId required" });
  }
  try {
    const job = await Job.findById(jobId);
    if (!job || !job.visible) {
      return res
        .status(404)
        .json({ success: false, message: "Job unavailable" });
    }
    if (await Application.findOne({ userId, jobId })) {
      return res
        .status(409)
        .json({ success: false, message: "Already applied" });
    }
    const application = await Application.create({
      userId,
      jobId,
      resume: req.user.resume || "",
      appliedAt: Date.now(),
      status: "pending",
    });
    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get user's applied jobs
 * GET /api/users/applications
 */
export const getUserJobApplication = async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.user._id,
    }).populate({
      path: "jobId",
      select: "title companyId location",
      populate: { path: "companyId", select: "name image" },
    });
    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update User Profile (Resume)
 * POST /api/users/update-resume
 * multipart/form-data: field "resume"
 */
export const updateUserResume = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Resume file required" });
  }
  try {
    // delete old if local
    if (req.user.resume && fs.existsSync(req.user.resume)) {
      fs.unlinkSync(req.user.resume);
    }
    // save new path (or URL if you use Cloudinary)
    req.user.resume = req.file.path;
    await req.user.save();
    res.json({ success: true, resume: req.user.resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
