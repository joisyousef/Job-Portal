import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";

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
