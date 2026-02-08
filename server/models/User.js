import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Removed clerkId as we are using custom JWT
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true, // Normalizes emails to prevent duplicate accounts (e.g., User@Email.com vs user@email.com)
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6, // Basic security check
    },
    resume: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
); // Automatically adds createdAt and updatedAt fields

// This check prevents Mongoose from trying to re-compile the model on hot-reloads
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
