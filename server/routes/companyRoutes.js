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
import { protectCompany } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register company

router.post("/register", upload.single("image"), registerCompany);

// Company login
router.post("/login", loginCompany);

// get company data

router.get("/company", protectCompany, getCompanyData);

// post new job

router.post("/post-job", protectCompany, postJob);

// Get Company Job applicants

router.get("/applicants", protectCompany, getCompanyJobApplicants);

// Get Company posted jobs

router.get("/list-jobs", protectCompany, getCompanyPostedJobs);

// Change job application status
router.post("/change-status", protectCompany, changeJobApplicationStatus);

// Change application visibility

router.post("/change-job-visibility", protectCompany, changeJobVisibility);

export default router;
