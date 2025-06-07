import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import "./configs/instrument.js";
import * as Sentry from "@sentry/node";
import { clerkWebhook } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";

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

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// Port
const PORT = process.env.PORT || 5000;
// Sentry configuration
Sentry.setupExpressErrorHandler(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
