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
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;
  try {
    const isAlreadyApplied = await JobApplication.find({ jobId, userId });

    if (isAlreadyApplied.length > 0) {
      return res.json({
        success: false,
        message: "You have already applied for this job",
      });
    }
    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.json({
        success: false,
        message: "Job not found",
      });
    }
    await JobApplication.create({
      userId,
      jobId,
      CompanyId: jobData.CompanyId,
      // status: "Pending",
      date: Date.now(),
    });
    res.json({
      success: true,
      message: "Job application submitted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's applied jobs
export const getUserJobApplication = async (req, res) => {};

// Update User Profile (Resume)
export const updateUserResume = async (req, res) => {};
