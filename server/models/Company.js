import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
    },
    email: {
      type: String,
      required: [true, "Company email is required"],
      unique: true,
      lowercase: true, // Ensures "Apple@me.com" and "apple@me.com" are the same
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Company logo is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// Check if the model exists before defining it to prevent OverwriteModelError
const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);

export default Company;
