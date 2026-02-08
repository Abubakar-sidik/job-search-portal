import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Corrected reference to Job model
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected"], // Optional: restricts status values
    },
    date: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent re-definition error in development
const JobApplication =
  mongoose.models.JobApplication ||
  mongoose.model("JobApplication", JobApplicationSchema);

export default JobApplication;
