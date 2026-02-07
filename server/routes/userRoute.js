import express from "express";
import multer from "multer";
import {
  applyForJob,
  getUserData,
  getUserJobApplication,
  updateUserResume,
  syncUser,
} from "../controllers/userController.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

//Route to get user data
router.get("/user", getUserData);

// Route to apply for a job
router.post("/apply", applyForJob);

// Route to get applied jobs data
router.get("/applications", getUserJobApplication);

// Route to update user profile (resume)
router.post("/update-resume", upload.single("resume"), updateUserResume);
router.post("/sync", requireAuth(), syncUser);
export default router;
