import { query, body } from "express-validator";

export const searchJobsValidation = [
  query("q")
    .notEmpty()
    .withMessage("Query parameter is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Query must be between 2 and 100 characters"),
  query("location")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Location must be less than 50 characters"),
];

export const skillsSearchValidation = [
  body("skills")
    .isArray({ min: 1, max: 10 })
    .withMessage("Skills must be an array with 1-10 items"),
  body("skills.*")
    .isString()
    .isLength({ min: 2, max: 30 })
    .withMessage("Each skill must be a string between 2-30 characters"),
];
