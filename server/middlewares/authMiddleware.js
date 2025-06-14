import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import User from "../models/User.js";

/**
 * Base JWT verification. Always populates `req.auth` with { id, email, role }.
 * If invalid, returns 401.
 */
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded; // { id, email, role }
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/**
 * Role guard factory. E.g. protectRole("recruiter").
 * Must be used *after* `protect`.
 */
export const protectRole = (role) => async (req, res, next) => {
  if (!req.auth) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  if (req.auth.role !== role) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  // Load the proper model
  try {
    if (role === "recruiter") {
      req.company = await Company.findById(req.auth.id).select("-password");
    } else if (role === "user") {
      req.user = await User.findById(req.auth.id).select("-password");
    }
    return next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
