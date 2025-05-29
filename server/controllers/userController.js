import { User } from "@clerk/express";

// Get User Data
export const getUserData = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
      res.json({
        success: true,
        user,
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {};

// Get user's applied jobs
export const getUserJobApplication = async (req, res) => {};

// Update User Profile (Resume)
export const updateUserResume = async (req, res) => {};
