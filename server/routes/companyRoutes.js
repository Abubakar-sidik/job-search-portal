import express from "express";
import {
  registerCompany,
  loginCompany,
  getCompanyData,
  postJob,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  changeJobApplicationStatus,
  changeJobVisibility,
} from "../controllers/companyController.js";
import upload from "../config/multer.js";
import { protectAccount } from "../middlewares/authMiddleware.js"; // Standardized name

const router = express.Router();

// --- Public Routes ---

// Register company (with logo upload)
router.post("/register", upload.single("image"), registerCompany);

// Company login
router.post("/login", loginCompany);

// --- Private Routes (Requires JWT) ---

// Get logged-in company profile data
router.get("/data", protectAccount, getCompanyData);

// Post a new job opening
router.post("/post-jobs", protectAccount, postJob);

// Get all applicants for the company's jobs
router.get("/applicants", protectAccount, getCompanyJobApplicants);

// Get a list of all jobs posted by this company
router.get("/list-jobs", protectAccount, getCompanyPostedJobs);

// Change the status of a specific job application (Accepted/Rejected)
router.post("/change-status", protectAccount, changeJobApplicationStatus);

// Toggle job visibility (On/Off)
router.post("/change-job-visibility", protectAccount, changeJobVisibility);

export default router;
