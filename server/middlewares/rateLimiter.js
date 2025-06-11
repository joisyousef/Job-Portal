import rateLimit from "express-rate-limit";

export const searchRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 search requests per windowMs
  message: {
    success: false,
    message: "Too many search requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const externalJobsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit external API calls more strictly
  message: {
    success: false,
    message: "Too many external job search requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
