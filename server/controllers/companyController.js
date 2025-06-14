// server/controllers/companyController.js
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import generateToken from "../utils/generateToken.js";

/**
 * POST /api/company/register
 */
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    if (await Company.findOne({ email })) {
      return res.status(409).json({
        success: false,
        message: "Company already registered",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const uploadResult = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: uploadResult.secure_url,
    });

    res.status(201).json({
      success: true,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken({
        id: company._id,
        email: company.email,
        role: "recruiter",
      }),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/company/login
 */
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });
    if (!company || !(await bcrypt.compare(password, company.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken({
        id: company._id,
        email: company.email,
        role: "recruiter",
      }),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/company/company
 * (protected, recruiter-only)
 */
export const getCompanyData = async (req, res) => {
  // `protect` + `protectRole("recruiter")` have already loaded req.company
  res.json({ success: true, company: req.company });
};

/**
 * POST /api/company/post-job
 * (protected, recruiter-only)
 */
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category } = req.body;
  const companyId = req.company._id;

  try {
    const newJob = await Job.create({
      title,
      description,
      location,
      salary,
      level,
      category,
      companyId,
      date: Date.now(),
    });
    res.status(201).json({ success: true, job: newJob });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/company/list-jobs
 * (protected, recruiter-only)
 */
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.company._id });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/company/applicants
 * (protected, recruiter-only)
 */
export const getCompanyJobApplicants = async (req, res) => {
  // TODO: implement fetching applicant data per job
  res.status(501).json({ success: false, message: "Not implemented" });
};

/**
 * POST /api/company/change-status
 * (protected, recruiter-only)
 */
export const changeJobApplicationsStatus = async (req, res) => {
  // TODO: implement status change logic
  res.status(501).json({ success: false, message: "Not implemented" });
};

/**
 * POST /api/company/change-visiblity
 * (protected, recruiter-only)
 */
export const changeVisiblity = async (req, res) => {
  const { id: jobId } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Only the owning recruiter may toggle visibility
    if (job.companyId.toString() !== req.company._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    job.visible = !job.visible;
    await job.save();

    res.json({ success: true, job });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
