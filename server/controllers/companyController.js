import Company from "../models/Company.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import { json } from "express";

// Register a new company

export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  // get logo image
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing details" });
  }

  // create user but check if email already exists

  try {
    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      return res.json({
        success: false,
        message: "Company already registered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUplaod = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUplaod.secure_url,
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },

      token: generateToken(company._id),

      // authenticating the company using auth token
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Company login

export const loginCompany = async (req, res) => {
  const { email, password } = res.body;

  try {
    const company = await Company.findOne({ email });

    if (await bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },

        token: generateToken(company._id),
      });
    } else {
      res.json({ success: false, message: "Invalide email or password" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get company data

export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;
    res.json({ success: true, company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// post new job

export const postJob = async (req, res) => {
  const { title, description, location, level, salary, category } = req.body;

  const companyId = req.company._id;

  // console.log(companyId, { title, description, location, level, salary });

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

    res.json({ success: true, newJob });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Company posted jobs

export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;

    const jobs = await Job.find({ companyId });

    //  Adding number of applicants infor in data
    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      }),
    );

    res.json({ success: true, jobsData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Change job visibility
export const changeJobVisibility = async (req, res) => {
  try {
    const { id } = req.body;

    const companyId = req.company._id;
    // get job data acodine to id
    const job = await Job.findById(id);

    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
    }

    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Company Job applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    // find job applications and populate related data
    const applications = await JobApplication.find({ companyId })
      .populate("userId", "name image resume")
      .populate("jobId", "title location category level salary")
      .exec();

    return res.json({ success: true, applications });
  } catch (error) {
    (res, json({ success: false, message: error.message }));
  }
};

// Change job application status
export const changeJobApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    // find job appllication update status
    await JobApplication.findOneAndUpdate({ _id: id }, { status });
    res.json({ success: true, message: "Status changed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
