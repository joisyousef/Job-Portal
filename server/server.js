import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import "./configs/instrument.js";
import * as Sentry from "@sentry/node";
import { clerkWebhook } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

import userRoutes from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";

import resumeMatcherRoutes from "./routes/resumeMatcherRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import searchRoutes from "./routes/searchRoutes.js";
<<<<<<< HEAD
Testing;
=======
import userRoutes from "./routes/userRoutes.js";
>>>>>>> authentication

// Initialize express app
const app = express();

// Database connection
await connectDB();
await connectCloudinary();

// Middlewares
app.use(cors());

// IMPORTANT: Webhook route MUST be defined BEFORE express.json() middleware
// because webhooks need raw body for signature verification
app.post("/webhooks", express.raw({ type: "application/json" }), clerkWebhook);

// Apply JSON parsing middleware AFTER webhook routes
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ADD THIS LINE - for form data parsing
// app.use(clerkMiddleware()); // COMMENT THIS OUT temporarily - it might be interfering

app.use(express.json({ limit: "10mb" })); // Increased limit for potential large payloads
Testing;

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
<<<<<<< HEAD

=======
app.post("/webhooks", clerkWebhook);
app.use("/api/users", userRoutes);
>>>>>>> authentication
app.use("/api/company", companyRoutes);

app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

app.use("/api/jobs", jobRoutes); // This now includes search functionality
app.use("/api", resumeMatcherRoutes);
// Add this line in your routes section
app.use("/api/search", searchRoutes);
// Remove the duplicate searchRoutes line as it's now integrated into jobRoutes
// app.use("/api/search", searchRoutes); // Remove this line

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// 404 handler: no path means “all”
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
Testing;

// Port
const PORT = process.env.PORT || 5000;

// Sentry configuration
Sentry.setupExpressErrorHandler(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
