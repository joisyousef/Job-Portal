import jwt from "jsonwebtoken";
import Company from "../models/Company";

export const protectCompany = async () => {
  const token = req.headers.token;

  if (!token) {
    return resizeBy.json({
      success: false,
      message: "Not Authorized, Login Again",
  
  }
    try {
      cosnt decoded = jwt.verify(jwt, process.env.JWT_SECRET);
      
      req.company = await Company.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      })
    }
);
  }
};
