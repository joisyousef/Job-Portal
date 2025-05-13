import Company from "../models/Company";
import bcrypt from "bcrypt";

// Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;
  if (!name | !email | !password | !imageFile) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({
        success: false,
        message: "Company already registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
  } catch (error) {}
};

// Company login
export const loginCompany = async (req, res) => {};

// Get company data
export const getCompanyData = async (req, res) => {};

// Post a new job
export const postJob = async (req, res) => {};

// Get company job application
export const getCompanyJobApplicants = async (req, res) => {};

// Get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {};

// Change job application status
export const changeJobApplicationsStatus = async (req, res) => {};

// Change job visiblity
export const changeVisiblity = async (req, res) => {};
