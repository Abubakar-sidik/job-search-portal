import express from "express";
import {
  registerUser,
  loginUser,
  applyForJob,
  getUserData,
  getUserJobApplication,
  updateUserResume,
} from "../controllers/userController.js";
import upload from "../config/multer.js"; // Using your central multer config
import { protectAccount } from "../middlewares/authMiddleware.js";

const router = express.Router();

// --- Public Routes ---

// Route to register a new user (with profile image)
router.post("/register", upload.single("image"), registerUser);

// Route for user login
router.post("/login", loginUser);

// --- Private Routes (Requires JWT) ---

// Route to get logged-in user data
router.get("/user", protectAccount, getUserData);

// Route to apply for a job
router.post("/apply", protectAccount, applyForJob);

// Route to get all jobs a user has applied for
router.get("/applications", protectAccount, getUserJobApplication);

// Route to update user profile (resume upload)
router.post(
  "/update-resume",
  protectAccount,
  upload.single("resume"),
  updateUserResume,
);

export default router;
