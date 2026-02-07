import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  userIde: { type: String, ref: "User", require: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    require: true,
  },
  jobI: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },

  status: {
    type: String,
    default: "Pending",
  },
  date: { type: Number, require: true },
});

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);

export default JobApplication;
