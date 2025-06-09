import express from "express";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/resumes";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".pdf", ".docx", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOCX, and TXT files are allowed."
        )
      );
    }
  },
});

// Python microservice URL
const PYTHON_SERVICE_URL =
  process.env.PYTHON_SERVICE_URL || "http://localhost:5001";

// Resume matching endpoint
router.post("/match-resume", upload.single("resume"), async (req, res) => {
  let uploadedFilePath = null;

  try {
    // Validate inputs
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No resume file uploaded",
      });
    }

    if (!req.body.jobDescription || !req.body.jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        error: "Job description is required",
      });
    }

    uploadedFilePath = req.file.path;

    // Create form data to send to Python service
    const formData = new FormData();
    formData.append("resume", fs.createReadStream(uploadedFilePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append("jobDescription", req.body.jobDescription.trim());

    // Call Python microservice
    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/api/match-resume`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 60000, // 60 second timeout
      }
    );

    // Return the result
    res.json({
      success: true,
      data: {
        score: response.data.score,
        feedback: response.data.feedback,
        message: response.data.message || "Resume analyzed successfully",
      },
    });
  } catch (error) {
    console.error("Error processing resume:", error.message);

    let errorMessage = "Failed to process resume";
    let statusCode = 500;

    if (error.code === "ECONNREFUSED") {
      errorMessage =
        "Resume processing service is unavailable. Please try again later.";
      statusCode = 503;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
      statusCode = error.response.status || 400;
    } else if (error.message.includes("Invalid file type")) {
      errorMessage = error.message;
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  } finally {
    // Clean up uploaded file
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (cleanupError) {
        console.error("Error cleaning up uploaded file:", cleanupError.message);
      }
    }
  }
});

// Health check for resume matcher service
router.get("/resume-matcher/health", async (req, res) => {
  try {
    const response = await axios.get(`${PYTHON_SERVICE_URL}/health`, {
      timeout: 5000,
    });

    res.json({
      success: true,
      pythonService: response.data,
      nodeService: { status: "healthy" },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: "Resume matcher service is unavailable",
      nodeService: { status: "healthy" },
      pythonService: { status: "unavailable" },
    });
  }
});

export default router;
