import express from "express";
import {
  matchResume,
  resumeUpload,
} from "../controllers/resumeMatcherController.js";

const router = express.Router();

// Resume matching endpoint
router.post("/match-resume", resumeUpload, matchResume);

export default router;
