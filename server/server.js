import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoute.js";
import companyRouter from "./routes/companyRoutes.js";
import mongoose from "mongoose";

// Initialize express
const app = express();

// connect to database
await connectDB()
  .then()
  .catch((err) => console.error("MongoDB Connection Error:", err));
// Add this temporarily to server.js
mongoose.connection.on("connected", async () => {
  try {
    await mongoose.connection.db.collection("users").dropIndex("clerkId_1");
    console.log("Stale Clerk index dropped successfully");
  } catch (e) {
    console.log("Index already gone or error:", e.message);
  }
});
await connectCloudinary();
// Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => res.send("API Working"));

// app.use("/api/company", companyRoutes);
app.use("/api/company", companyRouter);
app.use("/api/jobs", jobRoutes);

app.use("/api/users", userRoutes);

//Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
