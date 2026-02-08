import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import User from "../models/User.js";

export const protectAccount = async (req, res, next) => {
  // 1. Unified Token Retrieval
  const token = req.headers.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    // 2. Decode Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    // 3. Optimized Role-Based Search
    if (role === "company") {
      req.company = await Company.findById(id).select("-password");
      if (!req.company) return sendUnauthorized(res, "Company");
    } else if (role === "user") {
      req.user = await User.findById(id).select("-password");
      if (!req.user) return sendUnauthorized(res, "User");
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token role" });
    }

    next();
  } catch (error) {
    // 4. Detailed Error handling (Optional: check for 'TokenExpiredError')
    const message =
      error.name === "TokenExpiredError"
        ? "Token expired"
        : "Token is not valid";
    res.status(401).json({ success: false, message });
  }
};

// Helper function to keep code clean and fix the status code to 401
const sendUnauthorized = (res, type) => {
  return res
    .status(401)
    .json({ success: false, message: `${type} not found or unauthorized` });
};
