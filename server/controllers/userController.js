import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// @desc    Register new user
// @route   POST /api/users/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = "";
    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path);
      imageUrl = upload.secure_url;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token: generateToken(user._id, "user"),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    User login
// @route   POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          resume: user.resume,
        },
        token: generateToken(user._id, "user"),
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

// @desc    Get user data (Private)
export const getUserData = async (req, res) => {
  try {
    // req.user is populated by protectAccount middleware
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply for a job (Private)
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.user._id;

  try {
    const isAlreadyApplied = await JobApplication.findOne({ jobId, userId });

    if (isAlreadyApplied) {
      return res
        .status(400)
        .json({ success: false, message: "Already applied for this job" });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.status(404).json({ success: false, message: "Job Not Found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res.json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user applications (Private)
export const getUserJobApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile (resume) (Private)
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res
        .status(400)
        .json({ success: false, message: "No resume file provided" });
    }

    const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { resume: resumeUpload.secure_url },
      { new: true },
    );

    return res.json({
      success: true,
      message: "Resume Updated",
      resume: updatedUser.resume,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
