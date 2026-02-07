import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  location: { type: String, require: true },
  category: { type: String, require: true },
  level: { type: String, require: true },
  salary: { type: Number, require: true },
  date: { type: Number, require: true },
  visibility: { type: Boolean, default: true },
  CompanyId: { type: mongoose.Schema.ObjectId, ref: "Company", require: true },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
