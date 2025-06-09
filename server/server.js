import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import "./configs/instrument.js";
import * as Sentry from "@sentry/node";
import { clerkWebhook } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import resumeMatcherRoutes from "./routes/resumeMatcherRoutes.js"; // Add this import
import connectCloudinary from "./configs/cloudinary.js";

// Initialize express app
const app = express();

// Database connection
await connectDB();
await connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.post("/webhooks", clerkWebhook);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", resumeMatcherRoutes); // Add this line

// Port
const PORT = process.env.PORT || 5000;
// Sentry configuration
Sentry.setupExpressErrorHandler(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
