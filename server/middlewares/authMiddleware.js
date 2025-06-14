import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

<<<<<<< HEAD
export const protectCompany = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    // fetch from the correct collection based on role
    if (role === "company") {
      req.user = await Company.findById(id).select("-password");
    } else {
      req.user = await User.findById(id).select("-password");
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
=======
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
>>>>>>> authentication
  }
};

// usage: only allow certain roles
export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not allowed to access this resource`,
      });
    }
    next();
  };
