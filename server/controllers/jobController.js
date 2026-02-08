import Job from "../models/Job.js";

// @desc    Get all visible jobs
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    // We only want jobs where visible is true
    // Populate company details but exclude sensitive data like password
    const jobs = await Job.find({ visible: true }).populate({
      path: "companyId",
      select: "-password",
    });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id).populate({
      path: "companyId",
      select: "-password",
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    // Check if error is due to an invalid MongoDB ObjectID
    if (error.kind === "ObjectId") {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
