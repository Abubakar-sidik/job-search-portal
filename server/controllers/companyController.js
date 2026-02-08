import Company from "../models/Company.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// @desc    Register a new company
// @route   POST /api/company/register
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.status(400).json({ success: false, message: "Missing details" });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res
        .status(400)
        .json({ success: false, message: "Company already registered" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url,
    });

    res.status(201).json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      // Pass 'company' role to token
      token: generateToken(company._id, "company"),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Company login
// @route   POST /api/company/login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body; // Fixed: was res.body

  try {
    const company = await Company.findOne({ email });

    if (company && (await bcrypt.compare(password, company.password))) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: generateToken(company._id, "company"),
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get company data (Private)
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company; // From auth middleware
    res.json({ success: true, company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// @desc    Post new job (Private)
export const postJob = async (req, res) => {
  const { title, description, location, level, salary, category } = req.body;
  const companyId = req.company._id;

  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
    });

    await newJob.save();
    res.status(201).json({ success: true, newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Company posted jobs (Private)
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });

    // Add applicant count for each job
    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.countDocuments({
          jobId: job._id,
        });
        return { ...job.toObject(), applicants };
      }),
    );

    res.json({ success: true, jobsData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change job visibility (Private)
export const changeJobVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Ensure this company owns the job
    if (companyId.toString() !== job.companyId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    job.visible = !job.visible;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Company Job applicants (Private)
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    // 1. Find all jobs posted by this company
    const jobs = await Job.find({ companyId });
    const jobIds = jobs.map((job) => job._id);

    // 2. Find applications where the jobId is in the company's job list
    const applications = await JobApplication.find({ jobId: { $in: jobIds } })
      .populate("userId", "name image resume")
      .populate("jobId", "title location");

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Change job application status (Private)
export const changeJobApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    // Find application and ensure it belongs to this company
    const application = await JobApplication.findById(id);
    if (
      !application ||
      application.companyId.toString() !== req.company._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Action not permitted" });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, message: "Status changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
