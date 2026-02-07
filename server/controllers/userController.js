import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// get user data
export const getUserData = async (req, res) => {
  const userId = req.auth().userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "user Not Found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Apply for a job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;

  try {
    const istAlreadyApplied = await JobApplication.find({ jobId, userId });

    if (istAlreadyApplied.length > 0) {
      return res.json({ success: false, message: "Already applied" });
    }

    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res.json({ success: false, message: "Job Not Found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userIde,
      jobId,
      date: Date.now(),
    });

    res.json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get user applied application
export const getUserJobApplication = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const applicantions = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category  level salary")
      .exec();

    if (!applicantions) {
      return res.json({ success: false, message: "No job applications found" });
    }

    return res.json({ success: true, applicantions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//update user profile (resume)
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth().userId;

    const resumeFile = req.file;

    const userData = await User.findById(userId);

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }

    await userData.save();

    return res.json({ success: true, message: "Resume Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// mange the users with clerk locally
export const syncUser = async (req, res) => {
  try {
    // clerkMiddleware provides req.auth()
    // req.auth() contains the userId from the Clerk Token
    const { userId } = req.auth();
    const { email, name, image } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId: userId }, // Find user with this ID
      { email, name, image }, // Update with this data
      { upsert: true, new: true }, // IF NOT FOUND: Create it. Return the new doc.
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
